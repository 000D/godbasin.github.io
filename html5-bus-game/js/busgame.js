// JavaScript Document
var busGame = {
	// ��Ϸ�ؿ�����
	STATE_STARTING_SCREEN : 1,
	STATE_PLAYING : 2,
	STATE_GAMEOVER_SCREEN : 3,
	
	state : 0,
	
	fuel: 0,
	fuelMax: 0,

	currentLevel:0,
	
	busMovable: 0,
	
	busLives:6
}

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

//����������ͼƬ
var livesImages=new Array();
for(var x=0;x<7;x++)
{
     livesImages[x]=new Image();
	 livesImages[x].src="./images/lives"+x+".png";
}


$(function() 
{
		
	//��ʿ����
	setInterval("hiccup()",3000);	
	
	//�����¼� 
	$(document).keydown(function(e)
	{
		switch(e.keyCode) 
		{
			case 39:           //�Ҽ���ǰ
				if (busGame.fuel > 0 && busGame.busMovable)
				{
					var force = new b2Vec2(120000, 0);
					busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');
				}				
				break;
				
			case 37:            //������
				if (busGame.fuel > 0 && busGame.busMovable)
				{
					var force = new b2Vec2(-120000, 0);
					busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');					
				}
				break;
				
			case 38:            //�ϼ�����
				if (busGame.fuel > 0 && busGame.busMovable)
				{
	                var force = new b2Vec2(0, -350000);
	                busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
	                busGame.bus[2].ApplyImpulse(force, busGame.bus[2].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');					
				}
				break;
				
			case 82: //r������
			   document.location.reload();
			   break;
			   
			case 84: //t������
			   restartGame(busGame.currentLevel);
		       busGame.busLives--; 

			   break;
		}
	});
	
	// ��ʼ����
	busGame.state = busGame.STATE_STARTING_SCREEN;
	
	// �����ʼ���濪ʼ��Ϸ
	$('#game').click(function()
	{
		if (busGame.state == busGame.STATE_STARTING_SCREEN)
		{
			// �ؿ��ı�
			busGame.state = busGame.STATE_PLAYING;

			// ���¿�ʼ��Ϸ
			restartGame(busGame.currentLevel);
			
			// ��һ��
			step();
		}				
    });
	
	console.log("The world is created. ", busGame.world);
	
	// get the reference of the context
	canvas = document.getElementById('game');  
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);	

});
	
	
function hiccup()
{
	//����ʿ�ӳ���
	var force = new b2Vec2(0, -200000);
	busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
	busGame.bus[2].ApplyImpulse(force, busGame.bus[2].GetCenterPosition());
}
	
	

function createWorld() 
{
    // ����Ĵ�С
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-4000, -4000);
    worldAABB.maxVertex.Set(4000, 4000);
	
    //��������
    var gravity = new b2Vec2(0, 300);
	
    // �Ƿ�����
    var doSleep = false;
	
    // ���մ�������
    var world = new b2World(worldAABB, gravity, doSleep);
	
    return world;
}



