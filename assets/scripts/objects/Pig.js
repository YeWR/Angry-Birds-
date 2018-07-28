const MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //图片路径
        this.spriteImage = 'resources/textures/pigs/';
        //图片id
        this.imageId = 0;
        // 分数
        this.score = 10000;
    },
});
