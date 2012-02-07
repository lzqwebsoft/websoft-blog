# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  #设置每个页页的标题
  def html_title(*args)
    if args.empty?
      title = []
      title << @project.name if @project
      title += @html_title if @html_title
      title.select {|t| !t.blank? }.join(' - ')
    else
      @html_title ||= []
      @html_title += args
    end
  end

  #产生一个网页日历
  def calendar_for(language)
    include_calendar_headers_tags(language)
    content_tag(:div, "",{:id=>"calendar-container"}) +
    content_tag(:div, "", {:id=>"calendar-info", :style=>"text-align: center; margin-top: 0.3em"}) +
    javascript_tag("Calendar.setup({ cont : 'calendar-container', weekNumbers : true, selectionType : Calendar.SEL_MULTIPLE, selection : Calendar.dateToInt(new Date()), showTime : 12,
                onSelect : function() {
                      var count = this.selection.countDays();
                      if (count == 1) {
                              var date = this.selection.get()[0];
                              date = Calendar.intToDate(date);
                              date = Calendar.printDate(date, '%Y, %B %d ,%A');
                              $('calendar-info').innerHTML = date;
                      } else {
                              $('calendar-info').innerHTML = Calendar.formatString('${count: 没有|1 个|2 个|# 个} 日期被选择', { count: count } );
                      }
               }, onTimeChange  : function(cal) {
                      var h = cal.getHours(), m = cal.getMinutes();
                      if (h < 10) h = '0' + h;
                      if (m < 10) m = '0' + m;
                      $('calendar-info').innerHTML = Calendar.formatString('Time changed to ${hh}:${mm}', { hh: h, mm: m });
              }});")
  end
  def include_calendar_headers_tags(language)
    #这个header_tags指的是layout布局模板中定义的一个yield的块
    content_for :header_tags do
      javascript_include_tag('calendar/jscal2.js') +
      javascript_include_tag("calendar/lang/#{language.to_s.downcase}.js") +
      stylesheet_link_tag('calendar/jscal2') +
      stylesheet_link_tag('calendar/border-radius') +
      stylesheet_link_tag('calendar/steel/steel')
    end
  end

  #产生一个文本编辑器
  def edit_textarea_for(id, option= {} )
    default_opts={:skinType=>"'default'", :resizeMode=> 0, :minWidth=>200, :minHeight=> 100, :width=>200, :height=> 100}
    default_opts.merge!(option)
    items = option[:items] || "[ 'source', '|', 'fullscreen', 'undo', 'redo', 
		                             '|','title', 'fontname', 'fontsize', 'textcolor', 'bgcolor', '|','bold', 'italic', 'underline', 'strikethrough',
                                 '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', '|', 'insertorderedlist', 'insertunorderedlist',
                                 'indent', 'outdent', 'subscript', 'superscript', 'removeformat', '|', 'selectall', 'about', '-',
                                 'print', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|','code', 'image',
                                 'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink']"
    setting_params="skinType : #{default_opts[:skinType]}, resizeMode : #{default_opts[:resizeMode]}, minWidth : #{default_opts[:minWidth]},
                    minHeight : #{default_opts[:minHeight]}, width : #{default_opts[:width]}, height: #{default_opts[:height]}, items : #{items}"
    #设置图片上传的路径
    if default_opts[:imageUploadJson]
       setting_params << ", imageUploadJson : '#{default_opts[:imageUploadJson]}'"
    end
    #设置远程图片管理的路径
    if default_opts[:fileManagerJson]
      setting_params << ", fileManagerJson : '#{default_opts[:fileManagerJson]}', allowFileManager : true"
    end
    content_tag(:textarea, "#{default_opts[:values]}", {:id=>"#{id}", :name=>"#{id}",:style=>"width:#{option[:width]}px;height:#{option[:height]}px;"}) +
    javascript_include_tag("kindeditor/kindeditor.js") +
    javascript_tag("
      //添加插入源代码插件
      KE.lang['code']='插入源代码';
      //编写插入源代码的事件处理
      KE.plugin['code'] = {click : function(id) {
         KE.util.selection(id);
         //创建一个对话框
         var dialog = new KE.dialog({
            id : id,
            cmd : 'code',
            file : 'code.html',
            width : 330,
            height : 220,
            title : '插入源代码',
            //loadingMode : true,
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        //显示对话框
        dialog.show();
      },
      exec : function(id) {
					KE.util.select(id);
					var iframeDoc = KE.g[id].iframeDoc;
					var dialogDoc = KE.util.getIframeDoc(KE.g[id].dialog);
					//if (!this.check(id)) return false;
					//得到选中的语言
					var language= KE.$('language', dialogDoc).options[KE.$('language', dialogDoc).options.selectedIndex].value;
					//得到插入的源码
					var sourceCode = KE.$('sourceCode', dialogDoc).value;
					this.insert(id, language, sourceCode);
				},
        insert : function(id, language, sourceCode) {
          var html='<pre class=\"brush: '+language+'; toolbar: true;\">';
          html+=sourceCode+'</pre><br />';
					KE.util.insertHtml(id, html);
					KE.layout.hide(id);
					KE.util.focus(id);
				}};
      KE.show({id : '#{id}', #{setting_params} });")
  end

  #这个为显示的一个选项卡
  def render_tabs(tabs)
    if tabs.any?
      render :partial => 'common/tabs', :locals => {:tabs => tabs}
    else
      render :partial => 'article/list'
    end
  end

  #增加一个预览的页面
  def preview_text_for
    content_for :header_tags do
      javascript_include_tag('preview.js')+
      stylesheet_link_tag('preview.css')
    end
    render :partial => 'common/preview'
  end

  #由当前的用户来得到显示的菜单
  def render_main_menu()
    #定义的菜单选项数组
    main_menu=[{:text=>'首页', :controller=>"home", :action=>"index"},
               {:text=>'博客', :controller=>'article', :action=>'index'},
               {:text=>'留言板', :controller=>"message", :action=>'index'},
               {:text=>'相册', :controller=>"facebook", :action=>'index'},
               {:text=>'关于我', :controller=>"about_me", :action=>'index'}]
    links=[]
    #其中的controller_name方法得到的是当前请求中的controller名字
    main_menu.collect do |item|
      links << content_tag('li', render_single_menu_node(item[:text], item[:controller], item[:action], controller_name==item[:controller]))
    end
    if links&&links.length!=0
      content_tag('ul', links.join("\n"))
    end
  end

  def render_single_menu_node(text, controller, action, selected)
    option={}
    option[:class]="selected" if selected
    link_to(text, {:controller=> controller, :action=>action}, option)
  end

  #产生一个输出flash的div提示信息框
  def render_flash_messages
    s = ''
    flash.each do |k,v|
      s << content_tag('div', v, :class => "flash #{k}")
    end
    s
  end
end
