"use strict";
cc._RF.push(module, '4f8a6wCXfpGQ58VgGpS1v7Y', 'GameIntro');
// scripts/GameIntro.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        //返回按钮
        btn_back: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},


    onBackGame: function onBackGame() {
        cc.director.loadScene("help");
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();