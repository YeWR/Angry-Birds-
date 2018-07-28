import {spriteUpdate} from './utils/common';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function(id, star){
        this.level_id = id;
        this.star = star;
        // 添加关卡显示
        this._addLevelLable(id);
        // 添加星星显示
        this._addStarSprite(star);
    },

    // 添加关卡
    _addLevelLable : function(id){
        let level_node = new cc.Node();
        level_node.addComponent(cc.Label);
        let level_label = level_node.getComponent(cc.Label);
        level_label.string = id;
        this.node.addChild(level_node);    
        level_node.setPosition(0, -5);
        this.node.on('touchstart', this._eventChooseScene, this);
    },

    // 修改星星
    _addStarSprite : function(star){
        // 星星sprite
        let starSprite = this.node.getChildByName('star').getComponent(cc.Sprite);
        let spriteUrl = 'resources/textures/stars/star_' + star + ".png";
        spriteUpdate(starSprite, spriteUrl);
    },

    // 选择事件
    _eventChooseScene : function(){
        let scene = 'level_' + this.level_id;
        cc.director.loadScene(scene);
    },
});
