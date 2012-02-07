//添加新的类型
function add_new_article_type(url)
{
	var type_item=document.createElement("div");
	type_item.setAttribute("class", "article_type_item");
	var ul=document.createElement("ul");
	type_item.appendChild(ul);

	var type_li=document.createElement("li");
	type_li.setAttribute("class", "article_type_name_item");
	type_li.style.marginTop="5px";
	ul.appendChild(type_li);

	var form=document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "#");
	type_li.appendChild(form);

	var type_name=document.createElement("input");
	type_name.setAttribute("type", "input");
	form.appendChild(type_name);

	var type_li_cancel=document.createElement("li");
	type_li_cancel.setAttribute("class", "article_type_item_cancel");
	ul.appendChild(type_li_cancel);
	var type_cancel=document.createElement("a");
	type_cancel.setAttribute("href", "#");
	var cancel_text=document.createTextNode("取消");
	type_cancel.appendChild(cancel_text);
	type_li_cancel.appendChild(type_cancel);

	var type_saved=document.createElement("a");
	type_saved.setAttribute("href", url);
        type_saved.onclick=function(){return atrr_article_type(type_name, url);};
	var save_text=document.createTextNode("保存");
	type_saved.appendChild(save_text);
	var type_li_saved=document.createElement("li");
	type_li_saved.setAttribute("class", "article_type_item_save");
	ul.appendChild(type_li_saved);
	type_li_saved.appendChild(type_saved);

        var article_type= document.getElementById("article_type");
	type_cancel.onclick=function(){cancel_add_type(article_type, type_item)};
	article_type.appendChild(type_item);
}

//取消添加新类型
function cancel_add_type(parentNode, childNode)
{
	parentNode.removeChild(childNode);
}

//编辑类型
function edit_article_type(aritcle_item, url_delete, url_update)
{
	var ul= aritcle_item.parentNode.parentNode;
	var all_li= ul.getElementsByTagName("LI");
	var type_txt=all_li.item(0).innerHTML;

	//由输入文本框来代替文本
	all_li.item(0).style.marginTop="5px";

	var form=document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "#");
	all_li.item(0).innerHTML= "";
	all_li.item(0).appendChild(form);

	var type_name=document.createElement("input");
	type_name.setAttribute("type", "input");
	type_name.setAttribute("value", type_txt);
	form.appendChild(type_name);

	type_name.focus();
	type_name.select();

	//取消的链接
	var delete_link=all_li.item(1).getElementsByTagName("a").item(0);
        var cancel_link=document.createElement("a");
        cancel_link.setAttribute("href", "#");
	cancel_link.innerHTML="取消";
	cancel_link.onclick=function(){cancel_edit_type(ul, type_txt, this, url_delete, url_update); return false;}
        all_li.item(1).replaceChild(cancel_link, delete_link)

	//保存的链接
	var save_link=aritcle_item;
        var update_link=document.createElement("a")
	update_link.onclick= function() {return atrr_article_type(type_name, url_update);};
        update_link.setAttribute("href", url_update);
	update_link.innerHTML="保存";
        all_li.item(2).replaceChild(update_link, save_link);
}

//取消类型编辑
function cancel_edit_type(ul, type_txt, obj, url_delete, url_update)
{
	var all_li= ul.getElementsByTagName("LI");
	all_li.item(0).style.marginTop="8px";
	all_li.item(0).innerHTML=type_txt;

	obj.onclick= function(){return delete_article_type(url_delete)};
        obj.setAttribute("href", url_delete);
	obj.innerHTML="删除"

	var edit_link=all_li.item(2).getElementsByTagName("a").item(0);
        edit_link.setAttribute("href", "#");
        edit_link.onclick= function(){return false};
	edit_link.innerHTML= "编辑";
	edit_link.onclick=function() {edit_article_type(this, url_delete, url_update); return false;};
}

//Ajax更新或创建一个新的类型
function atrr_article_type(obj, url)
{
	if(obj.value!=null && trim(obj.value)!= ""){
            new Ajax.Request(url,
                         {asynchronous:true,
                          evalScripts:true,
                          parameters: "article_type_name="+obj.value
                        });
            var li_node=obj.parentNode.parentNode.parentNode.parentNode;
            var parent_node=li_node.parentNode;
            cancel_add_type(parent_node, li_node);
        }
        else
            alert("提交失败:类型名不能为空！");
        return false;

}

//Ajax删除一个类型
function delete_article_type(url)
{
	if(confirm("您确定要删除此类型？"))
	   new Ajax.Request(url, {asynchronous:true, evalScripts:true} );
        return false;
}