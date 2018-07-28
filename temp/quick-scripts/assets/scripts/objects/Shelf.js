(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/Shelf.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c6c01z9U7hK577U9cVRCLSY', 'Shelf', __filename);
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
        //# sourceMappingURL=Shelf.js.map
        