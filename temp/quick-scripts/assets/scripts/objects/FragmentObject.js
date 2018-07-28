(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/FragmentObject.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ad94fuLKW1P+ZZsL7ky1y3Y', 'FragmentObject', __filename);
// scripts/objects/FragmentObject.js

'use strict';

var _common = require('../utils/common');

cc.Class({
    extends: cc.Component,

    properties: {
        //类型
        type: '',
        // 存活时间 /s
        duration: 0,
        // 最大速度
        velocityMax: 100
    },

    // 出现
    init: function init(imageId) {
        (0, _common.spriteUpdate)(this.node.getComponent(cc.Sprite), this.spriteImage + this.type + "_" + imageId + ".png");
        this.scheduleOnce(function () {
            this._onDeath();
        }, this.duration);
    },

    // 设置刚体速度
    setVelocity: function setVelocity(vel_x, vel_y) {
        var rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 死亡处理
    _onDeath: function _onDeath() {
        // 动画效果
        this.node.destroy();
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
        //# sourceMappingURL=FragmentObject.js.map
        