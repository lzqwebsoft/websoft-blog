//得到页面的可见区的宽和高
function  getPageSize() {

	var xScroll, yScroll;

	if (window.innerHeight && window.scrollMaxY) {
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}

	var windowWidth, windowHeight;

	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth;
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}

	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else {
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}

	return [pageWidth,pageHeight];
}

//显示遮罩层
function lockedWindows(){
	var lockWind=document.getElementById("dialogMask");
	var arrayPageSize = this.getPageSize();
	lockWind.style.width=arrayPageSize[0]+"px";
	lockWind.style.height=arrayPageSize[1]+"px";
	//显示锁窗体
	lockWind.style.display="block";
}
//隐藏遮罩层
function hideLockedWindows(){
	var lockWind=document.getElementById("dialogMask");
	lockWind.style.display="none";
}

//设置窗体屏幕居中
function setDialogLoactionCenter(dialog) {
	var arrayPageSize = this.getPageSize();
	dialog.style.left= (arrayPageSize[0]-dialog.offsetWidth)/2+"px";
	dialog.style.top= (arrayPageSize[1]-dialog.offsetHeight*2)/2+"px";
}

/*创建一个上传图片的对话框*/
function creatUploadFrame(url, type_values, type_texts) {
	var uploadDialog= document.createElement("div");
	uploadDialog.setAttribute("id", "uploadDialog");
	uploadDialog.setAttribute("style", "width: 580px; min-height: 50px;");
	uploadDialog.setAttribute("class", "dialog_shadow");
	//上传对话框标题
	var titleDiv= document.createElement("div");
	titleDiv.setAttribute("class", "titleDiv");
	uploadDialog.appendChild(titleDiv);

	var titleLable= document.createElement("div");
	titleLable.setAttribute("class", "titleLabel");
	titleLable.innerHTML="上传照片"
	titleDiv.appendChild(titleLable);

	var addNewTypeButton= document.createElement("a");
	addNewTypeButton.setAttribute("href", "#");
	addNewTypeButton.innerHTML="添加新相册";
	titleLable.appendChild(addNewTypeButton);

	var closeDiv= document.createElement("div");
	closeDiv.setAttribute("class", "upload_dialog_close_div");
	titleDiv.appendChild(closeDiv);

	var closeButton= document.createElement("span");
	closeButton.setAttribute("title", "关闭");
	closeButton.setAttribute("id", "upload_dialog_close_button");
	closeButton.setAttribute("class", "dialog_close_button");
	closeDiv.appendChild(closeButton);
	//上传的对话框的主体内容
	var uploadFormDiv= document.createElement("div");
	uploadFormDiv.setAttribute("id", "upload_form_div");
	uploadDialog.appendChild(uploadFormDiv);

	var uploadForm= document.createElement("form");
	uploadForm.setAttribute("action", url);
	uploadForm.setAttribute("method", "post");
        uploadForm.setAttribute("encType", "multipart/form-data");
	uploadFormDiv.appendChild(uploadForm);

	//图片的类型
	var typeTag= document.createElement("p");
	uploadForm.appendChild(typeTag);

	var typeLabel= document.createElement("label");
	typeLabel.setAttribute("id", "type_label");
	typeLabel.innerHTML="选择相册";
	typeTag.appendChild(typeLabel);

	var typeSelect= document.createElement("select");
	typeSelect.setAttribute("name", "image_type");
	typeTag.appendChild(typeSelect);

        for(var i=0; i<type_texts.length; i++) {
            var typeOption= document.createElement("option");
            typeOption.setAttribute("value", type_values[i]);
            typeOption.innerHTML=type_texts[i];
            typeSelect.appendChild(typeOption);
        }

	//图片信息
	var contentTag= document.createElement("p");
	uploadForm.appendChild(contentTag);

	var uploadLabel= document.createElement("label");
	uploadLabel.setAttribute("id", "upload_label");
	uploadLabel.innerHTML="照片地址";
	contentTag.appendChild(uploadLabel);

	var uploadSpan= document.createElement("span");
	contentTag.appendChild(uploadSpan);

	var uploadFileTag= document.createElement("input");
	uploadFileTag.setAttribute("type", "file");
	uploadFileTag.setAttribute("name", "images[0]");
	uploadSpan.appendChild(uploadFileTag);

	var inlineLabel= document.createElement("label");
	uploadSpan.appendChild(inlineLabel);

	var descriptionLable= document.createElement("span");
	descriptionLable.innerHTML="描述";
	inlineLabel.appendChild(descriptionLable);

	var descriptionField= document.createElement("input");
        descriptionField.setAttribute("type", "text");
	descriptionField.setAttribute("name", "descriptions[0]");
	inlineLabel.appendChild(descriptionField);

	var line= document.createElement("br");
	contentTag.appendChild(line);

	var smallTag= document.createElement("small");
	contentTag.appendChild(smallTag);

	var addUploadFileLabel= document.createElement("label");
	smallTag.appendChild(addUploadFileLabel);

	var addUploadFileLink= document.createElement("a");
	addUploadFileLink.setAttribute("href", "#");
	addUploadFileLink.setAttribute("onclick", "return false");
	addUploadFileLink.innerHTML= "添加上传文件";
	smallTag.appendChild(addUploadFileLink);

	var noteMessage= document.createTextNode(" (只能为图片类型)");
	smallTag.appendChild(noteMessage);
	//上传按钮
	var submitUploadField= document.createElement("p");
	uploadForm.appendChild(submitUploadField);

	var submitButton= document.createElement("input");
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("value", "上传");
	submitButton.style.marginLeft="10px";
	submitUploadField.appendChild(submitButton);

	//显示上传对话框
	document.body.appendChild(uploadDialog);
	//设置上传对话框的显示坐标
	setDialogLoactionCenter(uploadDialog);

	//为组件添加的事件处理
	closeButton.onclick=function(){closeUploadWindow(uploadDialog);return false;};              //添加的关闭事件
	addNewTypeButton.onclick=function(){creatNewImageType(this, typeTag, type_values, type_texts);return false;};        //添加创建新相册事件
	addUploadFileLink.onclick=function(){addUploadImageField(uploadSpan);return false};         //添加上传组件的个数
	titleDiv.onmousedown=function(e){drag_start(e,  titleDiv, uploadDialog);};                  //添加移动事件
}

