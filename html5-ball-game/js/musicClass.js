/*һ�����ֲ��ſ��Ƶ��࣬��Ҫ����new��һ�����󣬱�֤�����ֲ���֮ǰ���������Ѿ�������ϣ����ڽ����ö���ʱ������Ŀ�����٣����ü���*/

function MusicClass(musicInfList){
     this.musicInfList=musicInfList;      
	 this.inputMusic();
}

MusicClass.prototype.inputMusic=function(){
     var l=this.musicInfList.length;
	 for(var i=0;i<l;i+=4)
	 {
        document.write("<audio id="+this.musicInfList[i+1]+" loop='loop' > ");
		document.write("<source src="+this.musicInfList[i+2]+" type='audio/mpeg'>");
		document.write("<source src="+this.musicInfList[i+3]+" type='audio/ogg'>");
		document.write("</audio>");
	 }
};

MusicClass.prototype.play=function(musicName,currentTime,volume){
     var l=this.musicInfList.length;
	 
	 for(var i=0;i<l;i++)
	 {
	    if(musicName==this.musicInfList[i]);
		{
		   var slectMusic=document.getElementById(this.musicInfList[i+1]);
		   slectMusic.currentTime=currentTime;     //��ʱ�����0���Ա����²���
		   slectMusic.volume =volume;       //�������ڣ����Ϊ1
		   slectMusic.play();
		 
		}//if name
	 }//for i
};

MusicClass.prototype.pause=function(musicName){
     var l=this.musicInfList.length;
	 for(var i=0;i<l;i++)
	 {
	    if(musicName==this.musicInfList[i]);
		{
		   this.presentMusic=document.getElementById(this.musicInfList[i+1]);
		   this.presentMusicmusic.pause();
		}
	 }
};
