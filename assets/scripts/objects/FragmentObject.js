import {spriteUpdate} from '../utils/common';
cc.Class({
    extends: cc.Component,

    properties: {
        //类型
        type : '',
        // 存活时间 /s
        duration : 0,
        // 最大速度
        velocityMax : 100,
    },

    // 出现
    init : function(imageId){
        spriteUpdate(this.node.getComponent(cc.Sprite), this.spriteImage + this.type + "_" + imageId + ".png");
        this.scheduleOnce(function(){
            this._onDeath();
        }, this.duration);
    },

    // 设置刚体速度
    setVelocity : function(vel_x, vel_y){
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 死亡处理
    _onDeath : function(){
        // 动画效果
        this.node.destroy();
    },
});
