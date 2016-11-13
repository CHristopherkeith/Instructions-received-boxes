window.onload=function(){

/************迷宫寻路ASTAR算法，附件有详细资料******************/
	MOVETO=function(instruction_){
/*******************获取当前目标周围四个方向格子**************/
		getRound=function(curr_){

			var getRound_=[];
			var up=parseInt(curr_.id)-10;
			var upNode=document.getElementById(up);
			var down=parseInt(curr_.id)+10;
			var downNode=document.getElementById(down);
			var left=parseInt(curr_.id)-1;
			var leftNode=document.getElementById(left);
			var right=parseInt(curr_.id)+1;
			var rightNode=document.getElementById(right);
			if(up>=0){
				getRound_.push(upNode);
			}
			if(down<=99){
				getRound_.push(downNode);
			}
			if(parseInt(curr_.id)%10!=0){
				getRound_.push(leftNode);
			}
			if(parseInt(curr_.id)%10!=9){
				getRound_.push(rightNode);
			}

			return getRound_;
		}

		function sortNumber(a, b){
			return a.F - b.F
		}

/*******************判断是否在OPEN集合**************/
		ifInOpen=function(node_){
			for(var i=0;i<open.length;i++){
				if(open[i]==node_){
					return true;
					break;
				}
			}
			return false;
		}
/*******************判断是否在CLOSE集合**************/
		ifInClose=function(node_){
			for(var i=0;i<close.length;i++){
				if(close[i]==node_){
					return true;
					break;
				}
			}
			return false;
		}
/*******************计算G,H,L值**************/
		calPathLength=function(node_,curr_){
			var hDistance=Math.abs(parseInt(endId)-parseInt(node_.id));
			node_.G=curr_.G+1;
			node_.H=Math.floor(hDistance/10)+Math.abs(parseInt(endId)%10-parseInt(node_.id)%10);
			node_.F=node_.G+node_.H;
		}

		var open=[],close=[],path=[],round=[],storePath=[],storeMark=[],STAR,END,curr;
		STAR=document.getElementById("father").parentNode;
		starId=STAR.id;

		var endId=(parseInt(instruction_.match(/\d+/g)[0])-1).toString();
		END=document.getElementById(endId);

		var pathTarget=document.getElementsByClassName("path");
		var markTarget=document.getElementsByClassName("mark");

		for(var i=0;i<pathTarget.length;i++){
			storePath[i]=pathTarget[i];
		}
		for(var i=0;i<storePath.length;i++){
			storePath[i].className="chessblock";
		}
		for(var i=0;i<markTarget.length;i++){
			storeMark[i]=markTarget[i];
		}
		for(var i=0;i<storeMark.length;i++){
			storeMark[i].className="chessblock";
		}

		if(END==null||END.innerHTML!=""){
			clearInterval(timeFlag);
			timeFlag=0;
			alert("终点位置不可用，请重新确认");
			return 0;
		}



		STAR.G=0;
		STAR.H=0;
		STAR.F=0;
		curr=STAR;
		open.push(curr);

		outermost:
		while(open.length){

			round=getRound(curr);
			for(var i=0;i<round.length;i++){

				if(!ifInOpen(round[i])&&!ifInClose(round[i])&&!round[i].ifwall){
					round[i].parent=curr;
					calPathLength(round[i],curr);
					open.push(round[i]);
					round[i].className="mark";
					if(round[i]==END){
						break outermost;
					}
					
				}
				
				if(ifInOpen(round[i])&&round[i]!=curr){
					if((curr.G+1)<round[i].G){
						round[i].parent=curr;
						round[i].G=curr.G+1;
						round[i].F=round[i].G+round[i].H;
					}				
				}
				
			}

			close.push(curr);
			open.shift();
			open.sort(sortNumber);

			curr=open[0];


		}

		if(!open.length){
			alert("没有可行路径");
		}
		else{
/*******************绘制路径**********************/
			while(curr!=STAR){
				curr.className="path";
				curr=curr.parent;
			}

			END.innerHTML=STAR.innerHTML;
			STAR.innerHTML="";
			
		}
	}

	movedBlock=function(){

		var instruction_;
		//处理各种指令
		this.GO=function(instruction_){
			if(instruction_.match(/^TRA|^MOV/g)){
				switch(instruction_.match(/^TRA|^MOV/g)[0]){
					case "TRA":
					switch(instruction_){
						case "TRALEF":
						TRA(1,"tralef");
						break;
						case "TRARIG":
						TRA(-1,"trarig");
						break;
						case "TRATOP":
						TRA(10,"tratop");
						break;
						case "TRABOT":
						TRA(-10,"trabot");
						break;
						default:alert("输入指令有误，请重新输入");
					}
					break;

					case "MOV":
					switch(instruction_){
						case "MOVLEF":
						MOV(1,"movlef",-90);
						break;
						case "MOVRIG":
						MOV(-1,"movrig",90);
						break;
						case "MOVTOP":
						MOV(10,"movtop",0);
						break;
						case "MOVBOT":
						MOV(-10,"movbot",180);
						break;
						default:
						MOVETO(instruction_);
					}
					break;
					default:
					alert("输入指令有误，请重新输入");
				}
			}
			else{
				if(instruction_.match(/^(BUILD)$|^BRU(\#[\0-\9\A-\F]{6})$/g)){
					if(instruction_.match(/^(BUILD)$|^BRU(\#[\0-\9\A-\F]{6})$/g)=="BUILD"){
						var girlTarget=document.getElementById("father");
						var girlAngle=girlTarget.style.WebkitTransform;
						var girlAngleValue=parseInt(girlAngle.match(/\-?\d+/g));
						switch(Math.abs(girlAngleValue)%360){
							case 0:

								BUILD(girlTarget,10);
							break;
							case 90:
								if(girlAngleValue<0){
									BUILD(girlTarget,1);
								}
								else{
									BUILD(girlTarget,-1);
								}
							break;
							case 180:
								BUILD(girlTarget,-10);
							break;
							case 270:
								if(girlAngleValue<0){
									BUILD(girlTarget,-1);
								}
								else{
									BUILD(girlTarget,1);
								}
							break;
						}
					}
					else{
						var bruColor=instruction_.match(/\#[\0-\9\A-\F]{6}/g)[0];
						var girlTarget=document.getElementById("father");
						var girlAngle=girlTarget.style.WebkitTransform;
						var girlAngleValue=parseInt(girlAngle.match(/\-?\d+/g));
						switch(Math.abs(girlAngleValue)%360){
							case 0:

								BRU(girlTarget,10,bruColor);
							break;
							case 90:
								if(girlAngleValue<0){
									BRU(girlTarget,1,bruColor);
								}
								else{
									BRU(girlTarget,-1,bruColor);
								}
							break;
							case 180:
								BRU(girlTarget,-10,bruColor);
							break;
							case 270:
								if(girlAngleValue<0){
									BRU(girlTarget,-1,bruColor);
								}
								else{
									BRU(girlTarget,1,bruColor);
								}
							break;
						}
					}
				}
				else{
					alert("输入指令有误，请重新输入");
				}
			}
		}
		//造墙
		BUILD=function(girlTarget_,step_){
			if(ifOut(girlTarget_,step_)!="out"){
				var wallTarget=document.getElementById((parseInt(girlTarget_.parentNode.id)-step_).toString());
				if(wallTarget.innerHTML==""){
					wallTarget.ifwall=true;
					wallCnt++;
					wallTarget.innerHTML=wallString;
					var innerDiv=wallTarget.getElementsByTagName("div")[0];
					innerDiv.className="build";
					innerDiv.addEventListener("webkitAnimationEnd", function(){
						this.className = "buildwall";
						}
					)
				}
				else{
					clearInterval(timeFlag);
					timeFlag=0;
					console.log("已存在墙，无法修建");
					alert("指令发生错误，已停止执行，详见console日志");
				}
			}
			else{
				clearInterval(timeFlag);
				timeFlag=0;
				console.log("无法在地图外修建墙体");
				alert("指令发生错误，已停止执行，详见console日志");
			}
		}
		//粉刷
		BRU=function(girlTarget_,step_,bruColor){
			var wallTarget=document.getElementById((parseInt(girlTarget_.parentNode.id)-step_).toString());
			var innerDiv=wallTarget.getElementsByTagName("div")[0];
			if(innerDiv){
				innerDiv.className="bruwall";
				innerDiv.style.cssText="background-color:"+bruColor;
			}
			else{
				clearInterval(timeFlag);
				timeFlag=0;
				console.log("不存在墙，无法粉刷");
				alert("指令发生错误，已停止执行，详见console日志");
			}
		}
		//平移
		TRA=function(step_,keyname_){

			var girlTarget=document.getElementById("father");
			var nextBlock;
			if(ifOut(girlTarget,step_)!="out"&&girlTarget.className==""){
				nextBlock=document.getElementById((parseInt(girlTarget.parentNode.id)-step_).toString()).innerHTML;
				if(!nextBlock){
						girlTarget.className=keyname_;//完成动画效果
						girlTarget.addEventListener("webkitAnimationEnd", function(){
						this.className = "";//动画完成后子元素与父元素处于错位状态，使其还原
						goStep(girlTarget,step_);//父子元素一同瞬间移动至动画完成位置
						})//监听完成动画后的行为
				}

				else{
					clearInterval(timeFlag);
					timeFlag=0;
					alert("行走路线被墙阻挡，已停止");
				}

			}
			else{
				if(ifOut(girlTarget,step_)=="out"){
					clearInterval(timeFlag);
					timeFlag=0;
					alert("行走至边界，已停止");
				}
			}


		}
		//旋转移动
		MOV=function(step_,keyname_,degree_){

			var girlTarget=document.getElementById("father");
			var nextBlock;
			if(ifOut(girlTarget,step_)!="out"&&girlTarget.className==""){
					nextBlock=document.getElementById((parseInt(girlTarget.parentNode.id)-step_).toString()).innerHTML;
					if(!nextBlock){
						girlTarget.className=keyname_;//完成动画效果
						//console.log("111111");
						girlTarget.addEventListener("webkitAnimationEnd", function(){
						this.className = "";//动画完成后子元素与父元素处于错位状态，使其还原
						this.style.WebkitTransform="rotate("+degree_+"deg)";//还原状态后角度变回原来的样子需要调整为动画之后的角度
						goStep(girlTarget,step_);//父子元素一同瞬间移动至动画完成位置
						})//监听完成动画后的行为
					}

					else{
						clearInterval(timeFlag);
						timeFlag=0;
						alert("行走路线被墙阻挡，已停止");
					}
			}
			else{
				if(ifOut(girlTarget,step_)=="out"){
					clearInterval(timeFlag);
					timeFlag=0;
					alert("行走至边界，已停止");
				}
			}

			
		}

		function goStep(target_,step_){

			document.getElementById((parseInt(target_.parentNode.id)-step_).toString()).innerHTML=target_.parentNode.innerHTML;
			target_.parentNode.innerHTML="";

		}

		//判断是否出界
		function ifOut(target_,step_){
			switch(step_){
				case 1:
					if(parseInt(target_.parentNode.id)%10==0){
						return "out";
					}
					else{
						return "in";
					}
				break;
				case -1:
					if(parseInt(target_.parentNode.id)%10==9){
						return "out";
					}
					else{
						return "in";
					}
				break;
				case -10:
					if(parseInt(parseInt(target_.parentNode.id)/90)!=0){
						return "out";
					}
					else{
						return "in";
					}
				break;
				case 10:
					if(parseInt(parseInt(target_.parentNode.id)/10)==0){
						return "out";
					}
					else{
						return "in";
					}

				break;
			}
		}
	}//movedBlock end

	//同步渲染代码框左边行数
	function rederColnum(code_){
		ifCodeValid=0;
		allCode=[];
		var codeLgh=code_.length;
		var matchArray=[];
		colnumTarget.innerHTML="";
		for(var i=0;i<code_.length;i++){
			matchArray=(/^(^[A-Z]{6})([1-9]+[0-9]*)$|^BUILD$|^(BRU)(\#[\0-\9\A-\F]{6})$/g).exec(code_[i]);
			if(matchArray&&(instrContent[matchArray[1]]=="ok"||instrContent[matchArray[0]]=="ok"||instrContent[matchArray[3]]=="ok")){
				colnumTarget.innerHTML+="<p>"+(i+1).toString()+"</p>";
				if(matchArray[1]=="MOVETO"){
					allCode.push(matchArray[0]);
				}
				else{
					if(matchArray[2]){
						for(var p=1;p<=parseInt(matchArray[2]);p++){
							allCode.push(matchArray[1]);
						}
					}
					else{
						allCode.push(matchArray[0]);
					}
				}

			}
			else{
				colnumTarget.innerHTML+="<p class='invalid'>"+(i+1).toString()+"</p>";
				ifCodeValid=1;
			}
		}
		colnumTarget.scrollTop=inputTarget.scrollTop;
	}

	//获取代码框代码
	function verifyCode(){
		codeline++;
		code=inputTarget.value.split(/\n/g);
		rederColnum(code);

	}
	//使用键盘操作
	function pressKey(event,amovedBlock){
		var eventTarget=event.srcElement ? event.srcElement :event.target;
		var eventKeycode=event.keycode ? event.keycode :event.which;
		if(eventTarget.id!="instrinput"){
			switch(eventKeycode){
				case 37://movleft
					amovedBlock.GO("MOVLEF");
				break;
				case 38://movup
					amovedBlock.GO("MOVTOP");
				break;
				case 39://movright
					amovedBlock.GO("MOVRIG");
				break;
				case 40://movdown
					amovedBlock.GO("MOVBOT");
				break;
				case 65://goleft
					amovedBlock.GO("TRALEF");
				break;
				case 87://movup
					amovedBlock.GO("TRATOP");
				break;
				case 68://movright
					amovedBlock.GO("TRARIG");
				break;
				case 83://movdown
					amovedBlock.GO("TRABOT");
				break;
			}
		}
	}

	function showDetl(){
		detailTgt.style.display="none";
		showdetailTgt.style.display="inline";
	}

	function noShowDetl(){
		showdetailTgt.style.display="none";
		detailTgt.style.display="inline";
	}
	//提交代码行为
	movedBlockAction=function(amovedBlock_){
		amovedBlock_.GO(allCode[countPathStep]);
		countPathStep++;
		if(countPathStep==allCode.length){
			clearInterval(timeFlag);
			timeFlag=0;
		}
	}
	//初始化地图
	createChessBlock=function(){

		for(var i=0;i<100;i++){
			var divEle=document.createElement("div");
			divEle.className="chessblock";
			divEle.id=i.toString();
			divEle.ifwall=false;
			cesbrdTarget.appendChild(divEle);
		}

		var idValue=Math.round(Math.random()*100);
		while(idValue==100){
			idValue=Math.round(Math.random()*100);
		}
		var randomTarget=document.getElementById(idValue.toString());

		randomTarget.innerHTML=littleGirlString;

	}
	//Wall按钮随机造墙
	creatRadomWall=function(){
		var idValue=Math.round(Math.random()*100);
		while(idValue==100||document.getElementById(idValue.toString()).innerHTML!=""){
			idValue=Math.round(Math.random()*100);
		}
		var randomWallTarget=document.getElementById(idValue.toString());
			randomWallTarget.ifwall=true;
			randomWallTarget.innerHTML=wallString;
			randomWallTarget.getElementsByTagName("div")[0].className="buildwall";
			wallCnt++;
	}

	
	var showdetailTgt=document.getElementsByClassName("showdetail")[0];
	var detailTgt=document.getElementsByClassName("detail")[0];
	var cesbrdTarget=document.getElementsByClassName("chessboard")[0];
	var littleGirlString="<div id='father' style='-webkit-transform:rotate(0deg)'><div id='littlegirl'></div></div>"
	var wallString="<div></div>"

	var submitTarget=document.getElementById("instrsubmit");
	var inputTarget=document.getElementById("instrinput");
	var refreshTarget=document.getElementById("inrefresh");
	var drawTarget=document.getElementById("indrawpic");
	var buildWallTarget=document.getElementById("inbuildwall");

	createChessBlock();
	
	var girlTarget=document.getElementById("father");

	var colnumTarget=document.getElementById("colnum");

	var codeline=1;

	var code=[];

	var instrContent={
		TRALEF:"ok",TRARIG:"ok",TRATOP:"ok",TRABOT:"ok",MOVLEF:"ok",MOVRIG:"ok",MOVTOP:"ok",MOVBOT:"ok",BUILD:"ok",BRU:"ok","MOVETO":"ok",
	}

	var timeFlag=0,countPathStep=0,ifCodeValid=0,wallCnt=0;

	var allCode=[];

	function init(){

		showdetailTgt.style.display="none";
		
		var amovedBlock=new movedBlock();

		inputTarget.focus();
		
		inputTarget.oninput=function(){
			verifyCode();
		};

		inputTarget.onscroll=function(){
			colnumTarget.scrollTop=inputTarget.scrollTop;
		};

		colnumTarget.onscroll=function(){
			colnumTarget.scrollTop=inputTarget.scrollTop;
		}

		submitTarget.onclick=function(){
			if(ifCodeValid==0&&inputTarget.value){
				if(timeFlag==0){
					countPathStep=0;
					timeFlag=setInterval(function(){movedBlockAction(amovedBlock)},550);
				}
				else{
					alert("正在执行路径计算中，请勿重复提交");
				}
			}
			else{
				if(ifCodeValid==1){
					alert("代码有误，请重新修改");
				}
				else{
					if(!inputTarget.value){
						alert("执行代码为空，请输入代码");
					}
				}
			}
		}

		refreshTarget.onclick=function(){
			clearInterval(timeFlag);
			timeFlag=0;
			inputTarget.value="";
			colnumTarget.innerHTML="<p>1</p>";
			inputTarget.focus();
		}

		drawTarget.onclick=function(){
			document.getElementById("father").parentNode.innerHTML="";
			document.getElementById(0).innerHTML=littleGirlString;
		}

		buildWallTarget.onclick=function(){
			if(wallCnt!=99){
				creatRadomWall();
			}
			else{
				alert("墙已满");
			}
		}

		window.onkeydown=function(event){
			pressKey(event,amovedBlock);
		}

		detailTgt.onmouseover=function(){
			showDetl();
		}

		showdetailTgt.onmouseout=function(){
			noShowDetl();
		}

	}

	init();
}