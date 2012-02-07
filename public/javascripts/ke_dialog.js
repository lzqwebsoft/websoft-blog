/*创建一个工具模型
 *
 */
var KE={};
KE.util= {
	//判断浏览器
	browser : function() {
	var ua = navigator.userAgent.toLowerCase();
	return {
		VERSION: ua.match(/(msie|firefox|webkit|opera)[\/:\s](\d+)/) ? RegExp.$2 : '0',
		IE: (ua.indexOf('msie') > -1 && ua.indexOf('opera') == -1),
		GECKO: (ua.indexOf('gecko') > -1 && ua.indexOf('khtml') == -1),
		WEBKIT: (ua.indexOf('applewebkit') > -1),
		OPERA: (ua.indexOf('opera') > -1)
	  }
	},
	//得到文档对象
	getDocumentElement : function(doc) {
		doc = doc || document;
		return (doc.compatMode != "CSS1Compat") ? doc.body : doc.documentElement;
	},
	//得到文档的高
	getDocumentHeight : function(doc) {
		var el = this.getDocumentElement(doc);
		return Math.max(el.scrollHeight, el.clientHeight);
	},
	//得到文档的宽
	getDocumentWidth : function(doc) {
		var el = this.getDocumentElement(doc);
		return Math.max(el.scrollWidth, el.clientWidth);
	},
	//得到鼠标的坐标
	getCoords : function(ev) {
		ev = ev || window.event;
		return {
			x : ev.clientX,
			y : ev.clientY
		};
	},
	//得到滑动条滑动的x和y的偏移量
	getScrollPos : function() {
		var x, y;
		if (KE.util.browser().IE || KE.util.browser().OPERA) {
			var el = this.getDocumentElement();
			x = el.scrollLeft;
			y = el.scrollTop;
		} else {
			x = window.scrollX || 0; 
			y = window.scrollY || 0;
		}
		return {x : x, y : y};
	},
	//窗体拖动函数
	drag : function(mousedownObj, moveObj, func) {
		//当鼠标按下时调用
		mousedownObj.onmousedown = function(e) {
			var self = this;
			e = e || window.event;
			//得到鼠标的坐标
			var pos = KE.util.getCoords(e);
			//得到窗体的当前坐标
			var objTop = parseInt(moveObj.style.top);
			var objLeft = parseInt(moveObj.style.left);
			//得到窗体的高与宽
			var objWidth = moveObj.style.width;
			var objHeight = moveObj.style.height;
			//处理当窗体高宽为百分比的情况
			if (objWidth.match(/%$/)) objWidth = moveObj.offsetWidth + 'px';
			if (objHeight.match(/%$/)) objHeight = moveObj.offsetHeight + 'px';
			objWidth = parseInt(objWidth);
			objHeight = parseInt(objHeight);
			
			var mouseTop = pos.y;
			var mouseLeft = pos.x;
			//窗体由滑动条产生的偏移量
			var scrollPos = KE.util.getScrollPos();
			var scrollTop = scrollPos.y;
			var scrollLeft = scrollPos.x;
			var dragFlag = true;
			//鼠标移动时调用
			function moveListener(e) {
				if (dragFlag) {
					var pos = KE.util.getCoords(e);
					var scrollPos = KE.util.getScrollPos();
					var top = parseInt(pos.y - mouseTop - scrollTop + scrollPos.y);
					var left = parseInt(pos.x - mouseLeft - scrollLeft + scrollPos.x);
					func(objTop, objLeft, objWidth, objHeight, top, left);
				}
			}
			//鼠标释放时
			function upListener(e) {
				dragFlag = false;
				if (self.releaseCapture) self.releaseCapture();
				mousedownObj.onmousemove=null;
				mousedownObj.onmouseup=null;
				return false;
			}
			mousedownObj.onmousemove=function(e){moveListener(e);};
			mousedownObj.onmouseup=function(e){upListener(e);};
			if (self.setCapture) self.setCapture();
			return false;
		};
	},
	//创建一个锁住屏幕的Div
	showLockDiv : function() {
		var maskDiv = document.createElement('div');
		maskDiv.className = 'ke-mask';
		maskDiv.style.zIndex= 99;
		maskDiv.setAttribute( "style", "filter:Alpha(Opacity=50); opacity: 0.5;");
		document.body.appendChild(maskDiv);
		return maskDiv;
	}
}
/*作用:一个按钮类
 *
 */