/*显示上传的对话框*/
function showUploadWindow(url, image_type_value, image_type_text){
	lockedWindows();
        var type_texts=image_type_text.split(",");
	var type_values=image_type_value.split(",");
	creatUploadFrame(url, type_values, type_texts);
}

/*关闭上传对话框*/
function closeUploadWindow(dialog){
	document.body.removeChild(dialog);
	hideLockedWindows();
	return false;
}

//创建一个新的相册
function creatNewImageType(obj, replaceNode, type_values, type_texts){
	//得到选择相册的标签
	var imageTypeLabel=replaceNode.getElementsByTagName("label")[0];
	imageTypeLabel.innerHTML="相册名称";
	//替换下拉框为输入框
	var typeName=document.createElement("input");
	typeName.setAttribute("type", "input");
	typeName.setAttribute("name", "new_image_type");
	var oldTag=replaceNode.getElementsByTagName("select")[0];
	replaceNode.replaceChild(typeName, oldTag);
	//改变"添加新相册"为"使用已有相册"
	obj.innerHTML="使用已有相册"
	obj.onclick=function(){useAvailableType(obj, replaceNode, type_values, type_texts);return false;}
}

//使用已有相册
function useAvailableType(obj, replaceNode, type_values, type_texts){
	//得到选择相册的标签
	var imageTypeLabel=replaceNode.getElementsByTagName("label")[0];
	imageTypeLabel.innerHTML="选择相册";
	//替换输入框为下拉框
	var typeSelect= document.createElement("select");
	typeSelect.setAttribute("name", "image_type");

        for(var i=0; i<type_values.length; i++) {
            var typeOption= document.createElement("option");
            typeOption.setAttribute("value", type_values[i]);
            typeOption.innerHTML=type_texts[i];
            typeSelect.appendChild(typeOption);
        }

	var oldTag=replaceNode.getElementsByTagName("input")[0];
	replaceNode.replaceChild(typeSelect, oldTag);
	//改变"使用已有相册"为"添加新相册"
	obj.innerHTML="添加新相册"
	obj.onclick=function(){creatNewImageType(obj, replaceNode, type_values, type_texts);return false;}
}

//添加上传的图片
//fileFieldCount用于记录上传图片的组件数，不能超过10个
var fileFieldCount = 0;

function addUploadImageField(parentNode) {
	if (fileFieldCount > 10) return false
	fileFieldCount++;
	var f = document.createElement("input");
	f.type = "file";
	f.name = "images[" + fileFieldCount + "]";
	f.setAttribute("style", "margin-left: 10px;");
	parentNode.appendChild(f);

	var dLabel = document.createElement("label");
	var labelSpan= document.createElement("span");
	labelSpan.innerHTML="描述";
	dLabel.appendChild(labelSpan);

	var d = document.createElement("input");
	d.type = "text";
	d.name = "descriptions[" + fileFieldCount + "]";
	dLabel.appendChild(d);

	parentNode.appendChild(dLabel);
}

