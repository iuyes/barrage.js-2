$(document).ready(function(){
	/*******************************************数据结构*********************************************/
	//弹幕池
	/*弹幕池结构
	*struct
	*{
	*	'total':1,
	*	'vTime':{,
	    *	'total':1,
	    *	 1:{'content':'this is the content','time':'2015-02-16 20:00:00'}
	*	}
	*}
	**/
	//弹幕池的构造函数,b代表弹幕池数组
	function BarragePool(b){
		this.bp=b;
		this.bp['total']=0;
	}
	//增加弹幕
	//vTime为视频时间轴,一般为0.1,0.2,0.3....
	//content为弹幕内容
	//time为弹幕发送时间
	BarragePool.prototype.add=function(vTime,content,time){
		//判断时间轴vTime上是否有弹幕
		var isVTime=this.bp.hasOwnProperty(vTime);
		//如果vTime存在,则直接获得时间轴下的弹幕数量并往上加1,否则初始化时间轴数组并且设置total为1
		if(isVTime){
			//获得vTime时间轴下的弹幕数量
			var total=this.bp[vTime]['total'];
			this.bp[vTime]['total']+=+1;
			total+=1;
		}else{
			this.bp[vTime]={};
			this.bp[vTime]['total']=1;
			total=1;
		}
		//弹幕总数加1
		this.bp['total']+=1;
		//将弹幕加到bp数组中
		this.bp[vTime][total]={'content':content,'time':time};
	}
	//删除弹幕
	//如果index为空但vTime不为空则删除vTime下所有弹幕
	//如果index不为空且vTime不为空,则删除vTime下key为index的弹幕
	BarragePool.prototype.del=function(vTime,index){
		var indexB=index || null;
		//如果vTime为空,则返回,什么也不作
		if(vTime=='undefined')
		{return;}
		//如果没有vTime则返回
		var isVTime=this.bp.hasOwnProperty(vTime);
		if(!isVTime)
		{return;}
		//获得总弹幕数量,如果为0则返回什么都不做
		var totalBarrage=this.bp['total'];
		if(totalBarrage===0)
		{return;}
		//如果index为空
		if(indexB==null){
			//先获得vTime下的弹幕数量
			var totalVAmount=this.bp[vTime]['total'];
			this.bp[vTime]=[];
			//重置总弹幕数量为当前数量减去删除的弹幕数量->totalVAmount
			this.bp['total']-=totalVAmount;
		}else{
			//如果index不为空
			this.bp[vTime][index]=[];
			this.bp['total']-=1;
			this.bp[vTime]['total']-=1;
		}
	}
	//得到某时间轴的弹幕
	//vTime为视频时间轴,index为vTime下的弹幕索引
	//如果vTime为空则直接返回
	//如果index为空则返回vTime下所有弹幕,如果index不为空则返回vTime下第index个弹幕
	BarragePool.prototype.get=function(vTime,index){
		if(vTime==null)
		{return;}
		//如果没有vTime则返回
		var isVTime=this.bp.hasOwnProperty(vTime);
		if(!isVTime)
		{return;}
		//获得总弹幕数量,如果为0则返回什么都不做
		var totalBarrage=this.bp['total'];
		if(totalBarrage===0){return;}
		if(index==null){
			return this.bp[vTime];
		}else{
			//先获得vTime下弹幕总数量
			var vTimeTotal=this.bp[vTime]['total'];
			//如果index大于vTimeTotal或者小于0则直接返回
			if(index>vTimeTotal || index<0){return;}
			return this.bp[vTime][index];
		}
	}
	//JSON化
	BarragePool.prototype.toJSON=function(){
		return JSON.stringify(this.bp);
	}
	//格式化,主要是格式化为HTML(div)
	//class为div的类,,id为div的id,style为样式表
	//在正式使用时class,id不推荐为空
	//vTime不能为空,如果index为空则返回vTime下最后一条弹幕
	BarragePool.prototype.format=function(cls,id,style,vTime,index){
		if(vTime==null){return;}
		var INDEX;
		if(index==null){
			//如果index为空,则取vTime下最后一条弹幕(total)
			INDEX=this.bp[vTime]['total'];
		}else{
			INDEX=index;
		}
		var singleBarrage=this.get(vTime,INDEX);
		var html='<div ';
		html+='class="'+cls+'" id="'+id+'" style="'+style+'">';
		html+=singleBarrage['content'];
		html+="</div>";
		return html;
	}
	//获得弹幕总数
	//如果vTime为空,则返回全部弹幕数量,否则返回vTime下的弹幕数量
	BarragePool.prototype.getTotal=function(vTime){
		if(vTime==null){
			return this.bp['total'];
		}else{
			//如果没有vTime则返回
			var isVTime=this.bp.hasOwnProperty(vTime);
			if(!isVTime){return;}
			return this.bp[vTime]['total'];
		}
	}
	//遍历弹幕池
	BarragePool.prototype.each=function(){
	}
	/*var BP=new BarragePool(barragesPool);
	BP.add('0.1',"fuckbitch","2012");
	BP.add('0.1',"hhhhhhhhhhh","2013");
	BP.add('0.2','hahahahahahaha','2015');
	console.log(barragesPool['total']);
	console.log(barragesPool['0.1']['total']);
	console.log(barragesPool['0.1'][2]);
	console.log(barragesPool['0.2'][1]);
	/*BP.del('0.2');
	console.log('删除0.2之后:',barragesPool['0.2']);
	BP.del('0.1',2);
	console.log('删除0.1下的2之后:',barragesPool['0.1']['total']);
	console.log('当前的弹幕总数量为:',barragesPool['total']);*/
	/*console.log(BP.get('0.1',1));
	console.log(BP.toJSON());
	console.log(BP.format('barrage','hhh','','0.1',1));*/
	/*******************************************数据结构*********************************************/
	/*******************************************弹幕控制*********************************************/
	//弹幕控制类
	//liefcycle为弹幕的运行时间,默认为5500
	//dp为弹幕池对象
	//vc为视频容器id
	//dc为弹幕DIV的总类,用来控制总体的暂停或开始
	function barrageControl(dp,vc,dc,lifecycle){
		if(dp==null || vc==null || dc==null){return false;}//如果弹幕池对象为空,则直接返回false
		lifecycle=(lifecycle==null)?5500:lifecycle;
		var videoWidth=$('#'+vc).width();
		var videoHeight=$('#'+vc).height();
		videoWidth=(videoWidth==null)?680:videoWidth;
		videoHeight=(videoHeight==null)?520:videoHeight;
		this.totalDanmaku=0;//记录屏幕上的弹幕总数量
		this.collideCount=4;//记录碰撞次数
		this.danmakuHeight=25;//记录弹幕div的高度,默认为25
		//弹幕高度*碰撞次数等于弹幕纵坐标
		this.collideTop=$('#'+vc).offset().top.toFixed(0);//记录碰撞的TOP位置,刚开始未碰撞时为视频容器的TOP
		this.barrageLoaded=[];//记录现行载入的弹幕数据ID,堆
		this.prevBarrage=null;//记录上一条载入完毕的弹幕数据
		this.barrageDisplayed=null;//记录所有被载入的弹幕数据
		this.danmakulifecycle=lifecycle;//记录弹幕的生命周期,默认为5500
		this.currentBarrage=null;//记录现行弹幕的数据
		this.danmakuID=null;//记录当前弹幕的ID(HTML)
		this.prevDanmakuID=null;//记录上一条弹幕的ID(HTML)
		this.videoWidth=videoWidth;//记录视频控件的宽度(像素),默认为680
		this.videoHeight=videoHeight;//记录视频控件的高度,默认为520
		this.danmakuPool=dp;//记录弹幕池对象
		this.vcID=vc;//记录视频容器ID
		this.danmakuClass=dc;//记录弹幕DIV的总类
		
	}
	//每一条弹幕消失之后回调的函数
	//id为消失的弹幕DIV ID
	barrageControl.prototype.initDanmakuData=function(){
   		if(this.totalDanmaku>0){
   			this.totalDanmaku-=1;//屏幕上弹幕的数量减去1
   		}else{
   			this.totalDanmaku=0;//初始化屏幕上弹幕数量
   			this.prevDanmakuID=null;//置上一条弹幕ID为空
   			this.danmakuID=null;//置当前弹幕ID为空
   		}
	}
	//在视频上显示弹幕并让弹幕运动起来,不参与逻辑运算
	//id为弹幕的HTML id,startY是开始的纵坐标,endX是结束的橫坐标
	barrageControl.prototype.shiftDanmaku=function(startY,endX){
		var top=(startY==null)?'100':startY;
		$('#'+this.danmakuID).animate({
   			left:endX+'px',
   			top:top+'px'
   		},this.danmakulifecycle,function(){
   			$(this).hide();
   		});
   		this.barrageLoaded.pop();
	}
	//随机生成弹幕数据的HTML ID
	//cLength代表要生成的ID长度
	barrageControl.prototype.randomID=function(cLength){
		var length=cLength;
		var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ1234567890"; 
		var randomChars = ""; 
		for(x=0;x<length;x++){ 
			var i=Math.floor(Math.random()*chars.length); 
			randomChars += chars.charAt(i); 
		} 
		return 'd' + randomChars;
	}
	//获得结束X坐标
	barrageControl.prototype.getEndX=function(){
		//计算弹幕x轴
   		var itemLeft=$('#'+this.danmakuID).offset().left.toFixed(0);
   		//字符串的长度
   		var charWidth=$('#'+this.danmakuID).width();
   		//结束X坐标是弹幕X轴-视频宽度-字符串长度
   		var endPos=parseInt(itemLeft)-parseInt(this.videoWidth)-parseInt(charWidth);
   		return endPos;
	}
	//设置弹幕开始的X坐标
	//videoLeft为视频控件的left大小
	barrageControl.prototype.setStartX=function(videoLeft){
		var x=parseInt(this.videoWidth)+parseInt(videoLeft);
		$('#'+this.danmakuID).css('left',x+'px');
	}
	//设置弹幕开始运行的纵坐标
	barrageControl.prototype.setStartY=function(){
		$('#'+this.danmakuID).css('top',this.collideTop+'px');
	}
	//获取当前时间
	barrageControl.prototype.getCurrentTime=function(){
		var myDate = new Date();
		var month=myDate.getMonth()+1;//月份从0开始
		var date=myDate.getDate();
		var hours=myDate.getHours();
		var minutes=myDate.getMinutes();
		var seconds=myDate.getSeconds();
		//在日期时间前自动补0
		month=(month<10)?'0'+month:month;
		date=(date<10)?'0'+date:date;
		hours=(hours<10)?'0'+hours:hours;
		minutes=(minutes<10)?'0'+minutes:minutes;
		seconds=(seconds<10)?'0'+seconds:seconds;
		return myDate.getFullYear()+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
	}
	//获得当前弹幕左端碰到屏幕左边缘的时间
	//时间=路程(宽度-字符串长度[像素])/速度,速度=路程(宽度)/时间
	//最终公式:((视频宽度-字符串宽度)*弹幕运行时间)/视频宽度[宽度单位为像素]
	//duration为弹幕运行时间,默认为5500毫秒
	//ID为上一条弹幕的html ID,如果为空则表示当前弹幕ID.
	barrageControl.prototype.getCurrentDanmakuToLeftTime=function(duration,ID){
		ID=(ID==null)?this.danmakuID:ID;
		duration=(duration==null)?this.danmakulifecycle:duration;
		var charLength=$('#'+ID).width();
		return ((parseInt(this.videoWidth)-parseInt(charLength))*parseInt(duration))/parseInt(this.videoWidth);
	}
	//获得上一条弹幕的结束时间
	//参数duration表示弹幕运行时间,单位毫秒,默认值是5500
	//计算方法和获取当前弹幕运行时间一样,实际应用中duration应该小于<=默认的5500毫秒
	barrageControl.prototype.prevDanmakuEndTime=function(duration){
		return this.getCurrentDanmakuToLeftTime(duration,this.prevDanmakuID);
	}
	//用来更新弹幕加载后改变的数据,在shiftDanmaku方法之后必须使用这个方法
	//参数vct代表现行视频时间
	barrageControl.prototype.updateDanmakuData=function(vct){
		//视频上展示的弹幕数量加1
		this.totalDanmaku+=1;
		//更改现行弹幕的数据,包含vTime(VideoTime),以及vTime下弹幕的index
		//因为这是从用户输入处加载,所以他的index就是vTime下的总数
		this.currentBarrage={'vTime':vct,'index':this.danmakuPool.getTotal(vct)};
		//置上一条弹幕的数据
		this.prevDanmakuID=this.danmakuID;
		//将已经载入的弹幕IDpush进堆
		this.barrageLoaded.push(this.prevDanmakuID);
	}
	barrageControl.prototype.calculateOffset=function(){
	}
	//将弹幕数据push进视频区域
	//meth为加载方式,如果为input表示从用户输入加载,如果为data表示从已有数据加载.区别在于从用户加载时会在用户输入的数据周围加黑框.默认为从已有数据处加载.
	//danmakuData为弹幕的文本数据
	//vct为视频播放的现行时间
	//videoOnPlaying记录视频是否正在播放,弹幕只有在视频播放期间才可以运动
	//如果method为空或者为data,那么danmakuData表示vct下弹幕的index
	barrageControl.prototype.push=function(method,vct,danmakuData,videoOnPlaying){
		//初始化弹幕样式,即是否有黑框
		var style=(method==null || method=='data')?'':'border:1px solid rgb(255,255,255);padding:5px;';
		//获得随机的弹幕数据HTML ID
		this.danmakuID=this.randomID(16);
		//如果是从输入处加载则要先往弹幕池里添加数据然后再读出来.
		if(!(method==null || method=='data')){
			//往弹幕池里添加数据
			this.danmakuPool.add(vct,danmakuData,this.getCurrentTime());
			//将本条弹幕格式化为HTML文本
			var barrageHTML=BP.format(this.danmakuClass,this.danmakuID,style,vct);
		}else{
			//this.calculateOffset();
			//将本条弹幕格式化为HTML文本
			var barrageHTML=BP.format(this.danmakuClass,this.danmakuID,style,vct,danmakuData);
		}
		//append进弹幕显示区域
		$('#'+this.vcID).append(barrageHTML);
		//获得结束的X坐标
		var endX=this.getEndX();
		//设置开始的X坐标
		this.setStartX();
			
		//如果视频正在播放就开始计算弹幕位置并移动弹幕
		if(videoOnPlaying){
			//如果上一条弹幕为空,即当前弹幕槽为空则直接推送到视频控件并移动弹幕,否则要计算弹幕是否碰撞
			if(this.prevDanmakuID==null || this.totalDanmaku==0){
				this.setStartY();//设置弹幕开始的纵坐标
				//让弹幕开始运动
				this.shiftDanmaku(null,endX);
				//更新弹幕数据
				this.updateDanmakuData(vct);
			}else{
				//如果碰撞,则重新计算startY.否则直接推送
				if(this.prevDanmakuEndTime(3500)<=this.getCurrentDanmakuToLeftTime()){
					this.collideCount+=1;//碰撞次数往上加1
					this.collideTop=this.danmakuHeight*this.collideCount;//碰撞元素的top为25*collideCount,25是弹幕的高度,可以更改
					//如果collideTop超出容器界限,则重置为100,collideCount重置为4;
					if(this.collideTop>=this.videoHeight+50){
						this.collideTop=100;
						this.collideCount=4;
						//this.totalDanmaku=0;
					}else{
						//遍历barrageLoaded,看它们right到视频右边的距离是否>=当前弹幕的长度
						//如果大于等于则重置collideTop
						for(var i=0;i<this.barrageLoaded.length;i++){
							var danmakuLeft=$('#'+this.barrageLoaded[i]).offset().left;
							var danmakuWidth=$('#'+this.barrageLoaded[i]).width();
							//弹幕右边到视频右边的距离等于视频容器left+视频容器宽度-弹幕的left
							var videoLeft=$('#'+this.vcID).offset().left.toFixed(0);
							
							/*console.log('danmakuLeft',danmakuLeft);
							console.log('danmakuWidth',danmakuWidth);
							console.log('videoLeft',videoLeft);
							console.log('videoWidth',this.videoWidth);*/
							var danmakuRightToVideoBorderRight=parseInt(videoLeft)+parseInt(this.videoWidth)-parseInt(danmakuLeft);
							//如果正在运行的弹幕right到视频右边的距离>=当前弹幕的长度,重置collideTop
							if(danmakuRightToVideoBorderRight>=$('#'+this.danmakuID).width()){
								console.log(danmakuRightToVideoBorderRight,$('#'+this.danmakuID).width());
								this.collideTop=100*(i+1);
								this.collideCount=4;
								break;
								//this.totalDanmaku=0;
							}
						}
					}
					this.setStartY();//设置弹幕开始的纵坐标
					this.shiftDanmaku(this.collideTop,endX);//弹幕开始滚动
					this.updateDanmakuData(vct);//更新弹幕数据
				}else{
					this.setStartY();//设置弹幕开始的纵坐标
					this.shiftDanmaku(this.collideTop,endX);//让弹幕开始运动
					this.updateDanmakuData(vct);//更新弹幕数据
				}
			}
		}
	//记录弹幕HTML数据
	//var danmakuHTML=BP.format('barrage',idr,style,vct);
	}
	/*******************************************弹幕控制*********************************************/
	/********************************************函数库**********************************************/
	//获得弹幕输入框内容
	function getBarrageInput(){return $('.container-bottom input[type=text]').val();}
	//获得视频控件宽度
	function getVideoWidth(){return $('.container-left').width();}
	//获得视频控件left
	function getVideoLeft(){return $('.container-left').offset().left.toFixed(0);}
	//获得开始Y坐标
	//上一个弹幕的结束时间小于等于现在这个弹幕左端碰到屏幕左边缘的时间那么就不会碰撞
	function getStartY(previousID,currentID){
	}
	//在右侧列表中添加弹幕数据
	function appendDanmakuIntoList(vtime,content,time){
		$('.danmaku-table').append('<tr class="danmaku-line"><td class="danmaku-vtime">'+vtime+'</td><td class="danmaku-comment">'+content+'</td><td class="danmaku-time">'+time+'</td></tr>');
	}
	/********************************************函数库**********************************************/
	var media=document.getElementById("video-main");//获得播放器
	var duration=media.duration;//获得视频时长
	var startTime=media.startTime;//获得视频开始时间
	var videoCurrentTime;//视频当前时间
	var timeRemaining;//视频剩余时间
	var videoOnPlaying=false;//记录视频是否已经在播放
	/******************************初始化弹幕池及弹幕数据******************************/
	var barragesPool={};//弹幕池
	var BP=new BarragePool(barragesPool);//新建弹幕池对象
	//初始化弹幕池数据
	BP.add('0.3','初始化弹幕池及弹幕数据','2015');
	BP.add('0.6','初始化弹幕流动控制器','2015');
	BP.add('0.8','新建弹幕池对象','2015');
	BP.add('0.9','记录视频是否已经在播放','2015');
	console.log(videoCurrentTime);
	//console.log(BP.toJSON());
	/******************************初始化弹幕池及弹幕数据******************************/
	/*******************************初始化弹幕流动控制器*******************************/
	//初始化弹幕流动控制器类
	//弹幕池对象为BP,视频容器为danmaku-display,弹幕DIV总类为barrage
	var danmakuControl=new barrageControl(BP,'danmaku-display','barrage');
	/*******************************初始化弹幕流动控制器*******************************/
	//绑定发送弹幕按钮的点击事件
	$('.container-bottom input[type=button]').click(function(){
		//获得输入的弹幕数据
		var inputBarrage=getBarrageInput();
		//如果输入的弹幕不为空
		if(inputBarrage!=null){
			//在弹幕池里加入弹幕
			var vct=videoCurrentTime;//这个时间一直在变化,所以需要一个变量记录
			if(vct==null)
			{vct='0.0';}//如果现行时间为空(一般是用户在视频还没开始的时候发送的弹幕),则置现行时间为0.0(不置0.0显示的是undefined)
			var idr=danmakuControl.randomID(16);//记录自动生成的ID
			appendDanmakuIntoList(vct,inputBarrage,danmakuControl.getCurrentTime().split(' ')[1]);
			danmakuControl.push('input',vct,inputBarrage,videoOnPlaying);
		}
	});
	var eventListener=function(e){
		media.addEventListener(e,function(){
   			switch(e){
   				case 'play':
   					videoOnPlaying=true;
   					break;
   				case 'pause':
   					videoOnPlaying=false;
   					$(".barrage").stop();
   					break;
   				default:
   					break;
   			}
		});
	}
	eventListener('play');
	eventListener('pause');
	eventListener('ended');
	//监视现在播放进度和剩余时间
	media.addEventListener("timeupdate",function(){
		videoOnPlaying=true;
		var vTime=media.currentTime;//视频现在的时间轴
		videoCurrentTime=vTime.toFixed(1);//修正时间,精确到0.1即可
		timeRemaining=(duration-vTime).toFixed(1);//视频剩余时间
		//获得现行时间轴下弹幕的总数量
		var total=BP.getTotal(videoCurrentTime);
		var currentDanmakuData;//记录现行弹幕数据
		//根据时间轴下的弹幕数量进行循环显示
		for(var i=1;i<=total;i++){
			//获得现行时间轴下的弹幕数据
			currentDanmakuData=BP.get(videoCurrentTime,i);
			appendDanmakuIntoList(videoCurrentTime,currentDanmakuData['content'],BP.bp[videoCurrentTime][i]['time'].split(' ')[0]);
			danmakuControl.push('data',videoCurrentTime,i,videoOnPlaying);
		}
		
		//console.log(videoCurrentTime,timeRemaining);
	}, false);
	
});