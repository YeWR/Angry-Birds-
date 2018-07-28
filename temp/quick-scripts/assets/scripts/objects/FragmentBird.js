(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/FragmentBird.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a0d75t83m9Lbq+1lnh/3ZVk', 'FragmentBird', __filename);
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
        //# sourceMappingURL=FragmentBird.js.map
        