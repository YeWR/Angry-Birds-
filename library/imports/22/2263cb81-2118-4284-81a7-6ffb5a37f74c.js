"use strict";
cc._RF.push(module, '2263cuBIRhChIGnb/taN/dM', 'cameraController');
// scripts/utils/cameraController.js

'use strict';

var _common = require('../utils/common');

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        // 是否激活
        this.active = false;
        // 初始位置
        this.initPosition = this.node.getPosition();
        // 屏幕位置
        this.setScreenRectangle();
    },


    bindCenter: function bindCenter(center) {
        this.active = true;
        this.getComponent(cc.Camera).zoomRatio = 1;
        this.center = center;
        this.node.setPosition(this.initPosition.x, this.initPosition.y);
        this.previousCenterPosition = (0, _common.getWorldLocation)(this.center.node);
    },

    // 设置开始相机
    setStartScreen: function setStartScreen() {
        var duration = 1;
        var action = cc.moveTo(duration, 0, 0);
        this.node.runAction(action);
    },


    // 设置屏幕rec
    setScreenRectangle: function setScreenRectangle() {
        var bg = this.node.parent;
        var size = bg.getContentSize();
        var position = (0, _common.getWorldLocation)(bg);
        // 大屏幕
        this.screen = (0, _common.changeRectangle)(position, size);

        // 偏移
        var canvas = bg.parent;
        var canvasPos = canvas.getPosition();
        var canvasSize = canvas.getContentSize();
        // 小屏幕
        var canvasScree = (0, _common.changeRectangle)(canvasPos, canvasSize);
        var delta = new cc.Vec2(this.screen[1] - canvasScree[1], this.screen[3] - canvasScree[3]);
        this.cameraMinPos = canvasPos;
        this.cameraMaxPos = canvasPos.add(delta);
    },

    // 移动相机
    moveCamera: function moveCamera(delta) {
        // 相机世界坐标
        var locationCamera = (0, _common.getWorldLocation)(this.node);
        // 相机当前位置
        var locationCameraNow = this.node.getPosition();
        // 可以移动x方向
        if (locationCamera.x + delta.x > this.cameraMinPos.x && locationCamera.x + delta.x < this.cameraMaxPos.x) {
            locationCameraNow.x += delta.x;
        }
        // 可以移动y方向
        if (locationCamera.y + delta.y > this.cameraMinPos.y && locationCamera.y + delta.y < this.cameraMaxPos.y) {
            locationCameraNow.y += delta.y;
        }
        this.node.setPosition(locationCameraNow.x, locationCameraNow.y);
    },

    start: function start() {},
    update: function update(dt) {
        if (this.active) {
            var center = this.center;
            var camera = this.getComponent(cc.Camera);
            if (center && center.node && camera && center.ready === -1) {
                // 物体当前世界坐标
                var locationCenter = (0, _common.getWorldLocation)(center.node);
                // 物体上一dt世界坐标
                var location = this.previousCenterPosition;
                this.previousCenterPosition = locationCenter;
                // 相机世界可能移动坐标
                var delta = locationCenter.sub(location);
                // 移动相机
                this.moveCamera(delta);
            }
        } else {
            var zoomRatio = this.getComponent(cc.Camera).zoomRatio;
            var canvas = this.node.parent.parent;
            var size = canvas.getContentSize();
            var ratioMax = Math.max(size.width / (this.screen[1] - this.screen[0]), size.height / (this.screen[3] - this.screen[2])) + 0.01;

            zoomRatio -= 0.0025;
            if (zoomRatio >= ratioMax) {
                this.getComponent(cc.Camera).zoomRatio = zoomRatio;
            }
        }
    }
});

cc._RF.pop();