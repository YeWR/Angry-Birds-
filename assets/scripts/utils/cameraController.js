import {getWorldLocation } from '../utils/common';
import {changeRectangle } from '../utils/common';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        // 是否激活
        this.active = false;
        // 初始位置
        this.initPosition = this.node.getPosition();
        // 屏幕位置
        this.setScreenRectangle();
    },

    bindCenter : function(center){
        this.active = true;
        this.getComponent(cc.Camera).zoomRatio = 1;
        this.center = center;
        this.node.setPosition(this.initPosition.x, this.initPosition.y);   
        this.previousCenterPosition = getWorldLocation(this.center.node);
    },

    // 设置开始相机
    setStartScreen(){
        let duration = 1;
        let action = cc.moveTo(duration, 0, 0);
        this.node.runAction(action);
    },

    // 设置屏幕rec
    setScreenRectangle : function(){
        let bg = this.node.parent;
        let size = bg.getContentSize();
        let position = getWorldLocation(bg);
        // 大屏幕
        this.screen = changeRectangle(position, size);

        // 偏移
        let canvas = bg.parent;
        let canvasPos = canvas.getPosition();
        let canvasSize = canvas.getContentSize();
        // 小屏幕
        let canvasScree = changeRectangle(canvasPos, canvasSize);
        let delta = new cc.Vec2(this.screen[1] - canvasScree[1], this.screen[3] - canvasScree[3]);
        this.cameraMinPos = canvasPos;
        this.cameraMaxPos = canvasPos.add(delta);

    },

    // 移动相机
    moveCamera : function(delta){
        // 相机世界坐标
        let locationCamera = getWorldLocation(this.node);
        // 相机当前位置
        let locationCameraNow = this.node.getPosition();
        // 可以移动x方向
        if(locationCamera.x + delta.x > this.cameraMinPos.x && locationCamera.x + delta.x < this.cameraMaxPos.x){
            locationCameraNow.x += delta.x;
        }
        // 可以移动y方向
        if(locationCamera.y + delta.y > this.cameraMinPos.y && locationCamera.y + delta.y < this.cameraMaxPos.y){
            locationCameraNow.y += delta.y;
        }
        this.node.setPosition(locationCameraNow.x, locationCameraNow.y);        
    },

    start () {

    },

    update (dt) {
        if(this.active){
            let center = this.center;
            let camera = this.getComponent(cc.Camera);
            if(center && center.node && camera && center.ready === -1){
                // 物体当前世界坐标
                let locationCenter = getWorldLocation(center.node);
                // 物体上一dt世界坐标
                let location = this.previousCenterPosition;
                this.previousCenterPosition = locationCenter;
                // 相机世界可能移动坐标
                let delta = locationCenter.sub(location);
                // 移动相机
                this.moveCamera(delta);
            }
        }
        else{
            let zoomRatio = this.getComponent(cc.Camera).zoomRatio;
            let canvas = this.node.parent.parent;
            let size = canvas.getContentSize();
            let ratioMax = Math.max(size.width / (this.screen[1] - this.screen[0]), size.height / (this.screen[3] - this.screen[2])) + 0.01;
            
            zoomRatio -= 0.0025;
            if(zoomRatio >= ratioMax){
                this.getComponent(cc.Camera).zoomRatio = zoomRatio;
            }
        }
    },
});