function Button(arg) {
	arg = arg || {};
	doc = arg.doc || document;
	var span = doc.createElement('span');
	span.className = 'ke-button-common ke-button-outer ' + (arg.className || '');
	span.title = arg.text;
	btn = doc.createElement('input');
	btn.className = 'ke-button-common ke-button';
	btn.type = arg.type;
	btn.value = arg.text || '';
	if (arg.clickFn) {
		btn.onclick = arg.clickFn;
	}
	span.appendChild(btn);
	return {span : span, btn : btn};
}
/*作用: 创建一个弹出窗体类
 *
 */
 function Dialog(arg) {
	var self = this;
	this.widthMargin = 30;
	this.heightMargin = 100;
	this.zIndex = 100;
	this.width = arg.width;
	this.height = arg.height;
	var minTop, minLeft;   //窗体的滑动条的偏移位置
	function setLimitNumber() {
		var docEl = KE.util.getDocumentElement();
		var pos = KE.util.getScrollPos();
		minTop = pos.y;
		minLeft = pos.x;
	}
	//这样来得到窗体的初始代居中显示坐标
	function getPos() {
		var width = this.width + this.widthMargin;
		var height = this.height + this.heightMargin;
		var x = 0, y = 0;
		var el = KE.util.getDocumentElement();
		var scrollPos = KE.util.getScrollPos();
		x = Math.round(scrollPos.x + (el.clientWidth - width) / 2);
		y = Math.round(scrollPos.y + (el.clientHeight - height) / 2);
		x = x < 0 ? 0 : x;
		y = y < 0 ? 0 : y;
		return {x : x, y : y};
	};
	//重设窗体的大小
	this.resize = function(width, height) {
		if (width) this.width = width;
		if (height) this.height = height;
		this.hide();
		this.show();
	};
	//关闭窗体
	this.hide = function() {
		document.body.removeChild(this.div);
		this.maskDiv.style.display = 'none';;
	};
	//显示窗体
	this.show = function() {
		var self = this;
		//创建窗体Div
		var div = document.createElement('div');
		div.className = 'ke-dialog ke-dialog-shadow';
		div.style.width=this.width+"px";
		div.style.height=this.height+"px";
		//设置窗体的z坐标
		div.style.zIndex = this.zIndex;
		//设置窗体的显示的坐标
		var pos = getPos.call(this);
		div.style.top = pos.y + 'px';
		div.style.left = pos.x + 'px';
		//创建一个窗体的标题div
		var titleDiv = document.createElement('div');
		titleDiv.className = 'ke-dialog-title';
		//根据用户所提的参数来设置窗体的标题title
		titleDiv.innerHTML = arg.title;
		//窗体上的中的关闭按钮
		var span = document.createElement('span');
		span.className = 'ke-dialog-close';
		span.alt = "关闭";
		span.title = "关闭";
		span.onclick = function () {
			//隐藏窗体
			self.hide();
		};
		titleDiv.appendChild(span);
		setLimitNumber();
		window.onresize=function(){setLimitNumber();};
		window.onscroll=function(){setLimitNumber();};
		//为窗体添加拖动事件
		KE.util.drag(titleDiv, div, function(objTop, objLeft, objWidth, objHeight, top, left) {
			setLimitNumber();
			top = objTop + top;
			left = objLeft + left;
			if (top < minTop) top = minTop;
			if (left < minLeft) left = minLeft;
			div.style.top = top + 'px';
			div.style.left = left + 'px';
		});
		div.appendChild(titleDiv);
		//窗体的主体面板
		var bodyDiv = document.createElement('div');
		bodyDiv.className = 'ke-dialog-body';
		div.appendChild(bodyDiv);
		//窗体的下半按钮部分
		var bottomDiv = document.createElement('div');
		bottomDiv.className = 'ke-dialog-bottom';
		var noButton = null;
		var yesButton = null;
		//确定按钮
		if (arg.yesButton) {
			var btn = new Button({
				className : 'ke-dialog-yes',
				text : arg.yesButton,
                                type : "button",
				clickFn : arg.buttonClick
			});
			yesButton = btn.btn;
			bottomDiv.appendChild(btn.span);
		}
		//取消按钮
		if (arg.noButton) {
			var btn = new Button({
				className : 'ke-dialog-no',
				text : arg.noButton,
                                type : "button",
				clickFn : function() {
					self.hide();
				}
			});
			noButton = btn.btn;
			bottomDiv.appendChild(btn.span);
		}
		if (arg.yesButton || arg.noButton) {
			div.appendChild(bottomDiv);
		}
		//添加一个锁住按钮
		var maskDiv= this.maskDiv || KE.util.showLockDiv();
		maskDiv.style.width = KE.util.getDocumentWidth() + 'px';
		maskDiv.style.height = KE.util.getDocumentHeight() + 'px';
		maskDiv.style.display = 'block';
		//将窗体加入到页面中
		document.body.appendChild(div);
		window.focus();
		this.maskDiv= maskDiv;
		this.noButton = noButton;
		this.yesButton = yesButton;
		this.div = div;
		this.bodyDiv=bodyDiv;
	}; 
 }