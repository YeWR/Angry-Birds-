"use strict";
cc._RF.push(module, 'ed42bhWaEdGjYPkoiSe6qtV', 'gameController');
// scripts/utils/gameController.js

'use strict';

var _common = require('../utils/common');

cc.Class({
    extends: cc.Component,

    properties: {
        size: cc.size(0, 0),
        // 关卡
        level: 0,
        // 普通鸟 prefab
        birdPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 爆炸鸟 prefab
        birdBoomPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 飞行鸟 prefab
        birdFlyPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 膨胀鸟 prefab
        birdSwellPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 长木头 prefab
        woodLongPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 短木头 prefab
        woodShortPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 圆木头 prefab
        woodCirclePrefab: {
            default: null,
            type: cc.Prefab
        },
        // 长石头 prefab
        stoneLongPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 三角石头 prefab
        stoneTrianglePrefab: {
            default: null,
            type: cc.Prefab
        },
        // 圆石头 prefab
        stoneCirclePrefab: {
            default: null,
            type: cc.Prefab
        },
        // 冰块 prefab
        icePrefab: {
            default: null,
            type: cc.Prefab
        },
        // 猪 prefab
        pigPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 界面 prefab
        selectorPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 回到菜单prefab
        menuPrefab: {
            default: null,
            type: cc.Prefab
        },
        // next prefab
        nextPrefab: {
            default: null,
            type: cc.Prefab
        },
        // restart prefab
        restartPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 胜利音效
        victoryAudio: {
            url: cc.AudioClip,
            default: null
        },
        // 失败音效
        failAudio: {
            url: cc.AudioClip,
            default: null
        },
        // 弹弓
        spring: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 物理引擎
        cc.director.getPhysicsManager().enabled = true;
        // 重力加速度设置
        cc.director.getPhysicsManager().gravity = cc.v2(0, -500);

        // 相机是否可以跟随
        this.readyCamera = false,
        // 是否本局游戏结束
        this.gameOver = false;
        // 分数
        this.score = 0;
        // 当前正要发射的鸟
        this.curBird = null;
        // 加载资源(异步)
        this._addResources();
    },

    start: function start() {},


    // 主逻辑 控制
    _controlGame: function _controlGame(self) {
        var interval = 8;
        var delay = 0.5;
        self.schedule(function () {
            var over = self._levelNext(self);
            if (!self.gameOver) {
                if (self._emitNext(self) && (self.curBird === null || self.curBird.ready === -1)) {
                    self._cameraMoveBind();
                    self.scheduleOnce(function () {
                        self.curBird = self._emitBird(self);
                    }, delay);
                }
                if (over !== 0) {
                    self._gameOver(over, self);
                }
            }
        }, interval);
    },

    // 加载资源 注意异步加载
    _addResources: function _addResources() {
        var self = this;
        var jsonPath = "resources/json/level_" + self.level + ".json";
        var url = cc.url.raw(jsonPath);
        cc.loader.load(url, function (err, res) {
            // 加载游戏资源
            self.resources = res;
            // 加载玩家资源
            self._addPlayerRes(self);
            // 加载场景资源
            self._addScene(self);
            // 加载鸟
            self._addBirds(self);
            // 加载相机
            self._addCamera(self);
            // 开始游戏
            self._controlGame(self);
            // 加载完毕
            self.ready = true;

            // let bg = self.node.getChildByName('bg');
            // getAllToolsPosition(bg);
        });
    },

    // 加载玩家资源
    _addPlayerRes: function _addPlayerRes(self) {
        // 所有资源
        var resources = JSON.parse(cc.sys.localStorage.getItem('player_resources'));
        // 星星
        var stars = resources.stars;
        // 最高分
        var highest_scores = resources.highest_scores;
        // 最高关卡
        self.highest_level = resources.highest_level;
        // 总关卡
        self.number_levels = resources.number_levels;
        //
        self.stars = stars;
        self.star = 0;
        self.highest_score = 0;
        //
        if (self.level <= stars.length) {
            self.star = stars[self.level - 1];
        }
        if (self.level <= highest_scores.length) {
            self.highest_score = highest_scores[self.level - 1];
        }
    },

    // 加载场景
    _addScene: function _addScene(self) {
        // 加载分数
        var scoreNode = self.node.getChildByName('score');
        scoreNode.color = new cc.color(0, 0, 0, 255);
        var scoreLabel = scoreNode.getComponent(cc.Label);
        scoreLabel.string = "Score: " + self.score;
        self.scoreLabel = scoreLabel;

        // 加载最高分数
        var scoreHighestNode = self.node.getChildByName('score_highest');
        scoreHighestNode.color = new cc.color(255, 0, 0, 255);
        var scoreHighestLabel = scoreHighestNode.getComponent(cc.Label);
        scoreHighestLabel.string = "Highest Score: " + self.highest_score;

        // 加载当前关卡
        var levelNode = self.node.getChildByName('level');
        levelNode.color = new cc.color(0, 0, 0, 255);
        var levelLabel = levelNode.getComponent(cc.Label);
        levelLabel.string = "Level: " + self.level;
    },

    // 加载所有鸟的资源 self.birds 为Bird 组件
    _addBirds: function _addBirds(self) {
        // 所有的鸟
        self.birds = new Array();
        // 资源
        var birdsRes = self.resources.birds;
        // 各层父节点
        var bg = self.node.getChildByName('bg');
        // 发射空位
        var emitPlace = bg.getChildByName('emitPlace');
        // 每个鸟之间的距离
        var delta = -40;
        // 初始化每个鸟的位置(由于重力存在，仅需设置x方向)
        var cur_x = 0;
        // 实例化prefab鸟类
        birdsRes.forEach(function (bird) {
            var type = bird.split('bird')[1];
            var birdComp = 'Bird' + type;
            var newBird = void 0;
            if (type === '') {
                newBird = cc.instantiate(self.birdPrefab);
            } else if (type === 'Boom') {
                newBird = cc.instantiate(self.birdBoomPrefab);
            } else if (type === 'Fly') {
                newBird = cc.instantiate(self.birdFlyPrefab);
            } else if (type === 'Swell') {
                newBird = cc.instantiate(self.birdSwellPrefab);
            }
            self.birds.push(newBird.getComponent(birdComp));
            emitPlace.addChild(newBird);
            cur_x += delta;
            newBird.setPosition(cur_x, 0);
        });
    },

    // 加载相机
    _addCamera: function _addCamera(self) {
        var bg = self.node.getChildByName('bg');
        self.camera = bg.getChildByName('camera').getComponent('cameraController');
        self.camera.setStartScreen();
    },

    // 加载选择器 state 1-> 胜利， -1 -> 失败
    _addSelector: function _addSelector(state, self) {
        // 选择器容器
        var selector = cc.instantiate(self.selectorPrefab);
        self.node.addChild(selector);
        // 回到菜单
        var menu = cc.instantiate(self.menuPrefab);
        selector.addChild(menu);
        // 回到菜单事件
        menu.on("touchstart", function () {
            var scene = "menu";
            cc.director.loadScene(scene);
        }, self);
        // 再来一次
        var restart = cc.instantiate(self.restartPrefab);
        selector.addChild(restart);
        // 再来一次事件
        restart.on("touchstart", function () {
            var scene = 'level_' + self.level;
            cc.director.loadScene(scene);
        }, self);

        // 分数
        var scoreLabel = selector.getChildByName('scores').getComponent(cc.Label);
        scoreLabel.string = 'Score: ' + self.score;
        // 星星数量为[0,3]
        var birdNum = self._birdsEmitNumber();
        var starNum = Math.max(0, 4 - birdNum);
        starNum = Math.min(3, starNum);
        // 更换星星的图片
        var starSprite = selector.getChildByName('star').getComponent(cc.Sprite);
        var starUrl = 'resources/textures/stars/star_' + starNum + '.png';
        (0, _common.spriteUpdate)(starSprite, starUrl);
        if (state === -1 || !self._conditionNext(self)) {
            // 出局 或者 星星数太少
            // 位置
            menu.setPosition(-70, -95);
            restart.setPosition(70, -95);
        } else if (state === 1) {
            // 下一局
            // 增加下一关按钮
            var next = cc.instantiate(self.nextPrefab);
            selector.addChild(next);
            // 下一关事件
            next.on("touchstart", function () {
                var level = self.level + 1;
                var scene = "";
                if (self.highest_level >= level) {
                    scene = 'level_' + level;
                } else {
                    scene = 'clearance';
                }
                // 注意关卡最大值
                cc.director.loadScene(scene);
            }, self);
            // 位置
            menu.setPosition(-100, -95);
            restart.setPosition(0, -93);
            next.setPosition(100, -95);
        }
        return selector;
    },

    // 分数
    addScore: function addScore(score) {
        this.score += score;
        this.scoreLabel.string = "Score: " + this.score;
    },

    // 准备发射一只鸟
    _emitBird: function _emitBird(self) {
        // 准备弹弓
        var rope = self.spring.getComponent(cc.RopeJoint);
        if (!rope) {
            self.spring.addComponent(cc.RopeJoint);
        }
        // 其他准备中的鸟设置不可碰撞
        self.birds.forEach(function (bird) {
            if (bird) {
                var ready = bird.ready;
                if (ready === 0) {
                    bird.setRigidActive(false);
                }
            }
        });
        // 准备鸟
        var bird = self.birds.shift(); // .getComponent('Bird');
        self.birds.push(bird);

        if (bird) {
            // 设置可碰撞
            bird.setRigidActive(true);
            // 设置弹性
            bird.setRestitution(0.4);
            // 进入弹弓
            bird.readyEmit(self.spring);
        }
        // 相机
        this.camera.bindCenter(bird);
        return bird;
    },

    // 判断是否所有刚体的速度是否为'0'，是则返回true，否则返回false
    _allStatic: function _allStatic(children) {
        // 速度的最小值
        var delta = 0.5;
        var ans = true;
        // 是否处于基本静止状态
        children.forEach(function (child) {
            var rigidBody = child.getComponent(cc.RigidBody);
            if (rigidBody) {
                var velocity = rigidBody.linearVelocity;
                if (Math.abs(velocity.x > delta) || Math.abs(velocity.y > delta)) {
                    ans = false;
                }
            }
        });
        return ans;
    },

    // 多少只鸟已经发射
    _birdsEmitNumber: function _birdsEmitNumber() {
        var ans = 0;
        this.birds.forEach(function (bird) {
            if (bird.ready === -1) {
                ans += 1;
            }
        });
        return ans;
    },

    // 判断是否可以发射
    _emitNext: function _emitNext(self) {
        if (self.birds[0].ready === -1) {
            return false;
        } else {
            // 所有子节点
            // let children = getAllBranches(self.node);
            // return self._allStatic(children);
            return true;
        }
    },

    // 判断是否可以进行下一局，出局或者继续, 0 -> 继续 ,1 -> 下一局, -1 -> 出局
    _levelNext: function _levelNext(self) {
        var state = 1;
        var children = (0, _common.getAllBranches)(self.node);
        children.forEach(function (child) {
            var name = child.name;
            if (state === 1 && name.indexOf('pig') !== -1) {
                // 还有猪
                state = 0;
            }
        });
        if (state === 0) {
            // 已经发射的鸟的数量
            var birdNum = self._birdsEmitNumber();
            var allStatic = self._allStatic(children);
            if (allStatic) {
                if (birdNum === self.birds.length) {
                    // 没有鸟了，出局
                    state = -1;
                }
            }
        }
        return state;
    },

    // 结束本局游戏 弹出菜单 1 -> 胜利, -1 -> 本局gg，
    _gameOver: function _gameOver(state, self) {
        self.gameOver = true;
        // 鸟的分数
        self.birds.forEach(function (bird) {
            if (bird && bird.ready !== -1) {
                var score = 10000;
                var duration = 1;
                (0, _common.scoreAnimation)(bird.node, score, duration);
                self.addScore(score);
            }
        });
        // 更改最高分
        self.highest_score = Math.max(self.highest_score, self.score);
        // 更改星星数量
        var starNumPrevious = self.star;

        // 已经发射的鸟的数量
        var birdNum = self._birdsEmitNumber();
        // 星星数量为[0,3]
        var starNum = Math.max(0, 4 - birdNum);
        starNum = Math.min(3, starNum);
        // 本地存储
        self.star = Math.max(starNumPrevious, starNum);
        var level = self.level + 1;
        // 胜利
        if (state === 1 && self._conditionNext(self)) {
            // victory音效
            self._onPlayAudio('victory');
            // 开荒
            if (level > self.highest_level) {
                if (self.number_levels >= level) {
                    // 更改最高关卡
                    self.highest_level = level;
                }
                // 完结
                else {
                        console.log("You are so great! No more levels for you! ~0.0~");
                    }
            }
        } else {
            // fail音效
            self._onPlayAudio('fail');
            if (state === -1) {
                self.star = Math.max(self.star - 1, 0);
            }
        }
        // 数据更改
        self._changePlayerRes(self);
        // 选择界面
        self._addSelector(state, self);
    },

    // 更改玩家游戏数据
    _changePlayerRes: function _changePlayerRes(self) {
        // 所有资源
        var resources = JSON.parse(cc.sys.localStorage.getItem('player_resources'));
        // 星星
        resources.stars[self.level - 1] = self.star;
        // 最高分
        resources.highest_scores[self.level - 1] = self.highest_score;
        // 最高关卡
        resources.highest_level = self.highest_level;
        // 存储
        cc.sys.localStorage.setItem('player_resources', JSON.stringify(resources));
    },

    _conditionNext: function _conditionNext(self) {
        // 解锁条件
        // 最后一关是否通关
        if (self.level === self.number_levels) {
            if (self.star >= 2) {
                return true;
            } else {
                return false;
            }
        }
        // 解锁最后一关
        else if (self.level === self.number_levels - 1) {
                if (self.star && self.star === 3) {
                    var totalStars = 0;
                    var minStars = 3 * (self.level - 1) - 2;
                    for (var i = 0; i < self.level - 1; ++i) {
                        totalStars += self.stars[i];
                    }
                    if (totalStars >= minStars) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            // 解锁后半程关卡
            else if (self.level >= self.number_levels / 2) {
                    if (self.star && self.star >= 2) {
                        return true;
                    } else {
                        return false;
                    }
                }
                // 解锁前半程关卡 
                else {
                        if (self.star && self.star >= 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
    },

    // 相机移动
    _cameraMoveBind: function _cameraMoveBind() {
        if (!this.readyCamera) {
            var bg = this.node.getChildByName('bg');
            bg.on('touchmove', this._cameraEvent.bind(this));
            this.readyCamera = true;
        }
    },

    // 相机移动事件
    _cameraEvent: function _cameraEvent(event) {
        var delta = event.touch.getDelta();
        delta.x = -delta.x;
        delta.y = -delta.y;
        this.camera.moveCamera(delta);
    },

    // 播放音效
    _onPlayAudio: function _onPlayAudio(type) {
        if (type === 'victory' && this.victoryAudio) {
            this.currentAudio = cc.audioEngine.play(this.victoryAudio, false, 0.8);
        } else if (type === 'fail' && this.failAudio) {
            this.currentAudio = cc.audioEngine.play(this.failAudio, false, 0.8);
        }
    }
});

cc._RF.pop();