/*�����ʼ������*/

function InitWorldClass(canvasWidth,canvasHeight,world_left,world_top,world_right,world_bottom,gravity_x,gravity_y,doSleep){
	this.worldAABB;
	this.world;
	this.canvas=document.getElementById('canvas_main');
	this.context=this.canvas.getContext('2d');	
	this.canvasWidth=canvasWidth;
	this.canvasHeight=canvasHeight;
	this.world_left=world_left;              //���Ͻ�X����
	this.world_top=world_top;                 //���Ͻ�Y����
	this.world_right=world_right;              //���½�X����
	this.world_bottom =world_bottom;           //���½�Y����
	this.gravity= new b2Vec2(gravity_x,gravity_y);
	this.doSleep=doSleep;                       //bool��  
	this.dt=1/60;                              //���������֮�������
	this.iterations = 10;                       //����������Ӱ��������ײ�ļ��㾫�ȣ�̫�߻ᵼ���ٶȹ���
	
	this.setupWorld();
	
}

InitWorldClass.prototype.setupWorld=function(){
   this.worldAABB = new b2AABB();
   this.worldAABB.minVertex.Set(this.world_left,this.world_top);  //���Ͻ�
   this.worldAABB.maxVertex.Set(this.world_right,this.world_bottom);    //���½�
   this.world = new b2World(this.worldAABB, this.gravity, this.doSleep);
};

