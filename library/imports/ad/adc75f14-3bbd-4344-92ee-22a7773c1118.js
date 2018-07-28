"use strict";
cc._RF.push(module, 'adc758UO71DRJLuIqd3PBEY', 'FragmentStone');
// scripts/objects/FragmentStone.js

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