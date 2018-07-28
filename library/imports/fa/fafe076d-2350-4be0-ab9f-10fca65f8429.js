"use strict";
cc._RF.push(module, 'fafe0dtI1BL4KufEPymX4Qp', 'Pig');
// scripts/objects/Pig.js

"use strict";

var MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //图片路径
        this.spriteImage = 'resources/textures/pigs/';
        //图片id
        this.imageId = 0;
        // 分数
        this.score = 10000;
    }
});

cc._RF.pop();