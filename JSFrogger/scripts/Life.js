(function (window) {
    function Life(imgLife, x_end) {
        this.initialize(imgLife, x_end);
    }
    Life.prototype = new createjs.BitmapAnimation();

    // constructor:
    Life.prototype.BitmapAnimation_initialize = Life.prototype.initialize; //unique to avoid overiding base class


    Life.prototype.initialize = function (imgLife, x_end) {
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgLife],
            frames: { width: 30, height: 30, count: 1,regX: 15,regY:15 },
            animations: {
                // start, end, next, frequency
                idle: 0
            }
        });

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.x_end = x_end;

        // start playing the first sequence:
        this.gotoAndPlay("idle");     //animate

        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;
    }

    Life.prototype.tick = function () {
        
    }

    window.Life = Life;
} (window));