export function getGameController(node){//获取GameController
    let canvas = getCanvas(node);
    let gameController = canvas.getChildren()[0].getComponent('gameController');
    return gameController;
}

export function spriteUpdate(sprite, spriteUrl){// 更换sprite图片
    let spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(cc.url.raw(spriteUrl));
    sprite.spriteFrame = spriteFrame;
}

export function scoreAnimation(node, score, duration){// 加载分数动画
    if(!score){
        return; 
    }
    let scoreNode = new cc.Node();
    
    node.parent.addChild(scoreNode);
    if(score === 10000 || score === 5000){
        let sprite = scoreNode.addComponent(cc.Sprite);
        let url = 'resources/textures/scores/score_' + score + ".png";
        spriteUpdate(sprite, url);
    }
    else{
        let label = scoreNode.addComponent(cc.Label);
        let font = "resources/textures/font/mikado_outline_shadow.fnt";
        label.font = font;
        label.string = score;
    }
    let toolPos = node.getPosition();
    scoreNode.setPosition(toolPos);

    let pos = scoreNode.getPosition();
    let actionPos = cc.moveTo(duration, pos.x, pos.y + 150);
    let actionFade = cc.fadeTo(duration, 0);

    scoreNode.runAction(actionPos);
    scoreNode.runAction(actionFade);
}

export function getEffect(selfCollider, otherCollider, angle){// 获得冲击伤害值
    // 刚体
    let rigid_self = selfCollider.getComponent(cc.RigidBody);
    let rigid_oth = otherCollider.getComponent(cc.RigidBody);
    // 速度
    let vel_self = rigid_self.linearVelocity;
    let vel_oth = rigid_oth.linearVelocity;
    //质量
    let mas_self = rigid_self.getMass();
    let mas_oth = rigid_oth.getMass();
    // 相对速度
    let vel_del = vel_oth.sub(vel_self);
    // 法向速度绝对值 / 8
    let vel_vertical = Math.abs(vel_del.x * Math.sin(angle) + vel_del.y * Math.cos(angle)) / 8 ;
    // 伤害
    if(mas_oth === 0){//地面，相当于镜面相撞
        mas_oth = mas_self;
    }
    let effect = 0.5 * mas_oth * vel_vertical * vel_vertical;

    return effect;
}

export function getWorldLocation(node){// 获得世界坐标
    return node.parent.convertToWorldSpaceAR(node);
}

export function getAllBranches(root){// 得到所有子节点
    let branches = new Array();

    let getCld = function(node){
        return node.getChildren();
    }

    let grand = function(node){
        if(node){
            let children = getCld(node);
            children.forEach(child => {
                branches.push(child);
                grand(child);
            })
        }
    }

    grand(root);
    return branches;
}

export function getCanvas(node){// 得到canvas
    let root = node;
    while(root.parent){
        root = root.parent;
    }
    return root;
}

export function getMinDistance_P_Line(point, line_1, line_2){// 点到线段的最小距离
    let dis = 0;
    let dx = line_2.x - line_1.x;
    let dy = line_2.y - line_1.y;
 
    // 两直线垂直，向量表示法
    let k = -((line_1.x - point.x) * dx + (line_1.y - point.y) * dy) / (dx * dx + dy * dy);
    let footX = k * dx + line_1.x;
    let footY = k * dy + line_1.y;
 
    //if垂足是否落在线段上
    if(footY >= Math.min(line_1.y, line_2.y)
    && footY <= Math.max(line_1.y, line_2.y)
    && footX >= Math.min(line_1.x, line_2.x) 
    && footX <= Math.max(line_1.x, line_2.x)){
        dis = Math.hypot(footX - point.x, footY - point.y);
    }
    else{
        let dis1 = Math.hypot(line_1.x - point.x, line_1.y - point.y);
        let dis2 = Math.hypot(line_2.x - point.x, line_2.y - point.y);
 
        dis = ( dis1 < dis2 ? dis1 : dis2 );
    }
    return dis;
}

export function getMinDistance_P_C(point, center, radius){// 点到圆的最小距离
    let dis = Math.hypot(point.x - center.x, point.y - center.y);
    dis -= radius;
    dis = Math.max(dis, 0);
    return dis;
}

export function getMinDistance_P_Poly(point, ...ps){// 点到多边形的最小距离
    let dis = getMinDistance_P_Line(point, ps[ps.length - 1], ps[0]);
    for(let i = 0; i < ps.length - 1; ++i){
        dis = Math.min(dis, getMinDistance_P_Line(point, ps[i], ps[i + 1]));
    }
    return dis;
}

export function isOutOfBorder(location, minX, maxX, minY, maxY){// 是否在矩形之外
    if(location.x < minX || location.x > maxX || location.y < minY || location.y > maxY){
        return true;
    }
    return false;
}

export function changeRectangle(position, size){// 将矩形改成四点坐标
    let rec = [];
    rec[0] = position.x - size.width / 2;
    rec[1] = position.x + size.width / 2;
    rec[2] = position.y - size.height / 2;
    rec[3] = position.y + size.height / 2;
    return rec;
}

export function getAllToolsPosition(bg){
    let branches = getAllBranches(bg);
    let ans = {
        'wood' : 
            {
                'long' : [],
                'short' : [],
                'circle' : []
            },
        'stone' : 
            {
                'long' : [],
                'triangle' : [],
                'circle' : []
            },
        'ice' : [],
        'shelf' : [],
        'pig' : [],
    };
    branches.forEach(branch => {
        if(branch) {
            let type = branch._name;
            if(type.indexOf('bird')){

            }
            else if(type.indexOf('tool')){
                
            }
        } 
    });
}