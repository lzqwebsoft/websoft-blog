//创建一个回复评论的对话框
function createCommentForm(parent, textarea_id, text_id, after_blur_function)
{
	var textarea=document.createElement("textarea");
	textarea.setAttribute("cols", "60");
	textarea.setAttribute("id", textarea_id);
	textarea.setAttribute("name", "content");
	textarea.setAttribute("rows", "2");
	textarea.onkeyup= function(){if(this.value.lenght>120) this.value=this.value.substr(0,120);};
	textarea.onkeydown= function(){if(this.value.lenght>120) this.value=this.value.substr(0,120);};
	textarea.onfocus= null;

	clearAllNode(parent);
	parent.appendChild(textarea);

	var label=document.createTextNode("昵称: ");
	parent.appendChild(label);

	var text=document.createElement("input");
	text.setAttribute("type", "text");
	text.setAttribute("style", "border:#BBB 1px solid; color: #000; width:100px; margin-right: 10px; ");
	text.setAttribute("name", text_id);
	text.setAttribute("id", text_id);
	parent.appendChild(text);

	var send= document.createElement("input");
	send.setAttribute("type", "submit");
	send.setAttribute("value", "发表");
	send.setAttribute("style", "border:#BBB 1px outset; color:#000;");
	parent.appendChild(send);

        KE.init({id : textarea_id,
			resizeMode: 0,
			height: 60 ,
			items: ['emoticons'],
			toolbarLineHeight : 13,
			skinType: 'custom',
			afterBlur: function(){after_blur_function(textarea_id)}
			});
	KE.create(textarea_id);
        //KE.focus(textarea_id);
}

//创建一个"我也来一句..."的输入文本框
function createReportText(edit_id)
{
    var parent= document.getElementById(edit_id).parentNode;
    var input=document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("size", "60");
    input.setAttribute("value","我也来一句...");
    input.onblur= null;
    input.onfocus=function(){reportCommentFocus(this)};
    KE.remove(edit_id);
    clearAllNode(parent);
    parent.appendChild(input);
}

//当输入框获得焦点时
function reportCommentFocus(obj)
{
        //当存在编辑器时则将其删除，再重新建一个
        var kindEdit=document.getElementById("reportCommentEdit");
        if(kindEdit!=null)
        {
            if(!KE.isEmpty("reportCommentEdit"))  //当其它的编辑器不为空时
            {
                if(confirm("您确定放弃正在编辑的评论吗？"))
                    createReportText("reportCommentEdit");
                else
                {
                    KE.focus("reportCommentEdit");
                    return;
                }
            }
            else
                createReportText("reportCommentEdit");
        }
	var root_parent= obj.parentNode;
	createCommentForm(root_parent, 'reportCommentEdit', 'reportName', reportCommentonBlur);
}

//当输入框失去了焦点
function reportCommentonBlur(edit_id)
{
    if(KE.isEmpty(edit_id))
	createReportText(edit_id);
}

//回复当前的评论,这里的ID表示为父评论的ID
function reportComment(obj, url)
{
	var commentText=obj.parentNode.parentNode.parentNode;
	var form=commentText.getElementsByTagName("form");
	//如果当前commentText下无form表单则说明没有输入接口
	if(form.length==0)
	{
		var repcomment=document.createElement("div");
		repcomment.setAttribute("class", "repcomment");
		commentText.appendChild(repcomment);

		form=document.createElement("form");
		form.setAttribute("action", url);
		form.setAttribute("method", "post");
                form.setAttribute("onsubmit",
                                  "return resport_report_subcomment(this, \""+url+"\");");
		repcomment.appendChild(form);

		createCommentForm(form, 'reportCommentEdit', 'reportName', reportCommentonBlur2);
	}
	else if(form.length==1)
	{

                //当存在编辑器时则将其删除，再重新建一个
                var kindEdit=document.getElementById("reportCommentEdit")
                if(kindEdit!=null)
                {
                    var kindEditParent=kindEdit.parentNode.parentNode.parentNode;
                    //当id不相等，就表示这个为跨DIV回复评论，故要确定是否放弃原来的内容
                    if(kindEditParent.getAttribute("id")!=commentText.getAttribute("id"))
                    {
                        if(!KE.isEmpty("reportCommentEdit"))  //当其它的编辑器不为空时
                        {
                            if(confirm("您确定放弃正在编辑的评论吗？"))
                                createReportText("reportCommentEdit");
                            else
                            {
                                KE.focus("reportCommentEdit");
                                return;
                            }
                        }
                        else
                            createReportText("reportCommentEdit");
                    }
                    else   //当为相同的DIV评论时，则什么也不做
                        return;
                }
                //新建一个编辑器
                clearAllNode(form.item(0));
		createCommentForm(form.item(0), 'reportCommentEdit', 'reportName', reportCommentonBlur);
	}
}

////Ajax提交子评论
function resport_report_subcomment(obj, url) {
  try{
         KE.sync("reportCommentEdit");     //将编辑器中的内容转到textarea中
         new Ajax.Request(url,
                         {asynchronous:true,
                          evalScripts:true,
                          parameters: Form.serialize(obj)
                        });
     }catch(e){
         alert(e.toString())
        return false;
     }
     return false;
}
//失去了焦点
function reportCommentonBlur2(redit_Id)
{
	if(KE.isEmpty(redit_Id))
	{
		var parent= document.getElementById(redit_Id).parentNode.parentNode;
                KE.remove(redit_Id);
		clearAllNode(parent);
		var grandparent=parent.parentNode;
		grandparent.removeChild(parent);
	}
}

//删除所有的子结点
function clearAllNode(parentNode)
{
	while (parentNode.hasChildNodes())
	{
		var oldNode = parentNode.removeChild(parentNode.firstChild);
		oldNode = null;
	}
}

//验证提交的子评论内容是否合法
function validateSubComments(str)
{
    if(KE.isEmpty("reportCommentEdit"))
    {
        alert(str);
        return false;
    }
    return true;
}