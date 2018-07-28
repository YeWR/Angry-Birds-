const MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {
    },

    onLoad () {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/stones/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentStone";
        // 分数
        this.score = 10 * this.blood_max;
    },
});
