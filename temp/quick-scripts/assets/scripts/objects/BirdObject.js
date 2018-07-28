(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/BirdObject.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cef18tefHJAMI39RGfiqct4', 'BirdObject', __filename);
// scripts/objects/BirdObject.js

'use strict';

var _common = require('../utils/common');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    extends: cc.Component,

    properties: {
        //有效属性
        valid: true,
        //水平加速度（一般为负数）
        accel: 0,
        // 满血血量
        blood_max: 0,
        // 当前血量
        blood: 0,
        // 护甲
        armor: 0,
        // 碎片prefab 
        fragmentPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 碰撞音效
        crashAudio: {
            url: cc.AudioClip,
            default: null
        },
        // 爆炸音效
        boomAudio: {
            url: cc.AudioClip,
            default: null
        },
        // 弹弓音效
        springAudio: {
            url: cc.AudioClip,
            default: null
        },
        //发射时弹弓的最大半径
        emitRadiusMax: 0,
        //发射时弹弓的最小半径
        emitRadiusMin: 0,
        // 发射的最大速度
        emitVelocityMax: 0,
        // 存活时间 /s
        duration: 0
    },

    // 相同属性初始化
    init: function init(type) {
        // 当前图片id
        this.imageId = 0;
        // 初始化是否准备好发射，0 -> 没轮到自己， 1 -> 准备好发射, -1 -> 已经发射
        this.ready = 0;
        // 初始化重力
        this.setGravity(1);
        // 初始化屏幕rec
        this.setScreenRectangle();
        // 冲撞flag：第一次冲撞即为true
        this.crashFlag = false;
        // 技能flag: 未释放技能为true
        this.skillFlag = true;
        // 图片路径
        this.spriteImage = 'resources/textures/birds/';
        // 图片id
        this.imageId = 0;

        // 类型
        this.type = type;
    },

    // 此时表明准备好发射了
    readyEmit: function readyEmit(spring) {
        this.ready = 1;
        // 初始化鸟的速度
        this.setVelocity(0, 0);
        // 重力为0，此时需要在弹弓上
        this.setGravity(0);
        // 初始化拉伸坐标（世界坐标）
        this.emitStartPosition = (0, _common.getWorldLocation)(this.node.parent);
        // 初始化弹弓
        this.spring = spring;
        this.spring.active = true;
        // 绳子关节
        var ropeJoint = this.spring.getComponent(cc.RopeJoint);
        ropeJoint.maxLength = this.emitRadiusMax;
        // 绳子关节绑定鸟
        var rigidbody = this.node.getComponent(cc.RigidBody);
        ropeJoint.connectedBody = rigidbody;

        // 初始化鸟的位置 动画移动到弹弓上
        this.node.setPosition(0, 0);
        var duration = 1;
        var action = cc.moveTo(duration, 0, 0);
        // this.node.runAction(action);

        /* 初始化绳子 */
        // 画笔
        this.graphicsSpring = this.spring.addComponent(cc.Graphics);
        // 画绳子
        // 左右绳子，在弹弓上的固定坐标

        var position = new cc.Vec2(0, 0); //  this.node.getPosition();
        this.ropeLeftLocation = new cc.Vec2(position.x - 12, position.y - 2);
        this.ropeRightLocation = new cc.Vec2(position.x + 8, position.y);

        this._drawRope(this.graphicsSpring);
        // ready = 1
        // 触摸跟随事件 有些鬼畜
        this.node.parent.on('touchmove', this._touchmoveEvent.bind(this)); //, this);
        //增加触摸释放事件
        this.node.parent.once('touchend', this._emitEvent.bind(this)); //, this);
        this.node.parent.once('touchcancel', this._emitEvent.bind(this)); //, this);
    },

    //触摸事件
    _touchmoveEvent: function _touchmoveEvent(event) {
        if (this.ready === 1) {
            var eventPos = event.getLocation();
            var parent = this.node.parent;
            var parentPos = (0, _common.getWorldLocation)(parent);
            var parentSize = parent.getContentSize();
            var rec = (0, _common.changeRectangle)(parentPos, parentSize);
            var delta = event.touch.getDelta();
            var minStep = 20;
            if (!_common.isOutOfBorder.apply(undefined, [eventPos].concat(_toConsumableArray(rec))) && delta.x < minStep && delta.y < minStep) {
                // 弹弓音效
                this._onStopAudio();
                this._onPlayAudio('spring');
                var position = this.node.getPosition();
                position.x += delta.x;
                position.y += delta.y;
                this.node.setPosition(position);
            }
            // 阻止事件冒泡
            event.stopPropagation();
        }
    },

    //发射事件
    _emitEvent: function _emitEvent(event) {
        if (this.ready !== 1) {
            return;
        }
        var location_delta = this._locationTransform(this.emitStartPosition); //this._locationTransform(this.node.parent.convertToWorldSpaceAR(this.emitStartPosition));
        // 已经发射
        this.ready = -1;
        // 无法触摸，发射
        this.node.parent.off('touchmove', this._touchmoveEvent.bind(this)); //, this);
        // 不受弹弓限制
        if (this.spring.getComponent(cc.RopeJoint)) {
            this.spring.getComponent(cc.RopeJoint).destroy();
        }
        this.spring.active = false;
        // 发射
        this.emit(location_delta, this);
        // 发射轨迹 画笔
        this.graphicsOrbit = this.node.parent.getComponent(cc.Graphics);
        if (!this.graphicsOrbit) {
            this.graphicsOrbit = this.node.parent.addComponent(cc.Graphics);
        } else {
            this.graphicsOrbit.clear();
        }
        // 增加技能事件绑定 
        this._skillBind();
        // 阻止事件冒泡
        event.stopPropagation();
    },

    //技能事件
    _skillEvent: function _skillEvent(event) {
        if (this.skillFlag) {
            // 触发技能
            this.onSkill(event);
            // 清除技能标记
            this._skillClear();
        }
    },

    //死亡事件
    _onDeath: function _onDeath() {
        if (this.node) {
            // 血量为0
            this.blood = 0;
            // 动画效果
            this.setFragment();
            // 清除技能
            this._skillClear();
            // 先缩小到0
            this.node.setContentSize(0, 0);
            //播放音效
            this._onPlayAudio('crash');
            // 延时销毁本体
            this.scheduleOnce(function () {
                this.node.destroy();
            }, this.duration / 3);
        }
    },

    //技能绑定
    _skillBind: function _skillBind() {
        var bg = this.node.parent.parent;
        if (bg) {
            bg.once('touchstart', this._skillEvent.bind(this));
        }
    },

    //技能清除
    _skillClear: function _skillClear() {
        this.skillFlag = false;
    },

    //画绳子
    _drawRope: function _drawRope(graphics) {
        graphics.clear();
        var locationWorldBird = (0, _common.getWorldLocation)(this.node.getComponent(cc.RigidBody).node);
        var locationWorldEmit = (0, _common.getWorldLocation)(this.spring);
        // 鸟的相对坐标
        var location = locationWorldBird.sub(locationWorldEmit);
        var locationLeft = new cc.Vec2(location.x - 10, location.y);
        var locationRight = new cc.Vec2(location.x + 10, location.y);
        graphics.strokeColor = cc.Color.BLACK; //填充

        graphics.lineWidth = 2;
        graphics.moveTo(this.ropeLeftLocation.x, this.ropeLeftLocation.y);
        graphics.lineTo(locationLeft.x, locationLeft.y);
        graphics.stroke();

        graphics.lineWidth = 2;
        graphics.moveTo(this.ropeRightLocation.x, this.ropeRightLocation.y);
        graphics.lineTo(locationRight.x, locationRight.y);
        graphics.stroke();
    },

    //画圆点
    _drawCircle: function _drawCircle(graphics) {
        var locationWorldBird = (0, _common.getWorldLocation)(this.node.getComponent(cc.RigidBody).node);
        var locationWorldParent = (0, _common.getWorldLocation)(this.node.parent);
        // 鸟的相对坐标
        var delta = locationWorldBird.sub(locationWorldParent);
        var size = this.node.parent.getContentSize();
        var location = new cc.Vec2(size.width / 2, size.height / 2);
        location = location.add(delta);
        var color = cc.Color.YELLOW;
        graphics.strokeColor = color; //填充

        // 轨迹的点图 半径渐变
        if (!this.orbitRadius) {
            this.orbitRadius = 0;
        }
        this.orbitRadius = this.orbitRadius % 16 + 1;
        var radius = this.orbitRadius / 4;
        if (radius === Math.floor(radius)) {
            graphics.circle(location.x, location.y, radius);
            graphics.fill();
            graphics.stroke();
        }
    },

    // 坐标系转换 : location（世界坐标）相对于鸟的坐标
    _locationTransform: function _locationTransform(location) {
        var x = location.x;
        var y = location.y;
        return location.sub((0, _common.getWorldLocation)(this.node)); //location.sub(this.node.parent.convertToWorldSpaceAR(this.node));
    },


    emit: function emit(location_delta) {
        // 修改值： 重力，刚体旋转性
        // 获取刚体
        var rigid = this.node.getComponent(cc.RigidBody);
        rigid.gravityScale = 1;
        rigid.fixedRotation = false;
        //速度
        var radius = Math.hypot(location_delta.x, location_delta.y);
        var speed = radius * this.emitVelocityMax / this.emitRadiusMax;
        var speed_x = location_delta.x * speed / radius;
        var speed_y = location_delta.y * speed / radius;
        this.setVelocity(speed_x, speed_y);
    },

    // 设置屏幕rec
    setScreenRectangle: function setScreenRectangle() {
        var bg = this.node.parent.parent;
        var size = bg.getContentSize();
        var position = (0, _common.getWorldLocation)(bg);
        // minX maxX minY maxY
        this.screen = (0, _common.changeRectangle)(position, size);
    },

    // 设置刚体是否可碰撞
    setRigidActive: function setRigidActive(active) {
        this.node.getComponent(cc.RigidBody).active = active;
    },

    // 设置刚体弹性
    setRestitution: function setRestitution(restitution) {
        this.node.getComponent(cc.PhysicsCollider).restitution = restitution;
    },

    // 设置刚体速度
    setVelocity: function setVelocity(vel_x, vel_y) {
        var rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 设置刚体重力
    setGravity: function setGravity(gravity) {
        var rigid = this.node.getComponent(cc.RigidBody);
        rigid.gravityScale = gravity;
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

    // 每次处理完碰撞体接触逻辑时被调用，
    // 1.刚体减速更快
    onPostSolve: function onPostSolve(contact, thisCollider, otherCollider) {
        var rigidbody = this.node.getComponent(cc.RigidBody);
        rigidbody.linearDamping = this.accel;

        /* 碰撞对鸟的影响 */
        // 发射后第一次碰撞后duration时间后释放技能死亡
        if (!this.crashFlag && this.ready === -1) {
            this.crashFlag = true;
            this.scheduleOnce(function () {
                // 释放技能
                this._skillEvent();
                // 死亡
                this._onDeath();
            }, this.duration);
        }
        // 鸟的角度
        var angle = 180 / Math.PI * this.node.rotation;
        // 伤害
        var effect = (0, _common.getEffect)(thisCollider, otherCollider, angle);
        if (effect === 0) {
            return;
        }
        // 切换图片
        var sprite = this.node.getComponent(cc.Sprite);
        // 受伤
        this.onAttack(effect);
        // 是否死亡
        if (!this.blood) {
            return;
        } else if (this.blood > 0 && this.blood <= this.blood_max / 3 && this.imageId !== 2) {
            //播放音效
            this._onPlayAudio('crash');
            // 掉羽毛
            this.setFragment();
            this.imageId = 2;
            (0, _common.spriteUpdate)(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        } else if (this.blood > this.blood_max / 3 && this.blood <= this.blood_max / 3 * 2 && this.imageId !== 1) {
            //播放音效
            this._onPlayAudio('crash');
            // 掉羽毛
            this.setFragment();
            this.imageId = 1;
            (0, _common.spriteUpdate)(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }
    },

    // 受到攻击
    onAttack: function onAttack(effect) {
        if (this.blood <= 0) {
            return;
        }
        this.blood -= effect / this.armor;
        if (this.blood <= 0) {
            this.blood = 0;
            if (this.skillFlag) {
                this._skillEvent();
            }
            this._onDeath();
        }
    },

    // 播放音效
    _onPlayAudio: function _onPlayAudio(type) {
        if (type === 'crash' && this.crashAudio) {
            this.currentAudio = cc.audioEngine.play(this.crashAudio, false, 1);
        } else if (type === 'boom' && this.boomAudio) {
            this.currentAudio = cc.audioEngine.play(this.boomAudio, false, 0.5);
        } else if (type === 'spring' && this.spring) {
            this.currentAudio = cc.audioEngine.play(this.springAudio, false, 1);
        }
    },

    // 停止音效
    _onStopAudio: function _onStopAudio() {
        cc.audioEngine.stop(this.currentAudio);
    },

    update: function update(dt) {
        // 画弹弓
        if (this.graphicsSpring) {
            if (this.ready === 1 && this.spring && this.spring.active) {
                this._drawRope(this.graphicsSpring);
            } else {
                this.graphicsSpring.clear();
            }
        }
        // 画轨迹
        if (this.graphicsOrbit) {
            // 处在已经发射状态 且 未碰撞过
            if (this.ready === -1 && !this.crashFlag) {
                this._drawCircle(this.graphicsOrbit);
            }
        }
        // 判断是否出界
        if (this.ready === -1 && this.blood) {
            var location = (0, _common.getWorldLocation)(this.node);
            var delta = 5;
            var screen = this.screen;
            if ((0, _common.isOutOfBorder)(location, screen[0] + delta, screen[1] - delta, screen[2] + delta, screen[3] - delta)) {
                this._onDeath();
            }
        }
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
        //# sourceMappingURL=BirdObject.js.map
        