/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 80));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({

    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.arithmetic = [];
        this.arithmetic.score = -1;
        this.font = new me.BitmapFont("32x32_font", 32);
    },

    update : function () {
        if (this.arithmetic.score !== game.data.arithmetic.score) {
            this.arithmetic.score = game.data.arithmetic.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        this.font.draw (renderer, game.data.arithmetic.score, this.pos.x, this.pos.y);
    }

});
