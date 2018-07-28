"use strict";
cc._RF.push(module, '327cdizN8pBupzS8i6Q7LEy', 'Ice');
// scripts/objects/Ice.js

"use strict";

var MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/ices/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentIce";
        // 分数
        this.score = this.blood_max;
    }
});

cc._RF.pop();