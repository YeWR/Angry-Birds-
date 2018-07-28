"use strict";
cc._RF.push(module, 'e426fUBSXtM6qhf4OJIo6P0', 'BirdFly');
// scripts/objects/BirdFly.js

'use strict';

var _common = require('../utils/common');

var BirdObject = require("BirdObject");


cc.Class({
    extends: BirdObject,

    properties: {},

    onLoad: function onLoad() {
        this.init('bird_fly');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill: function onSkill(event) {
        // 碰撞后不生效
        if (this.crashFlag || !event) {
            return;
        }
        // 触摸位置
        var x = event.getLocationX();
        var y = event.getLocationY();
        // 相机
        var cameraController = this.node.parent.parent.getChildByName('camera').getComponent('cameraController');
        var camera_delta = cameraController.node.getPosition().sub(cameraController.initPosition);
        // 世界坐标
        var location = (0, _common.getWorldLocation)(this.node);
        location = location.sub(camera_delta);
        // 相对于bg的坐标
        // location = location.sub(locationParent);
        // 差
        var delta_x = x - location.x;
        var delta_y = y - location.y;
        var delta = Math.hypot(delta_x, delta_y);
        var vel_x = this.emitVelocityMax * 0.65 * delta_x / delta;
        var vel_y = this.emitVelocityMax * 0.65 * delta_y / delta;
        // 设置旋转方向
        var rotation = 180 * Math.atan2(vel_y, vel_x) / Math.PI;
        this.node.setRotation(rotation);
        // 设置速度
        this.setVelocity(vel_x, vel_y);
    },

    start: function start() {}
});

cc._RF.pop();