(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Level.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1ba3cNNmW1P052VN7+FpKyK', 'Level', __filename);
// scripts/Level.js

'use strict';

var _common = require('./utils/common');

cc.Class({
    extends: cc.Component,

    properties: {},

    init: function init(id, star) {
        this.level_id = id;
        this.star = star;
        // 添加关卡显示
        this._addLevelLable(id);
        // 添加星星显示
        this._addStarSprite(star);
    },

    // 添加关卡
    _addLevelLable: function _addLevelLable(id) {
        var level_node = new cc.Node();
        level_node.addComponent(cc.Label);
        var level_label = level_node.getComponent(cc.Label);
        level_label.string = id;
        this.node.addChild(level_node);
        level_node.setPosition(0, -5);
        this.node.on('touchstart', this._eventChooseScene, this);
    },

    // 修改星星
    _addStarSprite: function _addStarSprite(star) {
        // 星星sprite
        var starSprite = this.node.getChildByName('star').getComponent(cc.Sprite);
        var spriteUrl = 'resources/textures/stars/star_' + star + ".png";
        (0, _common.spriteUpdate)(starSprite, spriteUrl);
    },

    // 选择事件
    _eventChooseScene: function _eventChooseScene() {
        var scene = 'level_' + this.level_id;
        cc.director.loadScene(scene);
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
        //# sourceMappingURL=Level.js.map
        