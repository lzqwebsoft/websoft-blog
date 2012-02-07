var windowStatus=false;  
//由于得到CSS像数值时带的单位"px"为字符串,故要转换  
function getPxNumber(px)  
{  
	px=px.replace("px", ""); 
	return Number(px);  
}  
function showWindows(edit_id)
{
    html = KE.html(edit_id);
    previewText=document.getElementById("keTextArea");
    previewText.innerHTML=html;
    var lockWindows=document.getElementById("dialogMask");
    var previewFrame=document.getElementById("preViewDialog");
    //得到页面的可见区的宽和高
    var windowWidth=(document.layers)?window.innerWidth:document.body.clientWidth;
    var windowHeight=(document.layers)?window.innerHeight:window.document.body.clientHeight;
    lockWindows.style.width=windowWidth+"px";
    lockWindows.style.height=windowHeight+"px";
    //将窗体置中
    previewFrame.style.left=parseInt((windowWidth-getPxNumber(previewFrame.style.width)+document.body.scrollLeft)/2)+document.body.scrollLeft+"px";
    previewFrame.style.top=parseInt((windowHeight-getPxNumber(previewFrame.style.height))/2-250)+document.body.scrollTop+"px";
    lockWindows.style.display="block";
    previewFrame.style.display="block";
    windowStatus=true;
}  
function closeWindows()  
{  
	var lockWindows=document.getElementById("dialogMask");
	var previewFrame=document.getElementById("preViewDialog");  
	lockWindows.style.display="none";  
	previewFrame.style.display="none";  
	windowStatus=false;  
}  
  
window.onresize=function()  
{  
	if(windowStatus)  
	   showWindows();  
};  

var oldX,oldY;    // 记录鼠标移动事件发生前鼠标的位置
var dragElem;    // 记录被拖曳的对象
// 获得事件发生的主体
function getEventElement(evt)
{
	evt=evt||event;
	return evt.srcElement||evt.target;
}

// 获取结点的计算样式
function getStyle(node)
{
    return node.currentStyle||document.defaultView.getComputedStyle(node, null);
}
// 拖动的动作
function drag(evt)
{
	evt=evt||event;    // 为了兼容IE和firefox，firefox执行evt，IE则执行evt=event
	var node=dragElem;
	if(node != null) //if语句是我(苏本东)后来加上去的
	{
	   node.style.top=parseInt(getStyle(node).top||0)+evt.clientY-oldY+'px';
	   node.style.left=parseInt(getStyle(node).left||0)+evt.clientX-oldX+'px';
	   //0px 越往左越小 930px
	   oldX=evt.clientX, oldY=evt.clientY;
	}
}
// 拖动开始
// 注册拖曳结束时的执行函数
// 注册拖曳事件的执行函数
// 对 drag_start 进行了改良
function drag_start(evt,nodeId)
{
	evt=evt||event;
	oldX=evt.clientX;
	oldY=evt.clientY;
	dragElem=document.getElementById(nodeId);
	if(dragElem.setCapture)dragElem.setCapture();//设置鼠标捕获的对象为当前对象，简单说就是获得鼠标拖动

	document.body.onmousemove=drag;
	document.body.onmouseup=drag_end;
}
// 拖曳结束，释放onmousemove事件执行函数
function drag_end(evt)
{
	evt = evt||event;
	if(dragElem!=null&&dragElem.releaseCapture)
           dragElem.releaseCapture();//从当前对象中释放鼠标捕获的对象，简单说就是鼠标的释放
	dragElem = null;
	getEventElement(evt).onmousemove = null;
	getEventElement(evt).onmouseup = null;
}