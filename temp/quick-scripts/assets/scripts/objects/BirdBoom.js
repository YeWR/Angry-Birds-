(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/objects/BirdBoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a2fbbvOCtpJOL74mjfPS++F', 'BirdBoom', __filename);
// scripts/objects/BirdBoom.js

'use strict';

var _common = require('../utils/common');

var BirdObject = require("BirdObject");


cc.Class({
    extends: BirdObject,
    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
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
    onSkill: function onSkill(event) {
        var _this = this;

        /* 爆炸鸟技能 */
        // 自己的世界坐标
        var location = (0, _common.getWorldLocation)(this.node);

        // 获取当前所有存活的tool object
        var tools = this._getAllTools();
        // 爆炸效果
        tools.forEach(function (tool) {
            // 物体距离爆炸中心最小距离
            var minDis = _this._getlMinDistance_Tool(tool, location);
            if (minDis <= _this.boomRadius) {
                // 比例
                var scale = 1 - minDis / _this.boomRadius;
                // 伤害
                var eff = _this.boomEffectMax * scale;
                // 分类
                var subTool = _this._getToolSubclass(tool);
                // 伤害
                subTool.onAttack(eff, 'bird_boom');
                // 速度
                if (subTool && subTool.blood) {
                    var toolLocation = (0, _common.getWorldLocation)(tool);
                    var delta = toolLocation.sub(location);
                    var mas = tool.getComponent(cc.RigidBody).getMass();
                    var vel = _this.boomVelocityMax * scale / mas;
                    var vel_x = vel * delta.x / minDis;
                    var vel_y = vel * delta.y / minDis;
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
    _playAnimation: function _playAnimation() {
        var animationComp = this.getComponent(cc.Animation);
        animationComp.play();
    },

    // 得到当前所有的tools
    _getAllTools: function _getAllTools() {
        var canvas = (0, _common.getCanvas)(this.node);
        var branches = (0, _common.getAllBranches)(canvas);
        return branches.filter(function (branch) {
            var object = branch._name;
            if (object.indexOf('tool') !== -1) {
                return branch;
            }
        });
    },

    // 得到tool距离爆炸中心的最小距离
    _getlMinDistance_Tool: function _getlMinDistance_Tool(tool, location) {
        var name = tool._name;
        // 圆形
        if (name.indexOf('circle') !== -1) {
            var center = (0, _common.getWorldLocation)(tool);
            var circleCollider = tool.getComponent(cc.PhysicsCircleCollider);
            var radius = circleCollider.radius;
            var dis = (0, _common.getMinDistance_P_C)(location, center, radius);
            return dis;
        }
        // 三角形
        else if (name.indexOf('triangle') !== -1) {
                var rec = tool.getBoundingBoxToWorld();
                var p1 = new cc.Vec2(rec.x, rec.y);
                var p2 = new cc.Vec2(rec.x + rec.width / 2, rec.y + rec.height);
                var p3 = new cc.Vec2(rec.x + rec.width, rec.y);
                var _dis = (0, _common.getMinDistance_P_Poly)(location, p1, p2, p3);
                return _dis;
            }
            // 矩形
            else {
                    var _rec = tool.getBoundingBoxToWorld();
                    var _p = new cc.Vec2(_rec.x, _rec.y);
                    var _p2 = new cc.Vec2(_rec.x + _rec.width, _rec.y);
                    var _p3 = new cc.Vec2(_rec.x + _rec.width, _rec.y + _rec.height);
                    var p4 = new cc.Vec2(_rec.x, _rec.y + _rec.height);
                    var _dis2 = (0, _common.getMinDistance_P_Poly)(location, _p, _p2, _p3, p4);
                    return _dis2;
                }
    },

    // 得到tool的子类
    _getToolSubclass: function _getToolSubclass(tool) {
        var name = tool._name;
        // 冰块
        if (name.indexOf('ice') !== -1) {
            return tool.getComponent('Ice');
        } else if (name.indexOf('pig') !== -1) {
            return tool.getComponent('Pig');
        } else if (name.indexOf('stone') !== -1) {
            return tool.getComponent('Stone');
        } else if (name.indexOf('wood') !== -1) {
            return tool.getComponent('Wood');
        } else if (name.indexOf('shelf') !== -1) {
            return tool.getComponent('Shelf');
        } else {
            return null;
        }
    },

    start: function start() {}
}

//  update : function(dt) {
//  },
);

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
        //# sourceMappingURL=BirdBoom.js.map
        