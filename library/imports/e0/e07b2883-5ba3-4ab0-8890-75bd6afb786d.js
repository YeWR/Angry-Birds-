"use strict";
cc._RF.push(module, 'e07b2iDW6NKsIiQdb1q+3ht', 'BirdSwell');
// scripts/objects/BirdSwell.js

'use strict';

var _common = require('../utils/common');

var BirdObject = require("BirdObject");


cc.Class({
    extends: BirdObject,

    properties: {},

    onLoad: function onLoad() {
        this.init('bird_swell');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill: function onSkill(event) {
        /* 膨胀鸟技能 */
        var collider = this.node.addComponent(cc.PhysicsCircleCollider);
        var nodeSize = this.node.getContentSize();
        var offset = collider.offset;
        var radius = collider.radius;
        // 放大乘数
        var multiplier = 3;
        this.blood_max *= Math.pow(multiplier, 3);
        this.blood *= Math.pow(multiplier, 3);
        // 放大
        this.node.setContentSize(nodeSize.width * multiplier, nodeSize.height * multiplier);
        collider.radius = radius * multiplier;
        collider.offset = new cc.Vec2(offset.x * multiplier, offset.y * multiplier);
        // 换图片
        this.type = 'bird_swell_big';
        this.imageId = 0;
        (0, _common.spriteUpdate)(this.node.getComponent(cc.Sprite), this.spriteImage + this.type + "_" + this.imageId + ".png");
    }
});

cc._RF.pop();