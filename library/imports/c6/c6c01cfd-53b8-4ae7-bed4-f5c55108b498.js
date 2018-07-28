"use strict";
cc._RF.push(module, 'c6c01z9U7hK577U9cVRCLSY', 'Shelf');
// scripts/objects/Shelf.js

"use strict";

var MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {},

    onLoad: function onLoad() {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/shelfs/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentWood";
        // 分数
        this.score = 5000;
    }
});

cc._RF.pop();