function step() 
{
	busGame.world.Step(1.0/60, 1);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	DrawLives();
	
	drawWorld(busGame.world, ctx);
	
	setTimeout(step, 10);
	
	//����ʿ�����Ƿ�ʣ��
	if(busGame.busLives == 0)
	{
		// ��Ϸ����
		$('#game').removeClass().addClass('gamebg_Lose'); 
				
		// ��������
		busGame.world = createWorld();
	}
		
	
	//����ʿ�Ƿ�ӽ����Ӹ���
	for(var i = 0; i < busGame.boxList.length; i++)
	{
	    if( Math.abs(busGame.boxList[i][0].GetOriginPosition().x - busGame.bus[1].GetOriginPosition().x) < 150 )
	    {
		    busGame.world.DestroyBody(busGame.boxList[i][1]);
	    }
	}
	
	
	//����ʿ�Ƿ���±߽�
	if(busGame.bus[1].GetOriginPosition().y > 800 )
	{
		restartGame(busGame.currentLevel);
		busGame.busLives--; 
	    
	}

	
	
	for (var cn = busGame.world.GetContactList(); cn != null; cn = cn.GetNext())
	{				
		var body1 = cn.GetShape1().GetBody();
		var body2 = cn.GetShape2().GetBody();
		
		// ����ʿ�Ƿ񵽴�Ŀ�ĵ�
		if ((body1 == busGame.bus[1] && body2 == busGame.gamewinWall) ||
			(body2 == busGame.bus[1] && body1 == busGame.gamewinWall))
		{
			console.log("Level Passed!");
			
			
			if (busGame.currentLevel < 4)
			{
				restartGame(busGame.currentLevel+1);
			}
			else
			{
				// ��Ϸ����
				$('#game').removeClass().addClass('gamebg_won'); 
				
				// ��������
				busGame.world = createWorld();
				
			}
			
		}
		
		//����ʿ�Ƿ�ײ���������(���ã������ƣ��޷�����������ʱ�������⣩
		for(var i = 0; i < busGame.fragileGroundList.length; i++)
		{
		    if ((body1 == busGame.bus[0] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.fragileGroundList[i]) ||
				(body1 == busGame.bus[1] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.fragileGroundList[i]) ||
				(body1 == busGame.bus[2] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.fragileGroundList[i]))
		    {
			    busGame.fragileGround = busGame.fragileGroundList[i];
			    setTimeout("busGame.world.DestroyBody(busGame.fragileGround)",1000);
		    }
		}
				
		//��������Ƿ�Ӵ�����
		for(var i = 0; i < busGame.groundList.length; i++)
		{
		    if ((body1 == busGame.bus[0] && body2 == busGame.groundList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.groundList[i]))
		    {
			    busGame.busMovable = 1;
				break;
		    }
			else
			{
				setTimeout("busGame.busMovable = 0",100);
			}
			
		}
		
		//��鳵���Ƿ�ײ������
		for(var i = 0; i < busGame.boxList.length; i++)
		{
		    if ((body1 == busGame.bus[1] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.boxList[i][0])||
				(body1 == busGame.bus[0] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.boxList[i][0])||
				(body1 == busGame.bus[2] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.boxList[i][0]))
		    {
			    restartGame(busGame.currentLevel);
				busGame.busLives--; 
		    }
						
		}
		
		//��鳵���Ƿ�ײ������
		for(var i = 0; i < busGame.ballList.length; i++)
		{
		    if ((body1 == busGame.bus[1] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.ballList[i])||
				(body1 == busGame.bus[0] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.ballList[i])||
				(body1 == busGame.bus[2] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.ballList[i]))
		    {
			    restartGame(busGame.currentLevel);
				busGame.busLives--;
		    }
						
		}



/*
		//����ʿ�Ƿ�ת(�����ƣ�
		for(var i = 0; i < busGame.groundList.length; i++)
		{
			if ((body1 == busGame.bus[3] && body2 == busGame.groundList[i]) ||
			    (body2 == busGame.bus[3] && body1 == busGame.groundList[i]))
			{
			    // ��Ϸ����
			    $('#game').removeClass().addClass('gamebg_won'); 
			}		
	    }
*/

		
	}
}


function DrawLives()
{
     ctx.drawImage(livesImages[busGame.busLives],700,530);
}



function createGround(x, y, width, height, rotation, type) 
{
	// ���ζ���
	var groundSd = new b2BoxDef();              //����
	groundSd.extents.Set(width, height);         //����
	groundSd.restitution = 0;                  //����
	if (type == "win") 
	{
		groundSd.userData = document.getElementById('flag');
	}


    if (type == "fragile") 
	{
		groundSd.userData = document.getElementById('fragile');
	}

	
	// �þ��ζ������
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);                //�����״
	groundBd.position.Set(x, y);                //λ��
	groundBd.rotation = rotation * Math.PI / 180;     //�Ƕ�
	var body = busGame.world.CreateBody(groundBd);
	
	return body;
}



function createBusAt(x, y) 
{
	// ��ʿ����
	var boxSd = new b2BoxDef();
	boxSd.density = 0.4;                //��ʿ�ܶ�
	boxSd.friction = 4.5;               //��ʿĦ����
	boxSd.restitution =0;             //��ʿ����
	boxSd.extents.Set(30, 20);          //��ʿ����
	boxSd.userData = document.getElementById('bus');
	
	// ��ʿ����
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);		
	var busBody = busGame.world.CreateBody(boxBd);
	

