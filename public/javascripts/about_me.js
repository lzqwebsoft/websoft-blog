var provinces= ['北京', '上海', '天津', '重庆', '黑龙江','吉林', '辽宁', '内蒙古', '河北','山西','陕西',
				'山东', '新疆', '西藏', '青海','甘肃', '宁夏', '河南','江苏', '湖北','浙江', '安徽', 
				'福建', '江西', '湖南', '贵州', '四川', '广东', '云南', '广西', '海南', '香港', '澳门', '台湾'];
var astroName = {1 : '白羊座',2 : '金牛座',3 : '双子座',4 : '巨蟹座',5 : '狮子座',6 : '处女座',7 : '天秤座',
                 8 : '天蝎座',9 : '射手座',10 : '魔羯座', 11 : '水瓶座',12 : '双鱼座'};
var info_datas=[];      //记录所有的span中的初始代数据

//修改个人的基本资料
function editBaseInfo() {
	var baseInfoDiv= document.getElementById("base_info");
	var allSpanTags= baseInfoDiv.getElementsByTagName("span");
	//保存所有span中的数据
	for(var i=0; i<allSpanTags.length; i++)
		info_datas.push(allSpanTags.item(i).innerHTML);
	//眤称的编辑
	var nameSpan=allSpanTags.item(0);
	var nameField= document.createElement("input");
	nameField.setAttribute("type", "text");
	nameField.setAttribute("name", "username");
	nameField.setAttribute("value", nameSpan.innerHTML);
	nameSpan.innerHTML="";
	nameSpan.appendChild(nameField);
	//年龄的编辑
	var ageSpan= allSpanTags.item(1);
	var ageField= document.createElement("input");
	ageField.setAttribute("type", "text");
	ageField.setAttribute("name", "age");
	ageField.setAttribute("value", ageSpan.innerHTML);
	ageSpan.innerHTML= "";
	ageSpan.appendChild(ageField);
	//性别的编辑
	var sexSpan= allSpanTags.item(2);
	maleRadio= document.createElement("input");
	maleRadio.setAttribute("type", "radio");
	maleRadio.setAttribute("name", "sex");
	maleRadio.setAttribute("value", "1");
	var maleText= document.createTextNode("男   ");
	var femaleRadio= document.createElement("input");
	femaleRadio.setAttribute("type", "radio");
	femaleRadio.setAttribute("name", "sex");
	femaleRadio.setAttribute("value", "0");
	var famaleText= document.createTextNode("女");
	if(sexSpan.innerHTML&&sexSpan.innerHTML=="男")
	    maleRadio.checked=true;
	else if(sexSpan.innerHTML)
		femaleRadio.checked=true;
	sexSpan.innerHTML="";
	sexSpan.appendChild(maleRadio);
	sexSpan.appendChild(maleText);
	sexSpan.appendChild(femaleRadio);
	sexSpan.appendChild(famaleText);
	//星座
	var conSpan= allSpanTags.item(3);
	var conSelect= document.createElement("select");
	conSelect.setAttribute("name", "constallation");
	for(var i=1; i<=12; i++) {
		var option= document.createElement("option");
		option.setAttribute("value", i);
		option.innerHTML= astroName[i];
		if(conSpan.innerHTML==astroName[i])
		   option.selected=true;
		conSelect.appendChild(option);
	}
	conSpan.innerHTML="";
	conSpan.appendChild(conSelect);
	//职业
	var profSpan= allSpanTags.item(4);
	var profField= document.createElement("input");
	profField.setAttribute("type", "text");
	profField.setAttribute("name", "profession");
	profField.setAttribute("value", profSpan.innerHTML);
	profSpan.innerHTML= "";
	profSpan.appendChild(profField);
	//籍贯
	var bPSpan= allSpanTags.item(5);
	var bpStr= bPSpan.innerHTML;
	bPSpan.innerHTML="";
	var province= document.createElement("select");
	province.setAttribute("name", "province");
	bPSpan.appendChild(province);
	//添加省份
	for(var i=0; i<provinces.length; i++) {
		var option= document.createElement("option");
		option.setAttribute("value", provinces[i]);
		option.innerHTML= provinces[i];
		if(provinces[i]==bpStr.split(" ")[0])
		   option.selected=true;
		province.appendChild(option);
	}
	//添加城市
	var citySelect= document.createElement("select");
	citySelect.setAttribute("name", "city");
	bPSpan.appendChild(citySelect);
	var citys= getCitysByProvince(bpStr.split(" ")[0]);
	for(var i=0; i<citys.length; i++) {
		var option= document.createElement("option");
		option.setAttribute("value", citys[i]);
		option.innerHTML= citys[i];
		if(citys[i]==bpStr.split(" ")[1])
		   option.selected=true;
		citySelect.appendChild(option);
	}
	province.onchange= function(){changeProvice(province, citySelect);} //当改变了省份时触发
	//Email
	var bPSpan= allSpanTags.item(6);
	var emailField= document.createElement("input");
	emailField.setAttribute("type", "text");
	emailField.setAttribute("name", "email");
	emailField.setAttribute("value", bPSpan.innerHTML);
	bPSpan.innerHTML="";
	bPSpan.appendChild(emailField);
	
	//更改编辑按钮去掉
	document.getElementById("edit_info_button").style.display="none";
	
	//显示保存更新的按钮
	var submitDiv= document.getElementById("edit_submit_div");
	var submitButton = document.createElement("input");
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("class", "custom_button");
	submitButton.setAttribute("value", "保存更改");
	var cancalButton= document.createElement("input");
	cancalButton.setAttribute("type", "button");
	cancalButton.setAttribute("class", "custom_button");
	cancalButton.setAttribute("value", "取消更改");
	cancalButton.onclick= function() {cancalEditInfo();};
	submitDiv.appendChild(submitButton);
	submitDiv.appendChild(cancalButton);
	submitDiv.style.display="block";
}