// 获取结点的计算样式
function getStyle(node)
{
    return node.currentStyle||document.defaultView.getComputedStyle(node, null);
}
//添加移动窗体事件的处理
var oldX;
var oldY;
function drag_start(evt, dialogTitle, dialogDiv) {
	evt = evt||window.event;
	oldX = evt.clientX;
	oldY = evt.clientY;
	if(dialogTitle.setCapture)
	   dialogTitle.setCapture();
	dialogTitle.onmouseup=function(e) {drag_end(e, dialogTitle,dialogDiv)};
	dialogTitle.onmousemove=function(e) {drag(e, dialogDiv)};
}
//拖动的动作
function drag(evt, dialogDiv)
{
	evt=evt||window.event;    // 为了兼容IE和firefox，firefox执行evt，IE则执行evt=event
	if(dialogDiv != null)
	{
	   dialogDiv.style.top=parseInt(getStyle(dialogDiv).top||0)+evt.clientY-oldY+'px';
	   dialogDiv.style.left=parseInt(getStyle(dialogDiv).left||0)+evt.clientX-oldX+'px';
	   //node.style.right=parseInt(getStyle(node).right||0)-evt.clientX+oldX+'px';
	   //0px 越往左越小 930px
	   oldX=evt.clientX;
	   oldY=evt.clientY;
	}
}
//拖曳结束，释放onmousemove事件执行函数
function drag_end(evt, dialogTitle,dialogDiv)
{
	evt = evt||window.event;
	if(dialogTitle.releaseCapture)
	    dialogTitle.releaseCapture();//从当前对象中释放鼠标捕获的对象，简单说就是鼠标的释放
	dialogTitle.onmousemove = null;
	dialogTitle.onmouseup = null;
}

//创建一个对话框的框架
function creatDialogFramework(title, width, height) {
	var dialogFramework= document.createElement("div");
	dialogFramework.setAttribute("style", "min-width: "+width+"px; min-height: "+height+"px;");
	dialogFramework.setAttribute("class", "dialogFramework dialog_shadow");
	//上传对话框标题
	var titleDiv= document.createElement("div");
	titleDiv.setAttribute("class", "titleDiv");
	dialogFramework.appendChild(titleDiv);

	var titleLable= document.createElement("div");
	titleLable.setAttribute("class", "titleLabel");
	titleLable.innerHTML=title
	titleDiv.appendChild(titleLable);

	var closeDiv= document.createElement("div");
	closeDiv.setAttribute("class", "upload_dialog_close_div");
	titleDiv.appendChild(closeDiv);

	var closeButton= document.createElement("span");
	closeButton.setAttribute("title", "关闭");
	closeButton.setAttribute("class", "dialog_close_button");
	closeDiv.appendChild(closeButton);

	closeButton.onclick=function(){closeUploadWindow(dialogFramework);return false;};              //添加的关闭事件
	titleDiv.onmousedown=function(e){drag_start(e,  titleDiv, dialogFramework);};                  //添加移动事件

	return dialogFramework;
}

