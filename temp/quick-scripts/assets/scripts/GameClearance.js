(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GameClearance.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0a90cKrB6VGob94bfRxOwew', 'GameClearance', __filename);
// scripts/GameClearance.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var duration = 2;
        this._addCongratulations(duration);
        this.scheduleOnce(function () {
            cc.director.loadScene("start");
        }, duration + 1);
    },


    _addCongratulations: function _addCongratulations(duration) {
        var node = new cc.Node();
        this.node.addChild(node);
        var label = node.addComponent(cc.Label);
        label.string = "没想到真有人能通关。233，太强啦。";
        var toolPos = new cc.Vec2(0, 200);
        node.setPosition(toolPos);
        var pos = node.getPosition();
        var actionPos = cc.moveTo(duration, pos.x, pos.y - 400);
        var actionFade = cc.fadeTo(duration, 0);

        node.runAction(actionPos);
        node.runAction(actionFade);
    },

    start: function start() {}
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
        //# sourceMappingURL=GameClearance.js.map
        