"use strict";
cc._RF.push(module, '45effzMBS1LlJO7SvrNO0oc', 'GameHelp');
// scripts/GameHelp.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},


    onBackGame: function onBackGame() {
        cc.director.loadScene("start");
    },

    onIntroGame: function onIntroGame() {
        cc.director.loadScene("introduction");
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();