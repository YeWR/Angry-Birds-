const BirdObject = require("BirdObject")
import {getAllBranches} from '../utils/common';
import {getCanvas} from '../utils/common';
import {getWorldLocation} from '../utils/common';
import {getMinDistance_P_C} from '../utils/common';
import {getMinDistance_P_Poly} from '../utils/common';

cc.Class({
    extends: BirdObject,
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        this.init('bird_boom');
        // 爆炸范围
        this.boomRadius = 150;
        // 爆炸中心速度
        this.boomVelocityMax = this.emitVelocityMax;
        // 爆炸最大伤害
        this.boomEffectMax = this.blood_max / 1.5;
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill : function(event){
        /* 爆炸鸟技能 */
        // 自己的世界坐标
        let location = getWorldLocation(this.node);
        
        // 获取当前所有存活的tool object
        let tools = this._getAllTools();
        // 爆炸效果
        tools.forEach(tool => {
            // 物体距离爆炸中心最小距离
            let minDis = this._getlMinDistance_Tool(tool, location);
            if(minDis <= this.boomRadius){
                // 比例
                let scale = 1 - minDis / this.boomRadius;
                // 伤害
                let eff = this.boomEffectMax * scale;
                // 分类
                let subTool = this._getToolSubclass(tool);
                // 伤害
                subTool.onAttack(eff, 'bird_boom');
                // 速度
                if(subTool && subTool.blood){
                    let toolLocation = getWorldLocation(tool);
                    let delta = toolLocation.sub(location);
                    let mas = tool.getComponent(cc.RigidBody).getMass();
                    let vel = this.boomVelocityMax * scale / mas;
                    let vel_x = vel * delta.x / minDis;
                    let vel_y = vel * delta.y / minDis;
                    subTool.setVelocity(vel_x, vel_y);
                }
            }
        });
        // 静止
        this.setVelocity(0, 0);
        this.node.setContentSize(0, 0);
        this.setGravity(0);
        // 播放动画
        this._playAnimation();
        this._onDeath();
        //播放爆炸音效
        this._onPlayAudio('boom');
    },

    // 播放动画
    _playAnimation : function(){
        let animationComp = this.getComponent(cc.Animation);
        animationComp.play();
    },

    // 得到当前所有的tools
    _getAllTools : function(){
        let canvas = getCanvas(this.node);
        let branches = getAllBranches(canvas);
        return branches.filter(function(branch){
            let object = branch._name;
            if(object.indexOf('tool') !== -1){
                return branch;
            }
        });
    },

    // 得到tool距离爆炸中心的最小距离
    _getlMinDistance_Tool : function(tool, location){
        let name = tool._name;
        // 圆形
        if(name.indexOf('circle') !== -1){
            let center = getWorldLocation(tool);
            let circleCollider = tool.getComponent(cc.PhysicsCircleCollider);
            let radius = circleCollider.radius;
            let dis = getMinDistance_P_C(location, center, radius);
            return dis;
        }
        // 三角形
        else if(name.indexOf('triangle') !== -1){
            let rec = tool.getBoundingBoxToWorld();
            let p1 = new cc.Vec2(rec.x, rec.y);
            let p2 = new cc.Vec2(rec.x + rec.width / 2, rec.y + rec.height);
            let p3 = new cc.Vec2(rec.x + rec.width, rec.y);
            let dis = getMinDistance_P_Poly(location, p1, p2, p3);
            return dis;
        }
        // 矩形
        else{
            let rec = tool.getBoundingBoxToWorld();
            let p1 = new cc.Vec2(rec.x, rec.y);
            let p2 = new cc.Vec2(rec.x + rec.width, rec.y);
            let p3 = new cc.Vec2(rec.x + rec.width, rec.y + rec.height);
            let p4 = new cc.Vec2(rec.x, rec.y + rec.height);
            let dis = getMinDistance_P_Poly(location, p1, p2, p3, p4);
            return dis;
        }
    },

    // 得到tool的子类
    _getToolSubclass : function(tool){
        let name = tool._name;
        // 冰块
        if(name.indexOf('ice') !== -1){
            return tool.getComponent('Ice');
        }
        else if(name.indexOf('pig') !== -1){
            return tool.getComponent('Pig');
        }
        else if(name.indexOf('stone') !== -1){
            return tool.getComponent('Stone');
        }
        else if(name.indexOf('wood') !== -1){
            return tool.getComponent('Wood');
        }
        else if(name.indexOf('shelf') !== -1){
            return tool.getComponent('Shelf');
        }
        else{
            return null;
        }
    },

    start () {

    },

    //  update : function(dt) {
    //  },
});
