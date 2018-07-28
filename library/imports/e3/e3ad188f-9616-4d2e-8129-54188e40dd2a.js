"use strict";
cc._RF.push(module, 'e3ad1iPlhZNLoEpVBiOQN0q', 'Stone');
// scripts/objects/Stone.js

"use strict";

var MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {},

    onLoad: function onLoad() {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/stones/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentStone";
        // 分数
        this.score = 10 * this.blood_max;
    }
});

cc._RF.pop();