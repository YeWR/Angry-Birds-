(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/Pig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fafe0dtI1BL4KufEPymX4Qp', 'Pig', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Pig.js.map
        