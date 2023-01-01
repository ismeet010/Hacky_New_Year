var tog = true;
    function open_curtain()
{
 $("#curtain1").animate({width:20},1000);
 $("#curtain2").animate({width:20},1000);
 $("#bow").animate({top:620},1000);
 tog=false;
}
function close_curtain()
{
 $("#curtain1").animate({width:768},1000);
 $("#curtain2").animate({width:768},1000);
$("#bow").animate({top:250},1000);
tog=true;
}

function toggle(){
    tog ? open_curtain() : close_curtain();
}


var RENDERER = {
	JOINT_COUNT : 80,
	STEP_COUNT : 30,
	COMPLETION_DISTANCE : 30,
	INTERVAL_COUNT : 30,
	FADEIN_TIME : 500,
	PATHS : {
		A : [
			{type : 0, x0 : 0, y0 : -145, x1 : -110, y1 : 130},
			{type : 0, x0 : 0, y0 : -145, x1 : 105, y1 : 135},
			{type : 0, x0 : -60, y0 : 35, x1 : 55, y1 : 35}
		],
    E : [
			{type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -140, x1 : 80, y1 : -140},
			{type : 0, x0 :-85, y0 : -10, x1 : 80, y1 : -10},
      {type : 0, x0 :-85, y0 : 135, x1 : 80, y1 : 135},
		],
		H : [
			{type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -10, x1 : 80, y1 : -10},
			{type : 0, x0 : 80, y0 : -140, x1 : 85, y1 : 135}
		],
		I : [
			{type : 0, x0 : -20, y0 : -140, x1 : 20, y1 : -140},
			{type : 0, x0 : 0, y0 : -140, x1 : 0, y1 : 135},
			{type : 0, x0 : -20, y0 : 135, x1 : 20, y1 : 135}
		],
		M : [
			{type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -140, x1 : 0, y1 : 135},
			{type : 0, x0 : 85, y0 : -140, x1 : 0, y1 : 135},
			{type : 0, x0 : 85, y0 : -140, x1 : 85, y1 : 135}
		],
    N: [
      {type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -140, x1 : 80, y1 : 135},
			{type : 0, x0 : 80, y0 : -140, x1 : 85, y1 : 135}
    ],
		P : [
			{type : 0, x0 : -85, y0 : -120, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -120, x1 : 25, y1 : -120},
			{type : 1, x0 : 25, y0 : -55, r : 65},
			{type : 0, x0 : 25, y0 : 10, x1 : -75, y1 : 10}
		],
    R : [
			{type : 0, x0 : -85, y0 : -120, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : -120, x1 : 25, y1 : -120},
			{type : 1, x0 : 25, y0 : -55, r : 65},
			{type : 0, x0 : 25, y0 : 10, x1 : -75, y1 : 10},
      {type : 0, x0 : -75, y0 : 10, x1 : 70, y1 : 135}
		],
    W : [
			{type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 135},
			{type : 0, x0 : -85, y0 : 135, x1 : 0, y1 : -140},
			{type : 0, x0 : 85, y0 : 135, x1 : 0, y1 : -140},
			{type : 0, x0 : 85, y0 : -140, x1 : 85, y1 : 135}
		],
		Y : [
			{type : 0, x0 : -100, y0 : -140, x1 : 0, y1 : -5},
			{type : 0, x0 : 90, y0 : -140, x1 : 0, y1 : -5},
			{type : 0, x0 : 0, y0 : -5, x1 : 0, y1 : 125}
		],
    "!" :[
      {type : 0, x0 : -85, y0 : -140, x1 : -85, y1 : 80},
      {type : 0, x0 : -85, y0 : 130, x1 : -85, y1 : 135}
    ]
	},
	init : function(){
		this.setParameters();
		this.reconstructText();
		this.reconstructMethods();
		this.render();
	},
	setParameters : function(){
		this.$container = $('#jsi-new-year-container');
		this.$textWrapper = this.$container.children('div');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.canvas = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0);
		this.context = this.canvas.getContext('2d');
		this.arm = new JOINT(this.width / 2, this.height, this.JOINT_COUNT - 1);
		this.limit = this.JOINT_COUNT;
		this.jointCount = this.JOINT_COUNT;
		this.literalIndex = 0;
		this.lineIndex = 0;
		this.stepCount = 0;
		this.completionIndex = 0;
		this.intervalCount = 0;
		this.literals = this.$textWrapper.text().replace(/\s|　/g, '').split('');
		this.status = 0;
		var axis = this.PATHS[this.literals[this.literalIndex]][0];
		this.next = {x : axis.x0 + this.width / 2, y : axis.y0 + this.height / 2};
	},
	reconstructText : function(){
		var myself = this;
		
		this.$textWrapper.html(this.$textWrapper.text().split('').map(function(text){
			return '<span>' + text + '</span>';
		})).css('opacity', 1);
		this.$texts = this.$textWrapper.children('span').filter(function(){
			return !/\s|　/.test($(this).text());
		}).each(function(){
			var $self = $(this);
			$self.data('x', $self.position().left + $self.width() / 2 - myself.width / 2);
		});
	},
	reconstructMethods : function(){
		this.render = this.render.bind(this);
	},
	controlStatus : function(){
		switch(this.status){
		case 0:
			if(this.jointCount == 0){
				this.status = 1;
			}else{
				this.limit = --this.jointCount;
			}
			break;
		case 1:
			var path = this.PATHS[this.literals[this.literalIndex]];
			
			if(++this.stepCount > this.STEP_COUNT){
				this.stepCount = 0;
				
				if(this.lineIndex + 1 == path.length){
					this.status = 3;
					
					if(this.literalIndex < this.literals.length - 1){
						var path1 = this.PATHS[this.literals[this.literalIndex]],
							path2 = this.PATHS[this.literals[this.literalIndex + 1]];
							
						this.x0 = path1[this.lineIndex].x1;
						this.y0 = path1[this.lineIndex].y1;
						this.x1 = path2[0].x0;
						this.y1 = path2[0].y0;
					}
				}else{
					if(path[this.lineIndex].type == 0){
						this.x0 = path[this.lineIndex].x1;
						this.y0 = path[this.lineIndex].y1;
					}else{
						this.x0 = path[this.lineIndex].x0;
						this.y0 = path[this.lineIndex].y0 + path[this.lineIndex].r;
					}
					if(path[this.lineIndex + 1].type == 0){
						this.x1 = path[this.lineIndex + 1].x0; 
						this.y1 = path[this.lineIndex + 1].y0;
					}else{
						this.x1 = path[this.lineIndex + 1].x0;
						this.y1 = path[this.lineIndex + 1].y0 - path[this.lineIndex + 1].r;
					}
					var dx = this.x1 - this.x0,
						dy = this.y1 - this.y0,
						distance = Math.sqrt(dx * dx + dy * dy);
						
					if(distance == 0){
						this.lineIndex++;
						this.status = 1;
					}else{
						this.completionCount = Math.ceil(distance / this.COMPLETION_DISTANCE);
						this.completionIndex = 0;
						this.status = 2;
					}
				}
			}
			break;
		case 2:
			if(++this.completionIndex == this.completionCount){
				this.lineIndex++;
				this.status = 1;
			}else{
				this.next = {
					x : this.x0 + (this.x1 - this.x0) * this.completionIndex / this.completionCount + this.width / 2,
					y : this.y0 + (this.y1 - this.y0) * this.completionIndex / this.completionCount + this.height / 2
				};
			}
			break;
		case 3:
			if(++this.intervalCount > this.INTERVAL_COUNT){
				this.lineIndex = 0;
				this.intervalCount = 0;
				this.$texts.eq(this.literalIndex).animate({opacity : 1}, this.FADEIN_TIME);
				
				if(++this.literalIndex == this.literals.length){
					this.status = 4;
				}else{
					this.status = 1;
				}
			}else{
				this.next = {
					x : this.x0 + (this.x1 - this.x0) * this.intervalCount / this.INTERVAL_COUNT + this.width / 2,
					y : this.y0 + (this.y1 - this.y0) * this.intervalCount / this.INTERVAL_COUNT + this.height / 2
				};
			}
			break;
		case 4:
			this.limit = ++this.jointCount;
			
			if(this.limit > this.JOINT_COUNT){
				this.status = 5;
			}
		}
	},
	render : function(){
		if(this.status == 5){
			return;
		}
		var context = this.context;
		
		requestAnimationFrame(this.render);
		this.context.clearRect(0, 0, this.width, this.height);
        var path = this.PATHS[this.literals[this.literalIndex]];
		
		if(this.status == 1 || this.status == 2 || this.status == 3){
			context.save();
			context.lineWidth = 40;
			context.lineCap = 'round';
			context.translate(this.width / 2, this.height / 2);
			
			if(this.status == 1 || this.status == 2){
				context.strokeStyle = 'rgb(200, 200, 200,0.5)';
			}else{
				var scale = 0.15 + 0.85 * (this.INTERVAL_COUNT - this.intervalCount) / this.INTERVAL_COUNT;
				context.translate(this.$texts.eq(this.literalIndex).data('x') * this.intervalCount / this.INTERVAL_COUNT, 0);
				context.scale(scale, scale);
				context.strokeStyle = 'hsl(' + 75 * (1 - scale) + ', ' + 20 * (1 - scale) + '%,' + 90 * (1 - scale) + '%)';
			}
			for(var i = 0, length = this.lineIndex; i <= length; i++){
				if(i == this.lineIndex && this.status == 1){
					if(path[i].type == 0){
						var x = path[i].x0 + (path[i].x1 - path[i].x0) * this.stepCount / this.STEP_COUNT,
							y = path[i].y0 + (path[i].y1 - path[i].y0) * this.stepCount / this.STEP_COUNT;
							
						context.beginPath();
						context.moveTo(path[i].x0, path[i].y0);
						context.lineTo(x, y);
						context.stroke();
						this.next = {x : x + this.width / 2, y : y + this.height / 2};
					}else{
						var angle = -Math.PI / 2 + Math.PI * this.stepCount / this.STEP_COUNT;
						
						context.beginPath();
						context.arc(path[i].x0, path[i].y0, path[i].r, -Math.PI / 2, angle, false);
						context.stroke();
						this.next = {
							x : path[i].x0 + path[i].r * Math.cos(angle) + this.width / 2,
							y : path[i].y0 + path[i].r * Math.sin(angle) + this.height / 2
						};
					}
				}else{
					if(path[i].type == 0){
						context.beginPath();
						context.moveTo(path[i].x0, path[i].y0);
						context.lineTo(path[i].x1, path[i].y1);
						context.stroke();
					}else{
						context.beginPath();
						context.arc(path[i].x0, path[i].y0, path[i].r, -Math.PI / 2, Math.PI / 2, false);
						context.stroke();
					}
				}
			}
			context.restore();
		}
		this.controlStatus();
		
		this.arm.follow(this.next, this.limit);
		this.arm.adjust();
		this.arm.render(context, this.limit);
	}
};
var JOINT = function(x, y, level){
	this.x = x;
	this.y = y;
	this.level = level;
	this.init();
};
JOINT.prototype = {
	WIDTH : 5,
	HEIGHT : 5,
	
	init : function(){
		this.setParameters();
		this.createJoint();
	},
	setParameters : function(){
		this.angle = Math.PI / 2;
		this.joint = null;
	},
	createJoint : function(){
		if(this.level == 0){
			return;
		}
		var axis = this.getTailAxis();
		this.joint = new JOINT(axis.x, axis.y, this.level - 1);
	},
	follow : function(axis, limit){
		if(this.level < limit){
			return;
		}else if(this.level > limit){
			axis = this.joint.follow(axis, limit);
		}
		this.angle = Math.atan2(axis.y - this.y, axis.x - this.x);
		
		var tailAxis = this.getTailAxis();
		return {x : axis.x - (tailAxis.x - this.x), y : axis.y - (tailAxis.y - this.y)};
	},
	adjust : function(){
		if(this.joint == null){
			return;
		}
		this.joint.setHeadAxis(this.getTailAxis());
		this.joint.adjust();
	},
	getAxis : function(limit){
		if(this.level == limit){
			return this.getTailAxis();
		}
		return this.joint.getAxis(limit);
	},
	setHeadAxis : function(axis){
		this.x = axis.x;
		this.y = axis.y;
	},
	getTailAxis : function(){
		return {x : this.x + this.WIDTH * Math.cos(this.angle), y : this.y + this.WIDTH * Math.sin(this.angle)};
	},
	render : function(context, limit){
		if(this.level < limit){
			return;
		}
		context.save();
		context.lineWidth = 1;
		context.translate(this.x, this.y);
		context.rotate(this.angle);
		
		context.beginPath();
		
		if(this.level == limit){
			context.strokeStyle = 'hsl(20, 50%, 50%)';
			context.fillStyle = 'hsl(20, 50%, 30%)';
			context.arc(this.WIDTH, 0, this.HEIGHT, Math.PI / 2, Math.PI * 3 / 2, false);
			context.quadraticCurveTo(this.WIDTH * 4, -this.HEIGHT * 2, this.WIDTH * 7, 0);
			context.quadraticCurveTo(this.WIDTH * 4, this.HEIGHT * 2, this.WIDTH, this.HEIGHT);
		}else{
			context.strokeStyle = 'hsl(20, 50%, 80%)';
			context.fillStyle = 'hsl(20, 50%, 50%)';
			context.arc(0, 0, this.HEIGHT / 2, Math.PI / 2, Math.PI * 3 / 2, false);
			context.lineTo(this.WIDTH, -this.HEIGHT / 2);
			context.arc(this.WIDTH, 0, this.HEIGHT / 2, -Math.PI / 2, Math.PI / 2, false);
		}
		context.closePath();
		context.fill();
		context.stroke();
		context.restore();
		
		if(this.joint){
			this.joint.render(context, limit);
		}
	}
};
if(tog){
$(function(){
	RENDERER.init();
});
}

