"use strict";
cc._RF.push(module, '5202814naZL/popuUJU0IPc', 'GameMenu');
// scripts/GameMenu.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {
		//关卡预制资源
		level_prefab: {
			default: null,
			type: cc.Prefab
		},
		level_clock_prefab: {
			default: null,
			type: cc.Prefab
		}
	},

	onLoad: function onLoad() {
		// 所有资源
		var resources = JSON.parse(cc.sys.localStorage.getItem('player_resources'));
		// 获取总关卡
		this.number_levels = resources.number_levels;
		// 获取本地数据——最高关卡
		this.highest_level = resources.highest_level;
		// 获取本地数据——星星数量
		this.stars = resources.stars;
		//绘制关卡界面
		this.onLevelLayout();
	},

	//关卡界面，每行放4关
	onLevelLayout: function onLevelLayout() {
		var stars = this.stars;
		var pos_x_min = -300;
		var pos_y_max = 200;
		var delta_x = 200;
		var delta_y = 200;

		for (var i = 0; i < this.number_levels; ++i) {
			var level = null;
			if (i < this.highest_level) {
				var star = 0;
				if (i < stars.length) {
					star = Number(stars[i]);
				}
				level = cc.instantiate(this.level_prefab);
				level.getComponent('Level').init(i + 1, star);
			} else {
				level = cc.instantiate(this.level_clock_prefab);
			}
			var x = pos_x_min + delta_x * parseInt(i % 4);
			var y = pos_y_max - delta_y * parseInt(i / 4);

			level.setPosition(cc.p(x, y));

			this.node.addChild(level);
		}
	}
});

cc._RF.pop();