//编辑博客信息
function editBlogInfo() {
	var blogInfoDiv= document.getElementById("blog_info");
	var spanTags= blogInfoDiv.getElementsByTagName("span");
	//保存所有span中的数据
	for(var i=0; i<spanTags.length; i++)
		info_datas.push(spanTags.item(i).innerHTML);
	//空间说明
	var noteSpan= spanTags.item(0);
	var noteField= document.createElement("input");
	noteField.setAttribute("type", "text");
	noteField.setAttribute("name", "note");
	noteField.setAttribute("style", "width: 300px;");
	noteField.setAttribute("value", noteSpan.innerHTML);
	noteSpan.innerHTML="";
	noteSpan.appendChild(noteField);
	//签名档
	var signingSpan= spanTags.item(1);
	var signingField= document.createElement("textarea");
	signingField.setAttribute("name", "blog_signing");
	signingField.setAttribute("id", "blog_signing");
	signingField.innerHTML= signingSpan.innerHTML;
	signingSpan.innerHTML= "";
	signingSpan.appendChild(signingField);
}

//取消编辑的函数
function cancalEditInfo() {
	var baseInfoForm= document.getElementById("base_info_form");
	var allSpanTags= baseInfoForm.getElementsByTagName("span");
	//替换所有的数据信息
	for( var i=0; i<allSpanTags.length; i++)
		allSpanTags.item(i).innerHTML= info_datas[i];
	//去除丢保存与取消按钮
	document.getElementById("edit_submit_div").innerHTML="";
	//显示编辑按钮
	document.getElementById("edit_info_button").style.display="block";
}

//更改省份时将城市的改变也联动起来
function changeProvice(obj, citySelect) {
	//得到选中的省份
	var proviceId=obj.options[obj.selectedIndex].value;
	var citys= getCitysByProvince(provinces[proviceId]);
	citySelect.innerHTML="";
	for(var i=0; i<citys.length; i++) {
		var option= document.createElement("option");
		option.setAttribute("value", citys[i]);
		option.innerHTML= citys[i];
		citySelect.appendChild(option);
	}
}

