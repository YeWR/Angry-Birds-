import {getEffect} from '../utils/common';
import {getWorldLocation} from '../utils/common';
import {spriteUpdate} from '../utils/common';
import {isOutOfBorder} from '../utils/common';
import {changeRectangle} from '../utils/common';

cc.Class({
    extends: cc.Component,

    properties: {
        //有效属性
        valid : true,
        //水平加速度（一般为负数）
        accel : 0,  
        // 满血血量
        blood_max : 0,
        // 当前血量
        blood : 0,
        // 护甲
        armor : 0,
        // 碎片prefab 
        fragmentPrefab : {
            default : null,
            type : cc.Prefab
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
        springAudio : {
            url: cc.AudioClip,
            default: null
        },
        //发射时弹弓的最大半径
        emitRadiusMax : 0,
        //发射时弹弓的最小半径
        emitRadiusMin : 0,
        // 发射的最大速度
        emitVelocityMax : 0,
        // 存活时间 /s
        duration : 0,
    },

    // 相同属性初始化
    init : function(type){
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
    readyEmit : function(spring){
        this.ready = 1;
        // 初始化鸟的速度
        this.setVelocity(0, 0);
        // 重力为0，此时需要在弹弓上
        this.setGravity(0);
        // 初始化拉伸坐标（世界坐标）
        this.emitStartPosition = getWorldLocation(this.node.parent);
        // 初始化弹弓
        this.spring = spring;
        this.spring.active = true;
        // 绳子关节
        let ropeJoint = this.spring.getComponent(cc.RopeJoint);
        ropeJoint.maxLength = this.emitRadiusMax;
        // 绳子关节绑定鸟
        let rigidbody = this.node.getComponent(cc.RigidBody);
        ropeJoint.connectedBody = rigidbody;
        
        // 初始化鸟的位置 动画移动到弹弓上
        this.node.setPosition(0, 0);
        let duration = 1;
        let action = cc.moveTo(duration, 0, 0);
        // this.node.runAction(action);
            
        /* 初始化绳子 */
        // 画笔
        this.graphicsSpring = this.spring.addComponent(cc.Graphics);
        // 画绳子
        // 左右绳子，在弹弓上的固定坐标

        let position = new cc.Vec2(0, 0);//  this.node.getPosition();
        this.ropeLeftLocation = new cc.Vec2(position.x - 12, position.y - 2);
        this.ropeRightLocation = new cc.Vec2(position.x + 8, position.y);


        this._drawRope(this.graphicsSpring);
        // ready = 1
        // 触摸跟随事件 有些鬼畜
        this.node.parent.on('touchmove', this._touchmoveEvent.bind(this));//, this);
        //增加触摸释放事件
        this.node.parent.once('touchend', this._emitEvent.bind(this));//, this);
        this.node.parent.once('touchcancel', this._emitEvent.bind(this));//, this);

    },

    //触摸事件
    _touchmoveEvent: function(event){
        if(this.ready === 1){
            let eventPos = event.getLocation();
            let parent = this.node.parent;
            let parentPos = getWorldLocation(parent);
            let parentSize = parent.getContentSize();
            let rec = changeRectangle(parentPos, parentSize);
            const delta = event.touch.getDelta();
            let minStep = 20;
            if(!isOutOfBorder(eventPos, ...rec) && delta.x < minStep && delta.y < minStep){
                // 弹弓音效
                this._onStopAudio();
                this._onPlayAudio('spring');
                let position = this.node.getPosition();
                position.x += delta.x;
                position.y += delta.y;
                this.node.setPosition(position);
            }
            // 阻止事件冒泡
            event.stopPropagation();
        }
    },

    //发射事件
    _emitEvent : function(event){
        if(this.ready !== 1){
            return;
        }
        let location_delta = this._locationTransform(this.emitStartPosition);//this._locationTransform(this.node.parent.convertToWorldSpaceAR(this.emitStartPosition));
        // 已经发射
        this.ready = -1;
        // 无法触摸，发射
        this.node.parent.off('touchmove', this._touchmoveEvent.bind(this));//, this);
        // 不受弹弓限制
        if(this.spring.getComponent(cc.RopeJoint)){
            this.spring.getComponent(cc.RopeJoint).destroy();
        }
        this.spring.active = false;            
        // 发射
        this.emit(location_delta, this);
        // 发射轨迹 画笔
        this.graphicsOrbit = this.node.parent.getComponent(cc.Graphics);
        if(!this.graphicsOrbit){
            this.graphicsOrbit = this.node.parent.addComponent(cc.Graphics);
        }
        else{
            this.graphicsOrbit.clear();
        }
        // 增加技能事件绑定 
        this._skillBind();
        // 阻止事件冒泡
        event.stopPropagation();
    },

    //技能事件
    _skillEvent : function(event){
        if(this.skillFlag){
            // 触发技能
            this.onSkill(event);
            // 清除技能标记
            this._skillClear();
        }
    },

    //死亡事件
    _onDeath : function(){
        if(this.node){
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
            this.scheduleOnce(function(){
                this.node.destroy()
            }, this.duration / 3);
        }
    },

    //技能绑定
    _skillBind : function(){
        let bg = this.node.parent.parent;
        if(bg){
            bg.once('touchstart', this._skillEvent.bind(this));
        }
    },

    //技能清除
    _skillClear : function(){
        this.skillFlag = false;
    },

    //画绳子
    _drawRope : function(graphics){
        graphics.clear();
        let locationWorldBird = getWorldLocation(this.node.getComponent(cc.RigidBody).node);
        let locationWorldEmit = getWorldLocation(this.spring);
        // 鸟的相对坐标
        let location = locationWorldBird.sub(locationWorldEmit);
        let locationLeft = new cc.Vec2(location.x - 10, location.y);
        let locationRight = new cc.Vec2(location.x + 10, location.y);
        graphics.strokeColor = cc.Color.BLACK;//填充

        graphics.lineWidth = 2;
        graphics.moveTo(this.ropeLeftLocation.x ,this.ropeLeftLocation.y);
        graphics.lineTo(locationLeft.x, locationLeft.y);
        graphics.stroke();

        graphics.lineWidth = 2;
        graphics.moveTo(this.ropeRightLocation.x, this.ropeRightLocation.y);
        graphics.lineTo(locationRight.x, locationRight.y);
        graphics.stroke();  
    },

    //画圆点
    _drawCircle : function(graphics){
        let locationWorldBird = getWorldLocation(this.node.getComponent(cc.RigidBody).node);
        let locationWorldParent = getWorldLocation(this.node.parent);
        // 鸟的相对坐标
        let delta = locationWorldBird.sub(locationWorldParent);
        let size = this.node.parent.getContentSize();
        let location = new cc.Vec2(size.width / 2, size.height / 2);
        location = location.add(delta);
        let color = cc.Color.YELLOW;
        graphics.strokeColor = color;//填充
        
        // 轨迹的点图 半径渐变
        if(!this.orbitRadius){
            this.orbitRadius = 0;
        }
        this.orbitRadius = (this.orbitRadius) % 16 + 1;
        let radius = this.orbitRadius / 4;
        if(radius === Math.floor(radius)){
            graphics.circle(location.x, location.y, radius);
            graphics.fill();
            graphics.stroke();
        }
    },

    // 坐标系转换 : location（世界坐标）相对于鸟的坐标
    _locationTransform(location){
        let x = location.x;
        let y = location.y;
        return location.sub(getWorldLocation(this.node));//location.sub(this.node.parent.convertToWorldSpaceAR(this.node));
    },

    emit : function (location_delta){
        // 修改值： 重力，刚体旋转性
        // 获取刚体
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.gravityScale = 1;
        rigid.fixedRotation = false;
        //速度
        let radius = Math.hypot(location_delta.x, location_delta.y);
        let speed = radius * this.emitVelocityMax / this.emitRadiusMax;
        let speed_x = location_delta.x * speed / radius;
        let speed_y = location_delta.y * speed / radius;
        this.setVelocity(speed_x, speed_y);
    },

    // 设置屏幕rec
    setScreenRectangle : function(){
        let bg = this.node.parent.parent;
        let size = bg.getContentSize();
        let position = getWorldLocation(bg);
        // minX maxX minY maxY
        this.screen = changeRectangle(position, size);
    },

    // 设置刚体是否可碰撞
    setRigidActive : function(active){
        this.node.getComponent(cc.RigidBody).active = active;
    },

    // 设置刚体弹性
    setRestitution : function(restitution){
        this.node.getComponent(cc.PhysicsCollider).restitution = restitution;
    },

    // 设置刚体速度
    setVelocity : function(vel_x, vel_y){
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = new cc.Vec2(vel_x, vel_y);
    },

    // 设置刚体重力
    setGravity : function(gravity){
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.gravityScale = gravity;
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

    // 每次处理完碰撞体接触逻辑时被调用，
    // 1.刚体减速更快
    onPostSolve: function (contact, thisCollider, otherCollider) {
        let rigidbody = this.node.getComponent(cc.RigidBody);
        rigidbody.linearDamping = this.accel;

        /* 碰撞对鸟的影响 */
        // 发射后第一次碰撞后duration时间后释放技能死亡
        if(!this.crashFlag && this.ready === -1){
            this.crashFlag = true;
            this.scheduleOnce(function(){
                // 释放技能
                this._skillEvent();
                // 死亡
                this._onDeath();
            }, this.duration);
        }
        // 鸟的角度
        let angle = 180/Math.PI * this.node.rotation;
        // 伤害
        let effect = getEffect(thisCollider, otherCollider, angle);
        if(effect === 0){
            return;
        }
        // 切换图片
        let sprite = this.node.getComponent(cc.Sprite);
        // 受伤
        this.onAttack(effect);
        // 是否死亡
        if(!this.blood){
            return;
        }
        else if(this.blood > 0 && this.blood <= this.blood_max / 3 && this.imageId !== 2){
            //播放音效
            this._onPlayAudio('crash');
            // 掉羽毛
            this.setFragment();
            this.imageId = 2;
            spriteUpdate(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }
        else if(this.blood > this.blood_max / 3 && this.blood <= this.blood_max / 3 * 2 && this.imageId !== 1){
            //播放音效
            this._onPlayAudio('crash');
            // 掉羽毛
            this.setFragment();
            this.imageId = 1;
            spriteUpdate(sprite, this.spriteImage + this.type + "_" + this.imageId + ".png");
        }

    },

    // 受到攻击
    onAttack : function(effect){
        if(this.blood <= 0){
            return;
        }
        this.blood -= effect / this.armor;
        if(this.blood <= 0){
            this.blood = 0;
            if(this.skillFlag){
                this._skillEvent();
            }
            this._onDeath();
        }
    },

    // 播放音效
    _onPlayAudio : function(type){
        if(type === 'crash' && this.crashAudio){
            this.currentAudio = cc.audioEngine.play(this.crashAudio, false, 1);
        }
        else if(type === 'boom' && this.boomAudio){
            this.currentAudio = cc.audioEngine.play(this.boomAudio, false, 0.5);
        }
        else if(type === 'spring' && this.spring){
            this.currentAudio = cc.audioEngine.play(this.springAudio, false, 1);
        }
    },

    // 停止音效
    _onStopAudio : function(){
        cc.audioEngine.stop(this.currentAudio);
    },

    update : function(dt) {
        // 画弹弓
        if(this.graphicsSpring){
            if(this.ready === 1 && this.spring && this.spring.active){
                this._drawRope(this.graphicsSpring);
            }
            else{
                this.graphicsSpring.clear();
            }
        }
        // 画轨迹
        if(this.graphicsOrbit){
            // 处在已经发射状态 且 未碰撞过
            if(this.ready === -1 && !this.crashFlag){
                this._drawCircle(this.graphicsOrbit);
            }
        }
        // 判断是否出界
        if(this.ready === -1 && this.blood){
            let location = getWorldLocation(this.node);
            let delta = 5;
            let screen = this.screen;
            if(isOutOfBorder(location, screen[0] + delta, screen[1] - delta, screen[2] + delta, screen[3] - delta)){
                this._onDeath();
            }
        }
    },
});