//创建一个编辑与新建相册共用的对话框
function createTypeInfoDialog(title, url, id, name, permission, question, answer){
	lockedWindows();      //锁住屏幕
	//创建一个窗体
	var editDialog= creatDialogFramework(title, 300, 150);
	//对话框的主体
	var formDiv= document.createElement("div");
	formDiv.setAttribute("class", "dialog_content");
	editDialog.appendChild(formDiv);
	//一个编辑的表单
	var editForm= document.createElement("form");
	editForm.setAttribute("action", url);
	editForm.setAttribute("method", "post");
	formDiv.appendChild(editForm);
	//相册名
	var typeNameField= document.createElement("p");
	editForm.appendChild(typeNameField);
	var typeLabel= document.createElement("label");
	typeLabel.innerHTML="相册名称"
	typeNameField.appendChild(typeLabel);

	var typeInputField= document.createElement("input");
	typeInputField.setAttribute("type", "text");
        if(name)
            typeInputField.setAttribute("value", name);
	typeInputField.setAttribute("name", "facebook_name");
	typeNameField.appendChild(typeInputField);
        //创建一个隐藏域
        if(id){
            var typeIDField= document.createElement("input");
            typeIDField.setAttribute("type", "hidden");
            typeIDField.setAttribute("name", "id");
            typeIDField.setAttribute("value", id);
            typeNameField.appendChild(typeIDField);
        }
	//浏览权限
	var permField= document.createElement("p");
	editForm.appendChild(permField);
	var permLabel= document.createElement("label");
	permLabel.innerHTML="浏览权限"
	permField.appendChild(permLabel);

	var permissions=[{value: 0, text: "所有人"},
					 {value: 1, text: "仅自己"},
					 {value: 2, text: "回答问题"}];      //定义的权限集合

	var permSelect= document.createElement("select");
	permSelect.setAttribute("id", "permissions_select");
	permSelect.setAttribute("name", "permissions");
	permField.appendChild(permSelect);

	for(var i=0; i<permissions.length; i++) {
		var permOption= document.createElement("option");
		permOption.setAttribute("value", permissions[i].value);
                if(permission&&permission==i)
                    permOption.setAttribute("selected", true)
		permOption.innerHTML=permissions[i].text;
		permSelect.appendChild(permOption);
	}
        //浏览的权限问题
        var setQuestionDiv=document.createElement("div");
        setQuestionDiv.setAttribute("id", "question_set_div");
        if(permission&&permission==2)
            setQuestionDiv.setAttribute("style", "display: block;");
        else
            setQuestionDiv.setAttribute("style", "display: none;");
        //将回答的问题和答案的输入框添加到权限域下面
        editForm.appendChild(setQuestionDiv);
        //相册问题
        var questionField= document.createElement("p");
        setQuestionDiv.appendChild(questionField);
        var questionLabel= document.createElement("label");
        questionLabel.innerHTML="相册问题"
        questionField.appendChild(questionLabel);
        var questionInput= document.createElement("input");
        questionInput.setAttribute("type", "text");
        questionInput.setAttribute("name", "view_question");
        if(question)
            questionInput.setAttribute("value", question);
        questionField.appendChild(questionInput);
        //相册的答案
        var answerField= document.createElement("p");
        setQuestionDiv.appendChild(answerField);
        var answerLabel= document.createElement("label")
        answerLabel.innerHTML="问题答案";
        answerField.appendChild(answerLabel);
        var answerInput= document.createElement("input");
        answerInput.setAttribute("type", "text");
        answerInput.setAttribute("name", "view_answer");
        if(answer)
            answerInput.setAttribute("value", answer)
        answerField.appendChild(answerInput);

	//确定按钮域
	var confirmField= document.createElement("p");
	editForm.appendChild(confirmField);

	var confirmButton= document.createElement("input");
	confirmButton.setAttribute("type", "submit");
	confirmButton.setAttribute("value", "确定");
	confirmButton.setAttribute("style", "float: right");
	confirmField.appendChild(confirmButton);

	document.body.appendChild(editDialog);   //显示
	setDialogLoactionCenter(editDialog);     //居中
	permSelect.onchange=function(){changePermission(permSelect)};  //权限位更改时
}

//当改变权限时
function changePermission(obj) {
	//得到被选的选项
	var selectedValue= obj.options[obj.options.selectedIndex].value;
	var setQuestionDiv=document.getElementById("question_set_div");
	switch(selectedValue){
		case "0" :
		case "1" :
		   setQuestionDiv.style.display="none";
		   break;
		case "2" :
		   setQuestionDiv.style.display="block";
		   break;
	}
}

//编辑图片对话框
function showEditDialog(url, id, name, permission, question, answer) {
	createTypeInfoDialog("编辑相册", url, id, name, permission, question, answer);
}

//删除对话框
function showDeleteDialog(url, type_name, type_id, image_type_value, image_type_text) {
	lockedWindows();      //锁住屏幕

	var type_value= image_type_value.split(",");
        var type_text= image_type_text.split(",");
        var deleteDialog= creatDialogFramework("删除相册", 300, 100);
	//对话框的主体
	var formDiv= document.createElement("div");
        formDiv.setAttribute("class", "dialog_content");
	deleteDialog.appendChild(formDiv);

	var formTag= document.createElement("form");
        formTag.setAttribute("action", url);
        formTag.setAttribute("method", "post");
        formTag.setAttribute("id", "delete_type_form");
        formDiv.appendChild(formTag);

        //相册名称
        var nameField= document.createElement("p");
        formTag.appendChild(nameField);
        var nameLabel= document.createElement("label");
        nameLabel.innerHTML= "相册名称";
        nameField.appendChild(nameLabel);
        var nameText= document.createElement("span");
        nameText.innerHTML=type_name;
        nameField.appendChild(nameText);
        var nameHidden= document.createElement("input");
        nameHidden.setAttribute("name", "id");
        nameHidden.setAttribute("type", "hidden");
        nameHidden.setAttribute("value", type_id);
        nameField.appendChild(nameHidden);

        //删賖方式
        var deleteField= document.createElement("p");
        formTag.appendChild(deleteField);
        var deleteTypeLabel= document.createElement("label");
        deleteTypeLabel.innerHTML="删除方式";
        deleteField.appendChild(deleteTypeLabel);

        var deleteTypeSelect= document.createElement("select");
        deleteTypeSelect.setAttribute("name", "delete_method_select");
        deleteField.appendChild(deleteTypeSelect);

        var removeOption= document.createElement("option");
        removeOption.setAttribute("value", 0);
        removeOption.innerHTML="彻底删除";
        deleteTypeSelect.appendChild(removeOption);

        for(var i=0; i<type_text.length; i++) {
            var option= document.createElement("option");
            option.setAttribute("value", type_value[i]);
            option.innerHTML="移至【"+type_text[i]+"】";
            deleteTypeSelect.appendChild(option);
        }

        //提交按钮
        var submitField= document.createElement("p");
        formTag.appendChild(submitField);

        var submitButton= document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "确定");
        submitButton.setAttribute("style", "float: right;");
        submitField.appendChild(submitButton);

	document.body.appendChild(deleteDialog);   //显示
	setDialogLoactionCenter(deleteDialog);     //居中
}

