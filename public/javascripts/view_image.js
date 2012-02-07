//创建一个删除图片的对话框
function createDeleteImageDialog(url, image_name, image_id, image_type_value, image_type_text){
    lockedWindows();      //锁住屏幕

    var type_value= image_type_value.split(",");
    var type_text= image_type_text.split(",");
    var deleteDialog= creatDialogFramework("删除图片", 300, 100);
    //对话框的主体
    var formDiv= document.createElement("div");
    formDiv.setAttribute("class", "dialog_content");
    deleteDialog.appendChild(formDiv);

    var formTag= document.createElement("form");
    formTag.setAttribute("action", url);
    formTag.setAttribute("method", "post");
    formTag.setAttribute("id", "delete_image_form");
    formDiv.appendChild(formTag);

    //相册名称
    var nameField= document.createElement("p");
    formTag.appendChild(nameField);
    var nameLabel= document.createElement("label");
    nameLabel.innerHTML= "图片名称";
    nameField.appendChild(nameLabel);
    var nameText= document.createElement("span");
    nameText.innerHTML=image_name;
    nameField.appendChild(nameText);
    var nameHidden= document.createElement("input");
    nameHidden.setAttribute("name", "id");
    nameHidden.setAttribute("type", "hidden");
    nameHidden.setAttribute("value", image_id);
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

