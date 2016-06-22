/*�Ը�����в�������*/

function ControlBodyClass(slectBody,init){
	
	InitWorldClass.call(this);
	this.slectBody=slectBody;
	this.init=init;
	this.world=init.world;
}

ControlBodyClass.prototype=new InitWorldClass();

ControlBodyClass.prototype.GetOriginPosition=function(){
	
	var OriginPosition=new b2Vec2(); 
	OriginPosition=this.slectBody.GetOriginPosition();    //��ȡ��������ԭ�㣬���ڶԳ�ͼ�Σ�ԭ�㼴���ĵ�
	var position=new Array(OriginPosition.x,OriginPosition.y);
	return position;                                 //����һ�����������ݵ����飬�ֱ�Ϊԭ���x,y����
};

ControlBodyClass.prototype.SetCenterPosition=function(CenterX,CenterY,rotation){
	
	var position=new b2Vec2(CenterX,CenterY);       
	var rotation=rotation;
	this.slectBody.SetCenterPosition(position, rotation);   //���ø���λ�ü�����ת���ȣ�ע���ǻ���
};

ControlBodyClass.prototype.GetCenterPosition=function(){
	
	var CenterPosition=new b2Vec2(); 
	CenterPosition=this.slectBody.GetCenterPosition();    //��ȡ�������ĵ�����
	var center=new Array(CenterPosition.x,CenterPosition.y);
	return center;
};

ControlBodyClass.prototype.GetRotation=function(){
	
	
	Rotation=this.slectBody.GetRotation();    //��ȡ�����������ĵ���ת����
	return Rotation;
};

ControlBodyClass.prototype.SetLinearVelocity=function(Vx,Vy){
	
	var LinearVelocity=new b2Vec2(Vx,Vy);      
	this.slectBody.WakeUp();
	this.slectBody.SetLinearVelocity(LinearVelocity);      //����һ���ٶ�����
};

ControlBodyClass.prototype.GetLinearVelocity=function(){
	
	var LinearVelocity=new b2Vec2();                   
	LinearVelocity=this.slectBody.GetLinearVelocity();     //��ȡ�������ٶ�����
	var v=new Array(LinearVelocity.x,LinearVelocity.y);
	return v;
};

ControlBodyClass.prototype.SetAngularVelocity=function(w){
	
	this.slectBody.WakeUp();
	this.slectBody.SetAngularVelocity(w);     //����һ�����ٶ�
};

ControlBodyClass.prototype.GetAngularVelocity=function(){
	
	var AngularVelocity=this.slectBody.GetAngularVelocity();     //��ȡ���ٶ�
	return AngularVelocity;
};

ControlBodyClass.prototype.ApplyForce=function(Fx,Fy,PositionX,PositionY){
	
	var force=new b2Vec2(Fx,Fy);
	var point=new b2Vec2(PositionX,PositionY);
	this.slectBody.WakeUp();
	this.slectBody.ApplyForce(force,point);     //ʩ��һ����,��Ҫ�ܴ�������ã�����ֱ�Ӹ������ٶȣ�һ�������F=ma����
};

ControlBodyClass.prototype.ApplyTorque=function(torque){
	
	this.slectBody.WakeUp();
	this.slectBody.ApplyTorque(torque);     //��Ҫ�ܴ�������ã�������ٶ�����ʵ��
};

ControlBodyClass.prototype.ApplyImpulse=function(impulseX,impulseY,PositionX,PositionY){
	
	var impulse=new b2Vec2(impulseX,impulseY);
	var point=new b2Vec2(PositionX,PositionY);
	this.slectBody.WakeUp();
	this.slectBody.ApplyImpulse(impulse,point);     //ʩ������,һ���ڳ�ʼ��ʱ��������Ա������ʼ�˶�
};

ControlBodyClass.prototype.GetMass=function(){
	
	var mass=this.slectBody.GetMass();      //��ȡ��������
	return mass;
};

ControlBodyClass.prototype.GetInertia=function(){
	
	var inertia=this.slectBody.GetInertia();      //��ȡ���ԣ��������Ĵ�С
	return inertia;
};

ControlBodyClass.prototype.GetWorldPoint=function(localPointX,localPointY){
	
	var localPoint=new b2Vec2(localPointX,localPointY);
	var worldPoint=this.slectBody.GetWorldPoint(localPoint);              //�ɾֲ�����õ���������
	var point=new Array(worldPoint.x,worldPoint.y);    //��������=�ֲ�����+�������ĵ�����,������߹�ϵ
	return point;
};

ControlBodyClass.prototype.GetLocalVector=function(worldVectorX,worldVectorY){
	
	var worldVector=new b2Vec2(worldVectorX,worldVectorY);      //������߹�ϵ
	var localVector=slectBody.GetLocalVector(worldVector);
	var ve=new Array(localVector.x,localVector.y);
	return ve;
};

ControlBodyClass.prototype.IsStatic=function(){
	
	var staticFlage=this.slectBody.IsStatic();   //�ж��Ƿ�Ϊ��ֹ�����ƶ��ĸ���
	return staticFlage;
};

ControlBodyClass.prototype.IsSleeping=function(){
	
	var sleepingFlage=this.slectBody.IsSleeping();   //�ж��Ƿ��ѽ���˯��״̬
	return sleepingFlage;
};

ControlBodyClass.prototype.AllowSleeping=function(allowSleepingFlage){
	
	this.slectBody.AllowSleeping(allowSleepingFlage);   //�Ƿ�����˯�ߣ�����ɽ���˯��״̬����Ҫ���ѣ�allowSleepingFlageΪBOOL�ͱ���
};

ControlBodyClass.prototype.WakeUp=function(){
	
	this.slectBody.WakeUp();                //����˯�߸��壬���ڷǾ�ֹ���壬ֻ����ײ�����Զ����ѣ����丳���ٶȡ�����ֵʱ����Ҫ���л��Ѳ���Ч��
};

ControlBodyClass.prototype.GetShapeList=function(){
	
	var shapeList=this.slectBody.GetShapeList();    //ֱ����m_shapeListЧ��һ��,�б�����һ������shape��shape��һ���࣬�������״���͵�����Ϊshape.m_type
	return shapeList;
};

ControlBodyClass.prototype.Destroy=function(){
	
	this.slectBody.Destroy();                    //�����������ٸø��壬�����ٹؽ��еĸ���ʱ������bug
};

ControlBodyClass.prototype.DestroyBody=function(){
	
	this.world.DestroyBody(this.slectBody);
};

ControlBodyClass.prototype.GetNext=function(){
	
	this.slectBody.GetNext();              //��ȡ��һ���壬��world����崢����m_BodyList��
};

ControlBodyClass.prototype.IsConnected=function(otherBody){
	
	var otherBody=otherBody;
	var conectJuge=this.slectBody.IsConnected(otherBody);     //�ж��Ƿ�����һ������������������ײ�����߼�
	return conectJuge;
};

ControlBodyClass.prototype.Freeze=function(){
	
	this.slectBody.Freeze();                 //��������ٶȡ����ٶȶ�Ϊ0���Ը�����������״����s.DestroyProxy()
};