//创建新的相册对话框
function showCreateTypeDialog(url) {
	createTypeInfoDialog("新建相册", url, null, null, null, null, null);
}

//得到系统省略的路径
function scriptPath(){
    var elements = document.getElementsByTagName('script');
    for (var i = 0, len = elements.length; i < len; i++) {
            var src = elements[i].src;
            if (src)
                    return src.substring(0, src.lastIndexOf('/') + 1);
    }
    return false;
}
//Ajax上传
function ajax_request(url){
    new Ajax.Request(url,
                         {asynchronous:true,
                          evalScripts:true
                        });
}

//得到提示为空相册的对话框
function show_empty_book() {
    //创建一个对话框
    var editDialog= creatDialogFramework("暂无图片", 300, 100);
    //对话框的主体
    var formDiv= document.createElement("div");
    formDiv.setAttribute("class", "dialog_content");
    formDiv.setAttribute("style", "text-align: center; height: 50px; padding-top: 20px;");
    editDialog.appendChild(formDiv);

    formDiv.innerHTML="<img src='../images/exclamation.png' alt='' style='padding-right: 5px; margin:0;' />"
                     +"<label>无法访问：本相册暂无照片！</label>";

    var bottomDiv= document.createElement("div");
    bottomDiv.setAttribute("style", "overflow: hidden; float: right");
    editDialog.appendChild(bottomDiv);
    var closeButton= document.createElement("input");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("value", "确定");
    bottomDiv.appendChild(closeButton);

    document.body.appendChild(editDialog);
    setDialogLoactionCenter(editDialog);     //居中
    closeButton.focus();

    closeButton.onclick= function(){document.body.removeChild(editDialog);}
}

//提示回答问题对话框
function show_answer_quesion(url, question_text) {
    //创建一个对话框
    var editDialog= creatDialogFramework("访问限制", 300, 100);
    //对话框的主体
    var formDiv= document.createElement("div");
    formDiv.setAttribute("class", "dialog_content");
    editDialog.appendChild(formDiv);
    //form
    var submitForm= document.createElement("form");
    submitForm.action=url;
    submitForm.method="post";
    formDiv.appendChild(submitForm);
    //问题
    var questionField= document.createElement("p");
    submitForm.appendChild(questionField);
    var questionLabel= document.createElement("label");
    questionLabel.innerHTML="访问问题";
    questionField.appendChild(questionLabel);
    var questionText= document.createElement("span");
    questionText.innerHTML=question_text;
    questionField.appendChild(questionText);
    //答案
    var answerField= document.createElement("p");
    submitForm.appendChild(answerField);
    var answerLabel= document.createElement("label");
    answerLabel.innerHTML="问题答案";
    var answerspan= document.createElement("span");
    answerField.appendChild(answerLabel);
    answerField.appendChild(answerspan);
    var answerInput= document.createElement("input");
    answerInput.setAttribute("type", "text");
    answerInput.setAttribute("style", "width: 200px;");
    answerInput.setAttribute("name", "access_answer");
    answerspan.appendChild(answerInput);
    //提交按钮
    var submitField= document.createElement("p");
    submitForm.appendChild(submitField);

    var submitButton= document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "确定");
    submitButton.setAttribute("style", "float: right;");
    submitField.appendChild(submitButton);

    document.body.appendChild(editDialog);   //显示
    setDialogLoactionCenter(editDialog);     //居中
}
