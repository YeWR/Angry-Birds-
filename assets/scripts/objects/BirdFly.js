const BirdObject = require("BirdObject")
import {getWorldLocation} from '../utils/common';

cc.Class({
    extends: BirdObject,

    properties: {

    },

    onLoad : function () {
        this.init('bird_fly');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill : function(event){
        // 碰撞后不生效
        if(this.crashFlag || !event){
            return;
        }
        // 触摸位置
        let x = event.getLocationX();
        let y = event.getLocationY();
        // 相机
        let cameraController = this.node.parent.parent.getChildByName('camera').getComponent('cameraController');
        let camera_delta = cameraController.node.getPosition().sub(cameraController.initPosition);
        // 世界坐标
        let location = getWorldLocation(this.node);
        location = location.sub(camera_delta);
        // 相对于bg的坐标
        // location = location.sub(locationParent);
        // 差
        let delta_x = x - location.x;
        let delta_y = y - location.y;
        let delta = Math.hypot(delta_x, delta_y);
        let vel_x = this.emitVelocityMax * 0.65 * delta_x / delta;
        let vel_y = this.emitVelocityMax * 0.65 * delta_y / delta;
        // 设置旋转方向
        let rotation = 180 * Math.atan2(vel_y, vel_x) / Math.PI;
        this.node.setRotation(rotation);
        // 设置速度
        this.setVelocity(vel_x, vel_y);
    },

    start () {

    },
});
