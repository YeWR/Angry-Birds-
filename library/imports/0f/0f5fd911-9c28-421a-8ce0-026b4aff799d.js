"use strict";
cc._RF.push(module, '0f5fdkRnChCGozgAmtK/3md', 'common');
// scripts/utils/common.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getGameController = getGameController;
exports.spriteUpdate = spriteUpdate;
exports.scoreAnimation = scoreAnimation;
exports.getEffect = getEffect;
exports.getWorldLocation = getWorldLocation;
exports.getAllBranches = getAllBranches;
exports.getCanvas = getCanvas;
exports.getMinDistance_P_Line = getMinDistance_P_Line;
exports.getMinDistance_P_C = getMinDistance_P_C;
exports.getMinDistance_P_Poly = getMinDistance_P_Poly;
exports.isOutOfBorder = isOutOfBorder;
exports.changeRectangle = changeRectangle;
exports.getAllToolsPosition = getAllToolsPosition;
function getGameController(node) {
    //获取GameController
    var canvas = getCanvas(node);
    var gameController = canvas.getChildren()[0].getComponent('gameController');
    return gameController;
}

function spriteUpdate(sprite, spriteUrl) {
    // 更换sprite图片
    var spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(cc.url.raw(spriteUrl));
    sprite.spriteFrame = spriteFrame;
}

function scoreAnimation(node, score, duration) {
    // 加载分数动画
    if (!score) {
        return;
    }
    var scoreNode = new cc.Node();

    node.parent.addChild(scoreNode);
    if (score === 10000 || score === 5000) {
        var sprite = scoreNode.addComponent(cc.Sprite);
        var url = 'resources/textures/scores/score_' + score + ".png";
        spriteUpdate(sprite, url);
    } else {
        var label = scoreNode.addComponent(cc.Label);
        var font = "resources/textures/font/mikado_outline_shadow.fnt";
        label.font = font;
        label.string = score;
    }
    var toolPos = node.getPosition();
    scoreNode.setPosition(toolPos);

    var pos = scoreNode.getPosition();
    var actionPos = cc.moveTo(duration, pos.x, pos.y + 150);
    var actionFade = cc.fadeTo(duration, 0);

    scoreNode.runAction(actionPos);
    scoreNode.runAction(actionFade);
}

function getEffect(selfCollider, otherCollider, angle) {
    // 获得冲击伤害值
    // 刚体
    var rigid_self = selfCollider.getComponent(cc.RigidBody);
    var rigid_oth = otherCollider.getComponent(cc.RigidBody);
    // 速度
    var vel_self = rigid_self.linearVelocity;
    var vel_oth = rigid_oth.linearVelocity;
    //质量
    var mas_self = rigid_self.getMass();
    var mas_oth = rigid_oth.getMass();
    // 相对速度
    var vel_del = vel_oth.sub(vel_self);
    // 法向速度绝对值 / 8
    var vel_vertical = Math.abs(vel_del.x * Math.sin(angle) + vel_del.y * Math.cos(angle)) / 8;
    // 伤害
    if (mas_oth === 0) {
        //地面，相当于镜面相撞
        mas_oth = mas_self;
    }
    var effect = 0.5 * mas_oth * vel_vertical * vel_vertical;

    return effect;
}

function getWorldLocation(node) {
    // 获得世界坐标
    return node.parent.convertToWorldSpaceAR(node);
}

function getAllBranches(root) {
    // 得到所有子节点
    var branches = new Array();

    var getCld = function getCld(node) {
        return node.getChildren();
    };

    var grand = function grand(node) {
        if (node) {
            var children = getCld(node);
            children.forEach(function (child) {
                branches.push(child);
                grand(child);
            });
        }
    };

    grand(root);
    return branches;
}

function getCanvas(node) {
    // 得到canvas
    var root = node;
    while (root.parent) {
        root = root.parent;
    }
    return root;
}

function getMinDistance_P_Line(point, line_1, line_2) {
    // 点到线段的最小距离
    var dis = 0;
    var dx = line_2.x - line_1.x;
    var dy = line_2.y - line_1.y;

    // 两直线垂直，向量表示法
    var k = -((line_1.x - point.x) * dx + (line_1.y - point.y) * dy) / (dx * dx + dy * dy);
    var footX = k * dx + line_1.x;
    var footY = k * dy + line_1.y;

    //if垂足是否落在线段上
    if (footY >= Math.min(line_1.y, line_2.y) && footY <= Math.max(line_1.y, line_2.y) && footX >= Math.min(line_1.x, line_2.x) && footX <= Math.max(line_1.x, line_2.x)) {
        dis = Math.hypot(footX - point.x, footY - point.y);
    } else {
        var dis1 = Math.hypot(line_1.x - point.x, line_1.y - point.y);
        var dis2 = Math.hypot(line_2.x - point.x, line_2.y - point.y);

        dis = dis1 < dis2 ? dis1 : dis2;
    }
    return dis;
}

function getMinDistance_P_C(point, center, radius) {
    // 点到圆的最小距离
    var dis = Math.hypot(point.x - center.x, point.y - center.y);
    dis -= radius;
    dis = Math.max(dis, 0);
    return dis;
}

function getMinDistance_P_Poly(point) {
    for (var _len = arguments.length, ps = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        ps[_key - 1] = arguments[_key];
    }

    // 点到多边形的最小距离
    var dis = getMinDistance_P_Line(point, ps[ps.length - 1], ps[0]);
    for (var i = 0; i < ps.length - 1; ++i) {
        dis = Math.min(dis, getMinDistance_P_Line(point, ps[i], ps[i + 1]));
    }
    return dis;
}

function isOutOfBorder(location, minX, maxX, minY, maxY) {
    // 是否在矩形之外
    if (location.x < minX || location.x > maxX || location.y < minY || location.y > maxY) {
        return true;
    }
    return false;
}

function changeRectangle(position, size) {
    // 将矩形改成四点坐标
    var rec = [];
    rec[0] = position.x - size.width / 2;
    rec[1] = position.x + size.width / 2;
    rec[2] = position.y - size.height / 2;
    rec[3] = position.y + size.height / 2;
    return rec;
}

function getAllToolsPosition(bg) {
    var branches = getAllBranches(bg);
    var ans = {
        'wood': {
            'long': [],
            'short': [],
            'circle': []
        },
        'stone': {
            'long': [],
            'triangle': [],
            'circle': []
        },
        'ice': [],
        'shelf': [],
        'pig': []
    };
    branches.forEach(function (branch) {
        if (branch) {
            var type = branch._name;
            if (type.indexOf('bird')) {} else if (type.indexOf('tool')) {}
        }
    });
}

cc._RF.pop();