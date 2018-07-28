"use strict";
cc._RF.push(module, '19310rFw2hJ2Kn4C3HZhprh', 'Bird');
// scripts/objects/Bird.js

"use strict";

var BirdObject = require("BirdObject");

cc.Class({
    extends: BirdObject,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.init('bird');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill: function onSkill(event) {},

    start: function start() {}
}

//  update : function(dt) {
//  },
);

cc._RF.pop();