(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/Bird.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '19310rFw2hJ2Kn4C3HZhprh', 'Bird', __filename);
// scripts/objects/Bird.js

"use strict";

var BirdObject = require("BirdObject");

cc.Class({
    extends: BirdObject,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.init('bird');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill: function onSkill(event) {},

    start: function start() {}
}

//  update : function(dt) {
//  },
);

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
        //# sourceMappingURL=Bird.js.map
        