/*
	// ��ʿ�������壨������ײ��⣩
	var ballSd2 = new b2CircleDef();
	ballSd2.density = 0.0000001;          //�ܶ�
	ballSd2.radius = 5;            //�뾶
	ballSd2.restitution = 0;      //����
	ballSd2.friction = 0.2;         //Ħ��
	var ballBd2 = new b2BodyDef();
	ballBd2.AddShape(ballSd2);
	ballBd2.position.Set(x,y-25);
	var topBody = busGame.world.CreateBody(ballBd2);

	//������ʿ���ʿ�����Ĺؽ�
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x, y-25);
	jointDef.body1 = busBody;
	jointDef.body2 = topBody;
    busGame.world.CreateJoint(jointDef);
*/


	// ��ʿ����
	var wheelBody1 = createWheel(busGame.world, x-10, y+20);
	var wheelBody2 = createWheel(busGame.world, x+10, y+20);
	
	
	//�������ֺͰ�ʿ�Ĺؽ�
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x-10, y+20);
	jointDef.body1 = busBody;
	jointDef.body2 = wheelBody1;
	var frontJoint = busGame.world.CreateJoint(jointDef);
	
	//�������ֺͰ�ʿ�Ĺؽ�
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x+10, y+20);
	jointDef.body1 = busBody;
	jointDef.body2 = wheelBody2;
	var rearJoint = busGame.world.CreateJoint(jointDef);
	
	return [wheelBody1,busBody,wheelBody2];
				
}



function createBoxAt(x, y) 
{
	// ���Ӷ���
	var boxSd = new b2BoxDef();
	boxSd.density = 0.4;                //�����ܶ�
	boxSd.friction = 4.5;               //����Ħ����
	boxSd.restitution =0;             //���ӵ���
	boxSd.extents.Set(20, 20);          //���ӳ���
	boxSd.userData = document.getElementById('box');
	
	// ���Ӹ���
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y+10);		
	var boxBody = busGame.world.CreateBody(boxBd);
	
	//��ס���ӵĵ���
	var boxSd = new b2BoxDef();
	boxSd.density = 0;                //�����ܶ�
	boxSd.friction = 5;               //����Ħ����
	boxSd.restitution =0;             //��������
	boxSd.extents.Set(20, 1);          //��������
	
	// ��������
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y+22);		
	var boxControlBody = busGame.world.CreateBody(boxBd);


	return [boxBody,boxControlBody];
}


function createBallAt(world, x, y) 
{
	var ballSd2 = new b2CircleDef();
	ballSd2.density = 0.8;          //�ܶ�
	ballSd2.radius = 10;            //�뾶
	ballSd2.restitution = 0.99;      //����
	ballSd2.friction = 0.2;         //Ħ��
	ballSd2.userData = document.getElementById('ball');

	var ballBd2 = new b2BodyDef();
	ballBd2.AddShape(ballSd2);
	ballBd2.position.Set(x,y);
	var ballBody = busGame.world.CreateBody(ballBd2);
	
	return ballBody;
}




function restartGame(level)
{
	$("#level").html("Level " + (level+1));
	
	busGame.currentLevel = level;
	
	// �ı�Ϊ�ùؿ��ı���ͼƬ
	$('#game').removeClass().addClass('gamebg_level'+level);
	
	busGame.fragileGroundList = new Array();
	busGame.groundList = new Array();
	busGame.boxList = new Array();
	busGame.ballList = new Array();

    // ��������
	busGame.world = createWorld();
	
	// ����һ������
	// �������д���ʣ�����
	for(var i=0;i<busGame.levels[level].length;i++)
	{
		var obj = busGame.levels[level][i];
			
		
		// ������ʿ
		if (obj.type == "bus")
		{
			busGame.bus = createBusAt(obj.x,obj.y);
			busGame.fuel = obj.fuel;
			busGame.fuelMax = obj.fuel;
			$(".fuel-value").width('100%');
			continue;
		}
		
		// ��������
		if (obj.type == "box")
		{
			busGame.box = createBoxAt(obj.x,obj.y);
			busGame.boxList.push(busGame.box);
			continue;
		}
		
		// ��������
		if (obj.type == "ball")
		{
			busGame.ball = createBallAt(busGame.world,obj.x,obj.y);
			busGame.ballList.push(busGame.ball);
			continue;
		}
		
		var groundBody = createGround(obj.x, obj.y, obj.width, obj.height, obj.rotation, obj.type);

		
        //�ѵ���װ��һ������
		if (obj.type == "ground") 
		{
			busGame.groundList.push(groundBody);
		}

		
		if (obj.type == "win") 
		{
			busGame.gamewinWall = groundBody;
		}	
		
		//�ƻ�����ײ�������
		if (obj.type == "fragile") 
		{			
			busGame.groundList.push(groundBody);
			busGame.fragileGroundList.push(groundBody);			
		}
		
	}
	
		
		
	
}