//由省份来得到城市
function getCitysByProvince(province) {
	switch(province) {
		case "北京":
			return ["北京"];
			break;
		case "上海":
			return ["上海"];
			break;
		case "天津":
			return ["天津"];
			break;
		case "重庆":
			return ["重庆"];
			break;
		case "黑龙江":
		    return ["哈尔滨", "齐齐哈尔", "牡丹江", "佳木斯", "绥化", "黑河", "大兴安岭", "伊春", "大庆", "七台河", "鸡西", "鹤岗", "双鸭山"];
			break;
		case "吉林":
			return ["长春","吉林","延边","四平","通化","白城","辽源","松原","白山"];
			break;
		case "辽宁":
			return ["沈阳","大连","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","铁岭","朝阳","盘锦","葫芦岛"];
			break;
		case "内蒙古":
			return ["呼和浩特","包头","乌海","乌兰察布","通辽","赤峰","鄂尔多斯","巴彦淖尔","锡林郭勒","呼伦贝尔","兴安盟","阿拉善盟"];
			break;
		case "河北":
			return ["石家庄","保定","张家口","承德","唐山","廊坊","沧州","衡水","邢台","邯郸","秦皇岛"];
			break;
		case "山西":
			return ["太原","大同","阳泉","晋中","长治","晋城","临汾","运城","朔州","忻州","吕梁"];
			break;
		case "陕西":
			return ["西安","咸阳","延安","榆林","渭南","商洛","安康","汉中","宝鸡","铜川","杨凌"];
			break;
		case "山东":
			return ["济南","青岛","淄博","德州","烟台","潍坊","济宁","泰安","临沂","菏泽","滨州","东营","威海","枣庄","日照","莱芜","聊城"];
			break;
		case "新疆":
			return ["乌鲁木齐","克拉玛依","石河子","昌吉","吐鲁番","巴音郭楞","阿拉尔","阿克苏","喀什","伊犁","塔城","哈密","和田","阿勒泰","克州","博尔塔拉"];
			break;
		case "西藏":
			return ["拉萨","日喀则","山南","林芝","昌都","那曲","阿里"];
			break;
		case "青海":
			return ["西宁","海东","黄南","海南","果洛","玉树","海西","海北","格尔木"];
			break;
		case "甘肃":
			return ["兰州","定西","平凉","庆阳","武威","金昌","张掖","酒泉","天水","陇南","临夏","甘南","白银","嘉峪关"];
			break;
		case "宁夏":
			return ["银川","石嘴山","吴忠","固原","中卫"];
			break;
		case "河南":
			return ["郑州","安阳","新乡","许昌","平顶山","信阳","南阳","开封","洛阳","商丘","焦作","鹤壁","濮阳","周口","漯河","驻马店","三门峡","济源"];
			break;
		case "江苏":
			return ["南京","无锡","镇江","苏州","南通","扬州","盐城","徐州","淮安","连云港","常州","泰州","宿迁"];
			break;
		case "湖北":
			return ["武汉","襄阳","鄂州","孝感","黄冈","黄石","咸宁","荆州","宜昌","恩施","十堰","神农架","随州","荆门","天门","仙桃","潜江"];
			break;
		case "浙江":
			return ["杭州","湖州","嘉兴","宁波","绍兴","台州","温州","丽水","金华","衢州","舟山"];
			break;
		case "安徽":
			return ["合肥","蚌埠","芜湖","淮南","马鞍山","安庆","宿州","阜阳","亳州","黄山","滁州","淮北","铜陵","宣城","六安","巢湖","池州"];
			break;
		case "福建":
			return ["福州","厦门","宁德","莆田","泉州","漳州","龙岩","三明","南平"];
			break;
		case "江西":
			return ["南昌","九江","上饶","抚州","宜春","吉安","赣州","景德镇","萍乡","新余","鹰潭"];
			break;
		case "湖南":
			return ["长沙","湘潭","株洲","衡阳","郴州","常德","益阳","娄底","邵阳","岳阳","张家界","怀化","永州","湘西"];
			break;
		case "贵州":
			return ["贵阳","遵义","安顺","黔南","黔东南","铜仁","毕节","六盘水","黔西南"];
			break;
		case "四川":
			return ["成都","攀枝花","自贡","绵阳","南充","达州","遂宁","广安","巴中","泸州","宜宾",
					"内江","资阳","乐山","眉山","凉山","雅安","甘孜","阿坝","德阳","广元"];
			break;
		case "广东":
			return ["广州","韶关","惠州","梅州","汕头","深圳","珠海","佛山","肇庆","湛江","江门",
					"河源","清远","云浮","潮州","东莞","中山","阳江","揭阳","茂名","汕尾"];
			break;
		case "云南":
			return ["昆明","大理","红河","曲靖","保山","文山","玉溪","楚雄","普洱","昭通","临沧","怒江","迪庆","丽江","德宏","西双版纳"];
			break;
		case "广西":
			return ["南宁","崇左","柳州","来宾","桂林","梧州","贺州","贵港","玉林","百色","钦州","河池","北海","防城港"];
			break;
		case "海南":
			return ["海口","三亚","东方","临高","澄迈","儋州","昌江","白沙","琼中","定安","屯昌","琼海","文昌",
					"保亭","万宁","陵水","西沙","南沙岛","乐东","五指山"];
			break;
		case "香港":
			return ["香港"];
			break;
		case "澳门":
			return ["澳门"];
			break;
		case "台湾":
			return ["台北","高雄","台中"];
			break;
	}
}

