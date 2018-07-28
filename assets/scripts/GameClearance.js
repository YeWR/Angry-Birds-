cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        let duration = 2;
        this._addCongratulations(duration);
        this.scheduleOnce(function(){
            cc.director.loadScene("start");
        }, duration + 1);
    },

    _addCongratulations : function(duration){
        let node = new cc.Node;
        this.node.addChild(node);
        let label = node.addComponent(cc.Label);
        label.string = "没想到真有人能通关。233，太强啦。";
        let toolPos = new cc.Vec2(0, 200);
        node.setPosition(toolPos);
        let pos = node.getPosition();
        let actionPos = cc.moveTo(duration, pos.x, pos.y - 400);
        let actionFade = cc.fadeTo(duration, 0);

        node.runAction(actionPos);
        node.runAction(actionFade);
    },

    start () {

    },
});
