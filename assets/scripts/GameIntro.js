cc.Class({
    extends: cc.Component,

    properties: {
        //返回按钮
    	btn_back : {
    		default : null,
    		type : cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    onBackGame : function(){
        cc.director.loadScene("help");
    },

    start () {

    },

    // update (dt) {},
});
