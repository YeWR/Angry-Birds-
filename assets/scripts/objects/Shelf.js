const MyObject = require("ToolObject");

cc.Class({
    extends: MyObject,

    properties: {
    },

    onLoad () {
        //图片路径 
        this.spriteImage = 'resources/textures/tools/shelfs/',
        //图片id
        this.imageId = 0;
        //碎屑类型
        this.fragmentType = "FragmentWood";
        // 分数
        this.score = 5000;
    },
});
