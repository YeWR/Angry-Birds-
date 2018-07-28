const MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/woods/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentWood";
        // 分数
        this.score = this.blood_max;
    },
});
