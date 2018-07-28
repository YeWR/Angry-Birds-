cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    onBackGame : function(){
        cc.director.loadScene("start");
    },

    onIntroGame : function(){
        cc.director.loadScene("introduction");
    },

    start () {

    },

    // update (dt) {},
});