function createWheel(world, x, y) 
{
	// ��̥Բ��
	var ballSd = new b2CircleDef();
	ballSd.density = 5.0;          //�����ܶ�
	ballSd.radius = 10;            //���Ӱ뾶
	ballSd.restitution = 0.2;      //���ӵ���
	ballSd.friction = 1.0;         //����Ħ��
	ballSd.userData = document.getElementById('wheel');
	
	//  ��̥����
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}


//�滭����
function drawWorld(world, context) 
{
	for (var b = world.m_bodyList; b != null; b = b.m_next) 
	{
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) 
		{
			if (s.GetUserData() != undefined)
			{
				// ʹ�����ݰ���ͼƬ
				var img = s.GetUserData();
				
				// ͼƬ�ĳ��Ϳ������
				var x = s.GetPosition().x;
				var y = s.GetPosition().y;
				var topleftX = - $(img).width()/2;
				var topleftY = - $(img).height()/2;
				
				context.save();
				context.translate(x,y);
				context.rotate(s.GetBody().GetRotation());
				context.drawImage(img, topleftX, topleftY);						
				context.restore();
			}
			//drawShape(s, context);
		}
	}
}

// ��draw_world.js�������õĻ滭����
function drawShape(shape, context) 
{
	context.strokeStyle = '#003300';
	context.beginPath();
	switch (shape.m_type) 
	{
	case b2Shape.e_circleShape:
		var circle = shape;
		var pos = circle.m_position;
		var r = circle.m_radius;
		var segments = 16.0;
		var theta = 0.0;
		var dtheta = 2.0 * Math.PI / segments;
		// ��ԲȦ
		context.moveTo(pos.x + r, pos.y);
		for (var i = 0; i < segments; i++) 
		{
			var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
			var v = b2Math.AddVV(pos, d);
			context.lineTo(v.x, v.y);
			theta += dtheta;
		}
		context.lineTo(pos.x + r, pos.y);

		// ���뾶
		context.moveTo(pos.x, pos.y);
		var ax = circle.m_R.col1;
		var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
		context.lineTo(pos2.x, pos2.y);
		break;
	case b2Shape.e_polyShape:
		var poly = shape;
		var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
		context.moveTo(tV.x, tV.y);
		for (var i = 0; i < poly.m_vertexCount; i++) 
		{
			var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
			context.lineTo(v.x, v.y);
		}
		context.lineTo(tV.x, tV.y);
		break;
	}
	context.stroke();
}

busGame.levels = new Array();

busGame.levels[0] = [{"type":"bus","x":50,"y":210,"fuel":200},
{"type":"ground","x":50, "y":270, "width":50, "height":10, "rotation":0},
{"type":"ground","x":120,"y":263,"width":30,"height":10,"rotation":-15},
{"type":"ground","x":220,"y":225,"width":80,"height":10,"rotation":-25},
{"type":"ground","x":400,"y":300,"width":80,"height":10,"rotation":15},
{"type":"ground","x":510,"y":315,"width":50,"height":10,"rotation":-10},
{"type":"ground","x":680,"y":330,"width":80,"height":10,"rotation":-20},
{"type":"ground","x":795,"y":300,"width":50,"height":10,"rotation":-10},
{"type":"ground","x":1000,"y":305,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1120,"y":280,"width":80,"height":10,"rotation":-20},
{"type":"win","x":1200,"y":225,"width":10,"height":15,"rotation":0}];

busGame.levels[1] = [{"type":"bus","x":50,"y":110,"fuel":200},
{"type":"ground","x":50, "y":170, "width":70, "height":10, "rotation":0},
{"type":"ground","x":205,"y":315,"width":40,"height":10,"rotation":15},
{"type":"ground","x":280,"y":315,"width":50,"height":10,"rotation":-15},
{"type":"fragile","x":400,"y":310,"width":50,"height":10,"rotation":5},
{"type":"ground","x":540,"y":315,"width":80,"height":10,"rotation":0},
{"type":"ground","x":680,"y":300,"width":50,"height":10,"rotation":0},
{"type":"fragile","x":800,"y":310,"width":50,"height":10,"rotation":0},
{"type":"ground","x":950,"y":325,"width":80,"height":10,"rotation":0},
{"type":"ground","x":1070,"y":310,"width":50,"height":10,"rotation":-20},
{"type":"ground","x":1155,"y":310,"width":50,"height":10,"rotation":20},
{"type":"win","x":1220,"y":305,"width":10,"height":15,"rotation":0}];

