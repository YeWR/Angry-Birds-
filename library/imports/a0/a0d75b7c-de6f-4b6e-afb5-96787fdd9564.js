"use strict";
cc._RF.push(module, 'a0d75t83m9Lbq+1lnh/3ZVk', 'FragmentBird');
// scripts/objects/FragmentBird.js

"use strict";

var MyObject = require("FragmentObject");

cc.Class({
    extends: MyObject,

    properties: {},

    onLoad: function onLoad() {
        //图片路径 
        this.spriteImage = 'resources/textures/fragments/';
    }
});

cc._RF.pop();