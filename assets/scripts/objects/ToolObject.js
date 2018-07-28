import {getEffect} from '../utils/common';
import {spriteUpdate} from '../utils/common';
import {getWorldLocation } from '../utils/common';
import {getGameController } from '../utils/common';
import {scoreAnimation } from '../utils/common';

cc.Class({
    extends: cc.Component,

    properties: {
        //满血血量 : 100
        blood_max : 0,
        //当前血量
        blood : 0,
        //护甲 =.=，对非鸟类的冲撞的伤害减少比例
        armor : 0,
        //脆性 =.= 对鸟类的冲撞的伤害增加比例
        crisp : 0,
        // 碎片prefab 
        fragmentPrefab : {
            default : null,
            type : cc.Prefab
        },
        // 死亡音频
        deathAudio : {
            url: cc.AudioClip,
            default: null
        },
        //类型
        type : '',
    },

    // 每次处理完碰撞体接触逻辑时被调用，
    onPostSolve: function (contact, selfCollider, otherCollider) {
        /* 碰撞对object的影响 */
        // object角度（弧度）
        let angle = 180/Math.PI * this.node.rotation;
        // 伤害
        let effect = getEffect(selfCollider, otherCollider, angle);
        if(effect === 0){
            return;
        }
        // 碰撞物体的种类
        let name = otherCollider.node.name;
        // 切换图片
        let sprite = this.node.getComponent(cc.Sprite);
        // 受伤
        this.onAttack(effect, name);
        // 是否死亡
        if(!this.blood){
            return;
        }
        else if(this.blood > 0 && this.blood <= this.blood_max / 3 && this.imageId !== 2){
            this.imageId = 2;
            spriteUpdate(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }
        else if(this.blood > this.blood_max / 3 && this.blood <= this.blood_max * 2 / 3 && this.imageId !== 1){
            this.imageId = 1;
            spriteUpdate(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }
    },

    // 设置刚体速度
    setVelocity : function(vel_x, vel_y){
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 设置碎片
    setFragment : function(){
        if(!this.fragmentPrefab){
            return;
        }
        let location = getWorldLocation(this.node);
        let num = Math.floor(Math.random() * 4) + 3;

        for(let i = 0; i < num; ++i){
            let imageId = Math.floor(3 * Math.random());
            if(imageId >= 3){
                imageId = 2;
            }
            // 碎屑node
            let fragmentNode = cc.instantiate(this.fragmentPrefab);
            let parent = this.node.parent;
            let locationParent = getWorldLocation(parent);
            // 相对位置
            let delta = location.sub(locationParent);
            // 随机x,y
            let x = delta.x + this.node.getContentSize().width * (Math.random() - 0.5);
            let y = delta.y + this.node.getContentSize().height * (Math.random() - 0.5);
            parent.addChild(fragmentNode);
            fragmentNode.setPosition(x, y);
            // 碎屑
            let fragment = fragmentNode.getComponent(this.fragmentType);
            let vel_x = fragment.velocityMax * (Math.random() - 0.5);
            let vel_y = fragment.velocityMax * (Math.random() - 0.5);
            fragment.setVelocity(vel_x, vel_y);
            fragment.init(imageId);
        }
    },

    //收到伤害
    onAttack : function(effect, name){
        if(this.blood <= 0){
            return;
        }
        // 鸟对object的伤害远高于其他刚体对木头的伤害
        if(name !== null && name.indexOf('bird') !== -1 ){
            this.blood -= effect * this.crisp;
        }
        else{
            this.blood -= effect / this.armor;
        }
        if(this.blood <= 0){
            this.blood = 0;
            this._onDeath();
        }
    },

    // 死亡处理
    _onDeath : function(){
        if(this.node){
            // 血量为0
            this.blood = 0;
            // 动画效果
            this.setFragment();
            // 先缩小到0
            this.node.setContentSize(0, 0);
            this.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame();
            // 播放音效
            this._onPlayAudio();
            // 延时
            let duration = 1;
            // 分数
            if(this.score){
                // 分数动画
                scoreAnimation(this.node, this.score, duration);
                const gameController = getGameController(this.node);
                gameController.addScore(this.score);
            }
             // 延时销毁本体
             this.scheduleOnce(function(){
                this.node.destroy()
            }, duration);
        }
    },

    // 播放音效 死亡音效
    _onPlayAudio : function(){
        if(this.deathAudio){
            this.currentAudio = cc.audioEngine.play(this.deathAudio, false, 1);
        }
    },

    //停止音效
    _onStopAudio : function(){
        cc.audioEngine.stop(this.currentAudio);
    },
});
