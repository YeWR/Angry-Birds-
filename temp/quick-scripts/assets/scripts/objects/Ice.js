(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/Ice.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '327cdizN8pBupzS8i6Q7LEy', 'Ice', __filename);
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
        //# sourceMappingURL=Ice.js.map
        