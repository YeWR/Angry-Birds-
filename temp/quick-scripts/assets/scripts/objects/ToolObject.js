(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/ToolObject.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4da25URRehEhbWfkmTw9xbJ', 'ToolObject', __filename);
// scripts/objects/ToolObject.js

'use strict';

var _common = require('../utils/common');

cc.Class({
    extends: cc.Component,

    properties: {
        //满血血量 : 100
        blood_max: 0,
        //当前血量
        blood: 0,
        //护甲 =.=，对非鸟类的冲撞的伤害减少比例
        armor: 0,
        //脆性 =.= 对鸟类的冲撞的伤害增加比例
        crisp: 0,
        // 碎片prefab 
        fragmentPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 死亡音频
        deathAudio: {
            url: cc.AudioClip,
            default: null
        },
        //类型
        type: ''
    },

    // 每次处理完碰撞体接触逻辑时被调用，
    onPostSolve: function onPostSolve(contact, selfCollider, otherCollider) {
        /* 碰撞对object的影响 */
        // object角度（弧度）
        var angle = 180 / Math.PI * this.node.rotation;
        // 伤害
        var effect = (0, _common.getEffect)(selfCollider, otherCollider, angle);
        if (effect === 0) {
            return;
        }
        // 碰撞物体的种类
        var name = otherCollider.node.name;
        // 切换图片
        var sprite = this.node.getComponent(cc.Sprite);
        // 受伤
        this.onAttack(effect, name);
        // 是否死亡
        if (!this.blood) {
            return;
        } else if (this.blood > 0 && this.blood <= this.blood_max / 3 && this.imageId !== 2) {
            this.imageId = 2;
            (0, _common.spriteUpdate)(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        } else if (this.blood > this.blood_max / 3 && this.blood <= this.blood_max * 2 / 3 && this.imageId !== 1) {
            this.imageId = 1;
            (0, _common.spriteUpdate)(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }
    },

    // 设置刚体速度
    setVelocity: function setVelocity(vel_x, vel_y) {
        var rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 设置碎片
    setFragment: function setFragment() {
        if (!this.fragmentPrefab) {
            return;
        }
        var location = (0, _common.getWorldLocation)(this.node);
        var num = Math.floor(Math.random() * 4) + 3;

        for (var i = 0; i < num; ++i) {
            var imageId = Math.floor(3 * Math.random());
            if (imageId >= 3) {
                imageId = 2;
            }
            // 碎屑node
            var fragmentNode = cc.instantiate(this.fragmentPrefab);
            var parent = this.node.parent;
            var locationParent = (0, _common.getWorldLocation)(parent);
            // 相对位置
            var delta = location.sub(locationParent);
            // 随机x,y
            var x = delta.x + this.node.getContentSize().width * (Math.random() - 0.5);
            var y = delta.y + this.node.getContentSize().height * (Math.random() - 0.5);
            parent.addChild(fragmentNode);
            fragmentNode.setPosition(x, y);
            // 碎屑
            var fragment = fragmentNode.getComponent(this.fragmentType);
            var vel_x = fragment.velocityMax * (Math.random() - 0.5);
            var vel_y = fragment.velocityMax * (Math.random() - 0.5);
            fragment.setVelocity(vel_x, vel_y);
            fragment.init(imageId);
        }
    },

    //收到伤害
    onAttack: function onAttack(effect, name) {
        if (this.blood <= 0) {
            return;
        }
        // 鸟对object的伤害远高于其他刚体对木头的伤害
        if (name !== null && name.indexOf('bird') !== -1) {
            this.blood -= effect * this.crisp;
        } else {
            this.blood -= effect / this.armor;
        }
        if (this.blood <= 0) {
            this.blood = 0;
            this._onDeath();
        }
    },

    // 死亡处理
    _onDeath: function _onDeath() {
        if (this.node) {
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
            var duration = 1;
            // 分数
            if (this.score) {
                // 分数动画
                (0, _common.scoreAnimation)(this.node, this.score, duration);
                var gameController = (0, _common.getGameController)(this.node);
                gameController.addScore(this.score);
            }
            // 延时销毁本体
            this.scheduleOnce(function () {
                this.node.destroy();
            }, duration);
        }
    },

    // 播放音效 死亡音效
    _onPlayAudio: function _onPlayAudio() {
        if (this.deathAudio) {
            this.currentAudio = cc.audioEngine.play(this.deathAudio, false, 1);
        }
    },

    //停止音效
    _onStopAudio: function _onStopAudio() {
        cc.audioEngine.stop(this.currentAudio);
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
        //# sourceMappingURL=ToolObject.js.map
        