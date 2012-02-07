function showTab(name, url) {
    //Ajax提交更新页面
    update_tab_content(url, name);
    var f = $$('div#content .tab-content');
	for(var i=0; i<f.length; i++){
		Element.hide(f[i]);
	}
    var f = $$('div.tabs a');
	for(var j=0; j<f.length; j++){
		Element.removeClassName(f[j], "selected");
	}
	Element.show('tab-content-' + name);
	Element.addClassName('tab-' + name, "selected");
	return false;
}
function displayTabsButtons() {
	var lis;
	var tabsWidth = 0;
	var i;
	$$('div.tabs').each(function(el) {
		lis = el.down('ul').childElements();
		for (i=0; i<lis.length; i++) {
			if (lis[i].visible()) {
				tabsWidth += lis[i].getWidth() + 6;
			}
		}
		if ((tabsWidth < el.getWidth() - 60) && (lis[0].visible())) {
			//el.down('div.tabs-buttons').hide();
		} else {
			//el.down('div.tabs-buttons').show();
		}
	});
}

//显示过滤器的选项
function toggleFieldset(el) {
    var fieldset = Element.up(el, 'fieldset');
    fieldset.toggleClassName('collapsed');
    Effect.toggle(fieldset.down('div'), 'slide', {duration:0.2});
}

//隐藏过滤器的选项
function hideFieldset(el) {
    var fieldset = Element.up(el, 'fieldset');
    fieldset.toggleClassName('collapsed');
    fieldset.down('div').hide();
}

//Ajax提交通知过滤表单
function report_filter_condictions(form_id ,url){
  try{
    obj=document.getElementById(form_id)
    new Ajax.Request(url,
                         {asynchronous:true,
                          evalScripts:true,
                          parameters: Form.serialize(obj)
                        });
  }catch(e){
    alert(e);
  }
  return false;
}

//删除左右两端的空格
function trim(str)
{
	return str.replace(/(^[\s]*)|([\s]*$)/g,"");
}

//Ajax提交得到选项卡的更新内容
function update_tab_content(url, name){
    new Ajax.Request(url,
                         {asynchronous:true,
                          evalScripts:true,
                          parameters: 'tab_name='+name
                        });
}

/*
 * 1 - registers a callback which copies the csrf token into the
 * X-CSRF-Token header with each ajax request.  Necessary to
 * work with rails applications which have fixed
 * CVE-2011-0447
 * 2 - shows and hides ajax indicator
 * 显示AJAX提交的加载条
 */
Ajax.Responders.register({
    onCreate: function(request){
        var csrf_meta_tag = $$('meta[name=csrf-token]')[0];

        if (csrf_meta_tag) {
            var header = 'X-CSRF-Token',
                token = csrf_meta_tag.readAttribute('content');

            if (!request.options.requestHeaders) {
              request.options.requestHeaders = {};
            }
            request.options.requestHeaders[header] = token;
          }

        if ($('ajax-indicator') && Ajax.activeRequestCount > 0) {
            Element.show('ajax-indicator');
        }
    },
    onComplete: function(){
        if ($('ajax-indicator') && Ajax.activeRequestCount == 0) {
            Element.hide('ajax-indicator');
        }
    }
});