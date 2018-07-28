const BirdObject = require("BirdObject")

cc.Class({
    extends: BirdObject,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        this.init('bird');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill : function(event){

    },

    start () {

    },

    //  update : function(dt) {
    //  },
});
