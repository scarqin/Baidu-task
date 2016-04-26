var obj = document.getElementsByClassName('box')[0]; //点击盒子
var wrap = document.getElementsByClassName('mask')[0]; //黑色幕布
var popUpBox = document.getElementsByClassName('pop-up-box')[0];
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
	if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
obj.onclick = function() {
	removeClass(popUpBox, 'hidden');
	removeClass(wrap, 'hidden');
}
wrap.onclick = function() {
	addClass(popUpBox, 'hidden');
	addClass(this, 'hidden');

}

function allowDrop(ev) {
	ev.preventDefault();
}

function Startdrag(target) {
	var params = {
		left:0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag:false
	}
	target.onmousedown = function(ev) {
		//初始化数据
		params.left = ev.clientX;
		params.top =ev.clientY;
		params.flag = true;
		params.currentX = ev.clientX;
		params.currentY = ev.clientY;//原始位置
	}
	target.onmouseup =function(){
		params.flag=false;
	}
	target.onmousemove = function(ev) {
		console.log(params.flag)
		if (params.flag) {
			var nowX = ev.clientX,
				nowY = ev.clientY; //鼠标点击的位置
			var disX = nowX - params.currentX,
				disY = nowY - params.currentY; //位置偏移
				console.log( parseInt(params.left))
			target.style.left = parseInt(params.left) + disX + 'px';
			target.style.top = parseInt(params.top) + disY + 'px';
		}
	}
}
Startdrag(popUpBox);