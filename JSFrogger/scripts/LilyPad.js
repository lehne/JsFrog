(function (window) {
    function LilyPad(imgLilyPad, x_start, x_end) {
        this.initialize(imgLilyPad, x_start, x_end);
    }
    LilyPad.prototype = new createjs.BitmapAnimation();

    // public properties:
    LilyPad.prototype.bounds = 0;
    LilyPad.prototype.hit = 0;

    // constructor:
    LilyPad.prototype.BitmapAnimation_initialize = LilyPad.prototype.initialize; //unique to avoid overiding base class

    var quaterFrameSize;

    LilyPad.prototype.initialize = function (lilyPadName, imgLilyPad, x_end) {
        LilyPad.prototype.name = lilyPadName;
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgLilyPad], //image to use
            frames: { width: 36, height: 33, regX: 18, regY: 16.5 },
            animations: {
                empty: [0],
                frog: [1],
                gator: [2]
            }
        });

        createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, false, false, false);

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.x_end = x_end;

        quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 4;

        // start playing the first sequence:
        this.gotoAndPlay("idle"); 	//animate
        this.isInIdleMode = true;

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated monster if you disabled the shadow.
        this.name = "LilyPad";
        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;

        //Size of the Bounds for the collision's tests
        this.bounds = 33;
        this.hit = this.bounds;
    }

    LilyPad.prototype.tick = function () {
        if (this.alive && !this.isInIdleMode) {
            // Hit testing the screen width, otherwise our sprite would disappear
            // The lilyPad is blocked at each side but we keep the walk_right or walk_animation running
            if ((this.x + this.direction > quaterFrameSize) && (this.x + (this.direction * 2) < this.x_end - quaterFrameSize + 1)) {
                // Moving the sprite based on the direction & the speed
                this.x += this.vX * this.direction;
                this.y += this.vY * this.direction;
            }
        }
    }

    window.LilyPad = LilyPad;
} (window));