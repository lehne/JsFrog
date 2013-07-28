(function (window) {
    function Frog(frogName, imgFrog, x_end) {
        this.initialize(frogName, imgFrog, x_end);
    }
    Frog.prototype = new createjs.BitmapAnimation();

    // public properties:
    Frog.prototype.IDLEWAITTIME = 40;
    Frog.prototype.bounds = 0; //visual radial size
    Frog.prototype.hit = 0;     //average radial disparity
    Frog.prototype.alive = true;
    Frog.prototype.mustMove = false;
    // constructor:
    Frog.prototype.BitmapAnimation_initialize = Frog.prototype.initialize; //unique to avoid overiding base class

    // variable members to handle the idle state
    // and the time to wait before walking again
    this.isInIdleMode = false;
    this.idleWaitTicker = 0;

    var quaterFrameSize;

    Frog.prototype.initialize = function (frogName, imgFrog, x_end) {
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgFrog],
            frames: { width: 30, height: 30, count: 8,regX: 15,regY:15 },
            animations: {
                // start, end, next, frequency
                hop: [0, 3, "idle"],
                hopH: [4,7,"idleH"],
                idle: 0,
                idleH: 4
            }
        });

        createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, true, true, false);

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.x_end = x_end;

        quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 4;

        // start playing the first sequence:
        this.gotoAndPlay("idle");     //animate

        this.name = frogName;
        // 1 = right & -1 = left and 2 = up and -2 = down
        this.direction = 2;
        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;
    }

    Frog.prototype.tick = function () {
        if (!this.isInIdleMode) {
            // Moving the sprite based on the direction & the speed
            var moveDistance = 32;
            if (this.mustMove == true) {
                if (this.direction == -2) {
                    this.y += moveDistance;
                } else if (this.direction == -1) {
                    this.x -= moveDistance;
                } else if (this.direction == 1) {
                    this.x += moveDistance;
                } else if (this.direction == 2) {
                    this.y -= moveDistance;
                }
                this.mustMove = false;
            }
            // Hit testing the screen width, otherwise our sprite would disappear
            if (this.x >= this.x_end - (quaterFrameSize + 1) || this.x < (quaterFrameSize + 1)) {
                this.gotoAndPlay("idle");
                this.idleWaitTicker = this.IDLEWAITTIME;
                this.isInIdleMode = true;
            }
        }
        else {
            this.idleWaitTicker--;

            if (this.idleWaitTicker == 0) {
                this.isInIdleMode = false;

                // Hit testing the screen width, otherwise our sprite would disappear
                if (this.x >= this.x_end - (quaterFrameSize + 1)) {
                    // We've reached the right side of our screen
                    // We need to walk left now to go back to our initial position
                    this.direction = -1;
                    this.gotoAndPlay("hop");
                }

                if (this.x < (quaterFrameSize + 1)) {
                    // We've reached the left side of our screen
                    // We need to walk right now
                    this.direction = 1;
                    this.gotoAndPlay("walk_h");
                }
            }
        }
    }

    Frog.prototype.hitPoint = function (tX, tY) {
        return this.hitRadius(tX, tY, 0);
    }

    Frog.prototype.hitRadius = function (tX, tY, tHit) {
        //early returns speed it up
        if (tX - tHit > this.x + this.hit) { return; }
        if (tX + tHit < this.x - this.hit) { return; }
        if (tY - tHit > this.y + this.hit) { return; }
        if (tY + tHit < this.y - this.hit) { return; }

        //now do the circle distance test
        return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
    }

    window.Frog = Frog;
} (window));