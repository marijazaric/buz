/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
 
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
     
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.arithmetic = [];
        
        this.arithmetic.isFirstNumber = true;
        this.arithmetic.isSecondNumber = false;
        this.arithmetic.isThirdNumber = false;
        this.pos.mouse = -1;
         
        // define a basic walking animation (using all frames)
        // this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (me.input.isKeyPressed('left')) {
          // flip the sprite on horizontal axis
          this.renderable.flipX(true);
          // update the entity velocity
          this.body.vel.x -= this.body.accel.x * me.timer.tick;
          // change to the walking animation
          // if (!this.renderable.isCurrentAnimation("walk")) {
          //   this.renderable.setCurrentAnimation("walk");
          // }
        } else if (me.input.isKeyPressed('right')) {
          // unflip the sprite
          this.renderable.flipX(false);
          // update the entity velocity
          this.body.vel.x += this.body.accel.x * me.timer.tick;
          // change to the walking animation
          // if (!this.renderable.isCurrentAnimation("walk")) {
          //   this.renderable.setCurrentAnimation("walk");
          // }
        } else if (me.input.isKeyPressed('click')) {
            this.pos.mouse = Math.round(me.input.mouse.pos.x, 0);
            if ((this.pos.mouse - this.pos.x) > 0) {
                this.renderable.flipX(false);
                this.body.vel.x += this.body.accel.x * me.timer.tick;
            } else {
                this.renderable.flipX(true);
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
            }
            // console.log("click");
            // console.log(me.input.mouse.pos.x);
        } else if ((this.pos.mouse - this.pos.x) > -2 && 2 > (this.pos.mouse - this.pos.x)) {    
            this.body.vel.x = 0;
            this.pos.mouse = -1;
        } else if (this.pos.mouse == -1) {
            this.body.vel.x = 0;
        }
        // else {
        //     this.body.vel.x = 0;
        // }
       
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0 || me.input.mouse.pos.x != this.pos.x);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

game.HiveEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function(x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    this.renderable.addAnimation("spin",  [0, 1, 2, 3, 4, 5, 6, 7]);
    this.renderable.setCurrentAnimation("spin");
    this.body.setVelocity(1, 1);
    this.alwaysUpdate = true;
    this.arithmetic = [];
    this.arithmetic.value = (5).random(10);
    this.font = new me.BitmapFont("32x32_font", 32);
  },

  update : function (dt) {
    this.body.vel.y += this.body.accel.y * me.timer.tick;
    if (this.pos.y > 450) {
      this.pos.y = 0;
      this.arithmetic.value = (1).random(20);
    }
    this.body.update(dt);
    return this._super(me.Entity, 'update', [dt]);
  },

  draw: function (renderer) {
    this.font.draw(renderer, this.arithmetic.value, this.pos.x+32, this.pos.y+20);
    this._super(me.Entity, 'draw', [renderer]);
  },
 
  onCollision : function (response, other) {
    this.pos.y = -20;
    
    if (other.arithmetic.isFirstNumber) {
      other.arithmetic.firstNumber = this.arithmetic.value;
      other.arithmetic.isFirstNumber = false;
      other.arithmetic.isSecondNumber = true;
    }
    else if (other.arithmetic.isSecondNumber){
      other.arithmetic.secondNumber = this.arithmetic.value;
      other.arithmetic.isSecondNumber = false;
    }
    else if (!other.arithmetic.isSecondNumber && !other.arithmetic.isFirstNumber) {
      other.arithmetic.result = other.arithmetic.firstNumber + other.arithmetic.secondNumber;
      console.log(other.arithmetic.firstNumber + " + " + other.arithmetic.secondNumber + " = " + other.arithmetic.result);
      other.arithmetic.isFirstNumber = true;
    }

    this.arithmetic.value = (5).random(10);
    return false;
  }
});