busGame.levels[2] = [{"type":"bus","x":50,"y":160,"fuel":200},
{"type":"ground","x":50, "y":220, "width":50, "height":10, "rotation":0},
{"type":"ground","x":130,"y":210,"width":30,"height":10,"rotation":-18},
{"type":"ground","x":180,"y":190,"width":30,"height":10,"rotation":-25},
{"type":"box","x":250,"y":10},
{"type":"box","x":300,"y":10},
{"type":"ground","x":380,"y":250,"width":50,"height":10,"rotation":15},
{"type":"ground","x":500,"y":250,"width":80,"height":10,"rotation":-10},
{"type":"box","x":600,"y":10},
{"type":"ground","x":700,"y":280,"width":50,"height":10,"rotation":-20},
{"type":"ground","x":790,"y":255,"width":50,"height":10,"rotation":-10},
{"type":"box","x":870,"y":10},
{"type":"box","x":920,"y":10},
{"type":"ground","x":1000,"y":300,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1120,"y":285,"width":50,"height":10,"rotation":10},
{"type":"ground","x":1210,"y":285,"width":50,"height":10,"rotation":-10},
{"type":"win","x":1270,"y":245,"width":10,"height":15,"rotation":0}];

busGame.levels[3] = [{"type":"bus","x":50,"y":410,"fuel":200},
{"type":"ground","x":40, "y":464, "width":30, "height":10, "rotation":10},
{"type":"ground","x":172,"y":470,"width":100,"height":10,"rotation":0},
{"type":"ball","x":160,"y":50},
{"type":"ball","x":190,"y":30},
{"type":"ground","x":320,"y":457,"width":50,"height":10,"rotation":-15},
{"type":"ground","x":460,"y":480,"width":50,"height":10,"rotation":10},
{"type":"ground","x":555,"y":488,"width":50,"height":10,"rotation":0},
{"type":"ball","x":530,"y":80},
{"type":"ground","x":640,"y":470,"width":50,"height":10,"rotation":-25},
{"type":"ground","x":730,"y":450,"width":50,"height":10,"rotation":0},
{"type":"ball","x":730,"y":10},
{"type":"ground","x":840,"y":420,"width":80,"height":10,"rotation":-25},
{"type":"ground","x":1000,"y":430,"width":50,"height":10,"rotation":0},
{"type":"ball","x":1030,"y":40},
{"type":"ground","x":1072,"y":444,"width":30,"height":10,"rotation":30},
{"type":"ground","x":1180,"y":459,"width":80,"height":10,"rotation":0},
{"type":"ball","x":1130,"y":60},
{"type":"win","x":1270,"y":430,"width":10,"height":15,"rotation":0}];

busGame.levels[4] = [{"type":"bus","x":50,"y":270,"fuel":200},
{"type":"ground","x":50, "y":320, "width":50, "height":10, "rotation":0},
{"type":"ground","x":170,"y":345,"width":50,"height":10,"rotation":5},
{"type":"box","x":270,"y":10},
{"type":"ground","x":360,"y":395,"width":50,"height":10,"rotation":15},
{"type":"fragile","x":460,"y":410,"width":50,"height":10,"rotation":0},
{"type":"ground","x":560,"y":385,"width":50,"height":10,"rotation":-30},
{"type":"ground","x":678,"y":362,"width":80,"height":10,"rotation":0},
{"type":"ball","x":720,"y":20},
{"type":"box","x":800,"y":10},
{"type":"fragile","x":900,"y":400,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1030,"y":372,"width":80,"height":10,"rotation":-20},
{"type":"ground","x":1133,"y":345,"width":30,"height":10,"rotation":0},
{"type":"ball","x":1130,"y":20},
{"type":"ground","x":1213,"y":327,"width":50,"height":10,"rotation":-20},
{"type":"win","x":1270,"y":285,"width":10,"height":15,"rotation":0}];
