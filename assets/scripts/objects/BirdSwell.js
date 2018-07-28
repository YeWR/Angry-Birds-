const BirdObject = require("BirdObject")
import {spriteUpdate} from '../utils/common';

cc.Class({
    extends: BirdObject,

    properties: {

    },

    onLoad : function () {
        this.init('bird_swell');
        //碎屑类型
        this.fragmentType = "FragmentBird";
    },

    // 技能
    onSkill : function(event){
        /* 膨胀鸟技能 */
        let collider = this.node.addComponent(cc.PhysicsCircleCollider);
        let nodeSize = this.node.getContentSize();
        let offset = collider.offset;
        let radius = collider.radius;
        // 放大乘数
        let multiplier = 3;
        this.blood_max *= Math.pow(multiplier, 3);
        this.blood *= Math.pow(multiplier, 3);
        // 放大
        this.node.setContentSize(nodeSize.width * multiplier, nodeSize.height * multiplier);
        collider.radius = radius * multiplier;
        collider.offset = new cc.Vec2(offset.x * multiplier, offset.y * multiplier);
        // 换图片
        this.type = 'bird_swell_big';
        this.imageId = 0;
        spriteUpdate(this.node.getComponent(cc.Sprite), this.spriteImage + this.type + "_" + this.imageId + ".png");
    },
});
