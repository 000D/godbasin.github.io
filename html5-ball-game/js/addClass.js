/*����������*/
function AddClass(world){

	//InitWorldClass.call(this);
	this.customBodyList=new Array();
	this.world=world;
	
}

//AddClass.prototype=new InitWorldClass();

AddClass.prototype.createBox=function(width ,height,density,restitution,friction){
	
	this.Shape= new b2BoxDef();        
    this.Shape.extents.Set(width/2, height/2);         //������θߡ���
    this.Shape.density =density;                //�ܶ�
    this.Shape.restitution =restitution;           //����
    this.Shape.friction =friction;              //Ħ����
	
	return this.Shape;                    
};

AddClass.prototype.createCircle=function(radius,density,restitution,friction){
	
	this.Shape= new b2CircleDef();        
    this.Shape.radius =radius;                  //Բ�ΰ뾶
    this.Shape.density =density;                //�ܶ�
    this.Shape.restitution =restitution;           //����
    this.Shape.friction =friction;              //Ħ����
	
	return this.Shape;
};

AddClass.prototype.createPoly=function(vertexArray,density,restitution,friction){
	
	this.Shape= new b2PolyDef(); 
	this.vertexArray=vertexArray;                //������,Ҫ��vertexArray[0]Ϊ������Ŀ�����������δ洢��һ��X����һ��Y���ڶ���X���ڶ���Y......
    this.Shape.vertexCount = vertexArray[0];                    
	for(var i=0;i<this.Shape.vertexCount;i++)
	{
		this.Shape.vertices[i] = new b2Vec2(vertexArray[2*i+1],vertexArray[2*i+2]);     //����1
	}
	this.Shape.density =density;                //�ܶ�
    this.Shape.restitution =restitution;           //����
    this.Shape.friction =friction;              //Ħ����
	
	return this.Shape;
};

AddClass.prototype.createBody=function(shapeNumber,shapeArray,shapeLocationArray,bodyPositionX,bodyPositionY){
	
	this.BodyDef = new b2BodyDef();
    this.BodyDef.position.Set(bodyPositionX,bodyPositionY);    //��������ĳ�ʼλ��         BodyDefTop.position.Set(600, 0);    //��������ĳ�ʼλ��
	
	this.shapeArray=shapeArray;
	this.shapeLocationArray=shapeLocationArray;
	if(this.shapeLocationArray!=null)
	{
		var l=shapeLocationArray.length;
		for(var j=0;j<l;j+=3)
		{
			this.shapeArray[shapeLocationArray[j]].localPosition.Set(shapeLocationArray[j+1],shapeLocationArray[j+2]);
		}
	}
	
	for(var i=0;i<shapeNumber;i++)
	{
	   this.BodyDef.AddShape(this.shapeArray[i]);          //�����м���Shape[i]
	}
	this.Body = this.world.CreateBody(this.BodyDef); 
	
	return this.Body ;
};

AddClass.prototype.createDistanceJoint=function(Body1,Body2,anchorPoint1,anchorPoint2){
	
   this.jointDefDistance = new b2DistanceJointDef();
   this.jointDefDistance.body1 = Body1;
   this.jointDefDistance.body2 = Body2;
   this.jointDefDistance.anchorPoint1=anchorPoint1;      //anchorPoint1��anchorPoint2������Body1��Body2��
   this.jointDefDistance.anchorPoint2=anchorPoint2;
   
   this.joint=this.world.CreateJoint(this.jointDefDistance);
   
   return this.joint;
};

AddClass.prototype.createRevoluteJoint=function(Body1,Body2,anchorPoint,motorSpeed,motorTorque,enableMotor,lowerAngle,upperAngle,enableLimit){
	
   this.jointDefRevolute = new b2RevoluteJointDef();
   this.jointDefRevolute.anchorPoint=anchorPoint; 
   this.jointDefRevolute.body1 = Body1;
   this.jointDefRevolute.body2 = Body2;
   this.jointDefRevolute.lowerAngle=lowerAngle;
   this.jointDefRevolute.upperAngle=upperAngle;
   this.jointDefRevolute.enableLimit=enableLimit;
   this.jointDefRevolute.motorSpeed =motorSpeed;     //�ٶ�
   this.jointDefRevolute.motorTorque =motorTorque;      //����
   this.jointDefRevolute.enableMotor =enableMotor;
   
   this.joint= this.world.CreateJoint(this.jointDefRevolute); 
   
   return this.joint;
};

