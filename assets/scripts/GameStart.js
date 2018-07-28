
cc.Class({
    extends: cc.Component,

    properties: {
    	//开始按钮
    	btn_start : {
    		default : null,
    		type : cc.Node
        },
        // 帮助按钮
        btn_help : {
            default : null,
    		type : cc.Node
        },
        // //总关卡数量
		// number_levels : 8,
    	// //当前最高关卡
        // highest_level : 1,
        // bgm 音频
        bgmAudio : {
            url: cc.AudioClip,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        // waiting
        this.btn_start.active = false;
        this._addWaiting();

        /* 初始化数据 */
        this._addResources();
        // 音效
        this._onPlayAudio();
    },

    _addWaiting : function(){
        let node = new cc.Node();
        this.node.addChild(node);
        this.waitingLabel = node;
        let label = node.addComponent(cc.Label);
        node.color = new cc.color(0, 0, 0, 255);
        label.string = 'loading...';
        node.setPosition(0, -150);
    },

    // 加载玩家初始数据
    _addResources : function(){
        let self = this;
        if(cc.sys.localStorage.getItem('player_resources')){
            // btn
            self.waitingLabel.active = false;
            self.btn_start.active = true;
            return;
        }
        this._initData(self);
    },

    // 开始游戏 : 开始按钮触发事件
    onStartGame: function () {
    	cc.director.loadScene("menu");
    },

    // 帮助
    onHelp : function(){
        this._stopPlayAudio();
        cc.director.loadScene("help");
    },
    
    // 播放音效
    _onPlayAudio : function(){
        if(this.bgmAudio){
            this.current = cc.audioEngine.play(this.bgmAudio, true, 0.3);
        }
    },

    // 停止音效
    _stopPlayAudio : function(){
            cc.audioEngine.stop(this.current);
    },

    // 初始化数据
    _initData : function(self){
        let jsonPath = "resources/json/init_data.json";
        let url = cc.url.raw( jsonPath);
        cc.loader.load( url, function( err, res) {
            // 加载所有资源
            self.resources = res;
            cc.sys.localStorage.setItem('player_resources', JSON.stringify(self.resources));
            // btn
            self.waitingLabel.active = false;
            self.btn_start.active = true;
        })
    },
});