var selectedTab=null;   //记录选中的选项卡
//显不一个修改图像的弹出框
function showEditHeadImage(url, change_url,image_type_values, image_type_texts) {
	//创建一个窗体
	var dialog= new Dialog({
		 width : 400,
		 height : 400,
		 title : "修改头像",
		 yesButton : "确定",
		 noButton : "取消",
		 buttonClick : function(){  //这个为单击确定钮后的函数,用于提交对话框的内容
                     //判断当前所选的选项卡
                     if(selectedTab==localTab) {    //本地上传选项卡
                         var fileField=document.getElementById("head_image_file");
                         if(fileField.value&&fileField.value.length!="") {
                             if(fileField.value.match(/\.(jpg|jpeg|gif|bmp|png)(\s|\?|$)/i)){
                                 var form=document.getElementById("upload_form");
                                 //提交表单
                                 form.submit();
                             }else {
                                 alert("无效的文件,只能接收格式为jpg、jpeg、gif、bmp和png的图片文件！");
                             }

                         }else {
                             alert("请选择一个上传图片！");
                         }
                     }else if(selectedTab==remoteTab) {  //相册选择选项卡
                         var hidden= document.getElementById("selected_image_url");
                         if(hidden&& hidden.value&&hidden.value.length!=0) {
                             //Ajax上传
                             var response=new Ajax.Request( url,
                                 {asynchronous:true,
                                  evalScripts:true,
                                  parameters: "image_id="+hidden.value
                                });
                             //如果提交成功则隐藏窗体
                             if(response.success())
                                 dialog.hide();
                         }else {
                             alert("请从相册中选择一个图片");
                         }
                     }
                }
	});
	//显示窗体
	dialog.show();
	//得到窗体的主体
	var bodyDiv= dialog.bodyDiv;
	bodyDiv.setAttribute("style", "font: 12px/1.5 'sans serif',tahoma,verdana,helvetica;");
	//添加一个选项卡
	var tabDiv= document.createElement("div");
	tabDiv.setAttribute("id", "tabNavi");
	tabDiv.setAttribute("class", "tab-navi");
	bodyDiv.appendChild(tabDiv);
	
	var tabUl= document.createElement("ul");
	tabUl.setAttribute("class", "clearfix");
	tabDiv.appendChild(tabUl);
	
	var localTab= document.createElement("li");
	localTab.innerHTML="上传照片";
	tabUl.appendChild(localTab);
	
	var remoteTab= document.createElement("li");
	remoteTab.innerHTML="相册中选择";
	tabUl.appendChild(remoteTab);
	
	//创建从本地上传选项卡体
	var localUploadDiv= document.createElement("div");
	localUploadDiv.setAttribute("id", "local_upload_div");
	bodyDiv.appendChild(localUploadDiv);
        //一个上传表单
	var editForm= document.createElement("form");
	editForm.action=url;
	editForm.method="post";
        editForm.setAttribute("id", "upload_form");
        editForm.setAttribute("encType", "multipart/form-data");
	editForm.onsubmit=function() {return false;};
	localUploadDiv.appendChild(editForm);

	var uploadp= document.createElement("p");
	editForm.appendChild(uploadp);
	var uploadField= document.createElement("input");
	uploadField.setAttribute("type", "file");
	uploadField.setAttribute("name", "head_image");
        uploadField.setAttribute("id", "head_image_file");
	uploadp.appendChild(uploadField);
	var noteLabel= document.createElement("label");
	noteLabel.innerHTML="(只能上传图片文件)";
	editForm.appendChild(noteLabel);
	
	//创建一个从相册中选择选项卡体
	var remoteChoiceDiv= document.createElement("div");
	remoteChoiceDiv.setAttribute("id", "remote_choice_div");
	bodyDiv.appendChild(remoteChoiceDiv);
        //提交的表单
        var submitForm= document.createElement("form");
        submitForm.setAttribute("method", "post");
        submitForm.setAttribute("id", "choice_from");
        submitForm.action=url
        remoteChoiceDiv.appendChild(submitForm);
	var choiceP=document.createElement("p");
	submitForm.appendChild(choiceP);
	var selectField= document.createElement("select");
	selectField.setAttribute("name", "image_type");
        selectField.onchange=function() {changeImageType(selectField, change_url);};
	choiceP.appendChild(selectField);
	var type_values= image_type_values.split(",");
	var type_texts= image_type_texts.split(",");
	for(var i=0; i<type_values.length; i++) {
		var option= document.createElement("option");
		option.setAttribute("value", type_values[i]);
		option.innerHTML= type_texts[i];
		selectField.appendChild(option);
	}
	//所有的图片显示div
	var photoDiv= document.createElement("div");
	photoDiv.setAttribute("id", "photo_div");
	submitForm.appendChild(photoDiv);
	//所有的图片用ul呈现出来
	var photoList= document.createElement("ul");
	photoList.setAttribute("id", "photo_list");
	photoDiv.appendChild(photoList);
	
        //添加一个保存选中的图片地址的隐藏域
        var selectedImage= document.createElement("input");
        selectedImage.setAttribute("type", "hidden");
        selectedImage.setAttribute("name", "selected_image_url");
        selectedImage.setAttribute("id", "selected_image_url");
        photoDiv.appendChild(selectedImage);
	
	//初始化时将选项卡设为localTab
	localTab.className="selected";
	remoteChoiceDiv.style.display= "none";
	selectedTab= localTab;
	//为这两个选项卡添加单击事件
	localTab.onclick= function(){changeTab(localTab, localUploadDiv, remoteChoiceDiv);};
	remoteTab.onclick= function(){changeTab(remoteTab, remoteChoiceDiv, localUploadDiv);};
}

