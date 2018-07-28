"use strict";
cc._RF.push(module, 'ad94fuLKW1P+ZZsL7ky1y3Y', 'FragmentObject');
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