AddClass.prototype.createPrismaticJoint=function(Body1,Body2,anchorPoint,axis){
	
   this.jointDefPrismatic = new b2PrismaticJointDef();
   this.jointDefPrismatic.anchorPoin=anchorPoint;            //��ѡ�ڶ������ĵ����ߵ��е�
   this.jointDefPrismatic.axis=axis;         //�����������˶������ش��ᣬ�����˶��ް�
   this.jointDefPrismatic.body1 = Body1;
   this.jointDefPrismatic.body2 = Body2;
   
   this.joint= this.world.CreateJoint(this.jointDefPrismatic); 
   
   return this.joint;
};

AddClass.prototype.createPulleyJoint=function(Body1,Body2,anchorPoint1,anchorPoint2,groundPoint1,groundPoint2,maxLength1,maxLength2,ratio){
	
   this.jointDefPulley = new  b2PulleyJointDef();
   this.jointDefPulley.body1 = Body1;
   this.jointDefPulley.body2 = Body2;
   this.jointDefPulley.anchorPoint1=anchorPoint1;
   this.jointDefPulley.anchorPoint2=anchorPoint2;
   this.jointDefPulley.groundPoint1=groundPoint1;
   this.jointDefPulley.groundPoint2=groundPoint2;
   this.jointDefPulley.maxLength1=maxLength1;         //������maxLength������һ��Ҫ����|groundPoint-anchorPoint|
   this.jointDefPulley.maxLength2=maxLength2;
   this.jointDefPulley.ratio=ratio;                //body1�����ƶ�S��body2�����ƶ�S/ratio
   
   this.joint= this.world.CreateJoint(this.jointDefPulley);
   
   return this.joint;
};

AddClass.prototype.createGearJoint=function(RevoluteBody,PrismaticBody,RevoluteAnchorPoint,PrismaticAnchorPoint,PrismaticAxis,ratio,motorSpeed,motorTorque,enableMotor){
	
   this.jointDefRevolute = new b2RevoluteJointDef();
   this.jointDefRevolute.anchorPoint=RevoluteAnchorPoint;
   this.jointDefRevolute.body1 =this.world.GetGroundBody();     //�������ֹؽڵ���ת�ؽ�body1��ΪGroundBody
   this.jointDefRevolute.body2 =RevoluteBody;
   //this.jointDefRevolute.lowerAngle=lowerAngle;
   //this.jointDefRevolute.upperAngle=upperAngle;
   //this.jointDefRevolute.enableLimit=enableLimit;
   this.jointDefRevolute.motorSpeed =motorSpeed;     //�ٶ�
   this.jointDefRevolute.motorTorque =motorTorque;      //����
   this.jointDefRevolute.enableMotor =enableMotor;
   
   this.jointRevolute= this.world.CreateJoint(this.jointDefRevolute);
   
   this.jointDefPrismatic = new b2PrismaticJointDef();
   this.jointDefPrismatic.anchorPoint=PrismaticAnchorPoint;           //��ѡ�ڶ������ĵ����ߵ��е�
   this.jointDefPrismatic.axis=PrismaticAxis;         //�ڳ��ֹؽ��У������ֻҪ���ó�ƽ������Ļ���У�Ҳ����˵���ų�����ת���ƶ��ؽڿ������¡����������˶�����б���˶�����bug��
   this.jointDefPrismatic.body1 =this.world.GetGroundBody();           //�������ֹؽڵ��ƶ��ؽ�body1��ΪGroundBody
   this.jointDefPrismatic.body2 =PrismaticBody;
   this.jointPrismatic= this.world.CreateJoint(this.jointDefPrismatic); 
  
   this.jointDefGear = new b2GearJointDef();
   this.jointDefGear.body1=RevoluteBody;
   this.jointDefGear.body2=PrismaticBody;
   this.jointDefGear.joint1=this.jointRevolute;
   this.jointDefGear.joint2=this.jointPrismatic;
   
   this.joint= this.world.CreateJoint(this.jointDefGear); 
   
   this.joint.m_ratio=ratio;                           //  ת��Ȧ��/�ƶ�����
   return this.joint;
};