//当改变选项卡时
function changeTab(triggerTab, tabBody, oldTab) {
	//当触发的选项卡不同时
	if(triggerTab!= selectedTab) {
		selectedTab.className="";
		triggerTab.className="selected";
		selectedTab= triggerTab;
		tabBody.style.display="block";
		oldTab.style.display="none";
	}
}

//当相册选项卡改变时调用
function changeImageType(selectField, change_url) {
    var id=selectField.options[selectField.selectedIndex].value;
    if(id!=-1) {
        new Ajax.Request( change_url,
                 {asynchronous:true,
                  evalScripts:true,
                  parameters: "id="+id
                });
    }
}

//为弹出对话框中的phote_list Div添加显示的图片
function showPhoteList(image_srcs) {
    var photoList= document.getElementById("photo_list");
    if(photoList) {
        //清除上一次的图片
        photoList.innerHTML="";
        //添加的图片
	var imageURLs=[];
        if(image_srcs&&image_srcs.length!=0)
            imageURLs=image_srcs.split(",");
	for(var i=0; i< imageURLs.length; i++) {
		var li=document.createElement("li");
		photoList.appendChild(li);
		var a=document.createElement("a");
		a.setAttribute("href", "#");
		a.onclick=function() {setSelectImage(this);return false;};
		li.appendChild(a);
		var image= document.createElement("img");
		image.src=imageURLs[i];
		a.appendChild(image);
	}
    }
}

//当单击一个li时则在form表单将保存选中图片地址的隐藏域更新
function setSelectImage(obj) {
    var image=obj.getElementsByTagName("img").item(0);
    var img_url= image.src
    var selectedField= document.getElementById("selected_image_url");
    img_url=img_url.replace(/.*\/(\d{1,})$/, "$1");
    try{
        if(img_url.match(/\d{1,}/))
            selectedField.setAttribute("value", img_url);
    }catch(e){}
}