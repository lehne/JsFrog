(function (window) {
    function Vehicle(vehicleName, imgVehicle, x_end) {
        this.initialize(vehicleName, imgVehicle, x_end);
    }
    Vehicle.prototype = new createjs.BitmapAnimation();

    // public properties:
    Vehicle.prototype.IDLEWAITTIME = 40;
    Vehicle.prototype.bounds = 0; //visual radial size
    Vehicle.prototype.hit = 0;     //average radial disparity
    // constructor:
    Vehicle.prototype.BitmapAnimation_initialize = Vehicle.prototype.initialize; //unique to avoid overiding base class
    //75 pixels/sec
    Vehicle.prototype.speed = 1;
    var quaterFrameSize;

    Vehicle.prototype.initialize = function (vehicleName, imgVehicle, x_end) {
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgVehicle],
            frames: { width: 50, height: 23, count: 1, regX: 25, regY: 11 },
            animations: {
                // start, end, next, frequency
                driving: [0]
            }
        });

        createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, true, true, false);

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.x_end = x_end;

        quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 4;

        // start playing the first sequence:
        this.gotoAndPlay("driving");     //animate

        this.name = vehicleName;
        // 1 = right & -1 = left 
        this.direction = 1;
        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;
    }

    Vehicle.prototype.tick = function () {
        // Moving the sprite based on the direction & the speed
        if (this.direction == -1) {
            this.x -= this.speed;
            this.gotoAndPlay("driving");
        } else if (this.direction == 1) {
            this.x += this.speed;
            this.gotoAndPlay("driving_h");
        } 
        // Hit testing the screen width, otherwise our sprite would disappear
        if (this.x >= this.x_end - (quaterFrameSize + 1) || this.x < (quaterFrameSize + 1)) {
            this.gotoAndPlay("driving");
            this.idleWaitTicker = this.IDLEWAITTIME;
        }
    }

    window.Vehicle = Vehicle;
} (window));