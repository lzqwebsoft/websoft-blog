module HomeHelper

  #显示最新的文章
  def show_latest_article(list, options={})
    links=[]
    list.collect do |li|
      url= url_for :controller=>options[:controller], :action=>options[:action], :id=>li
      links << content_tag("li", "#{link_to( li.title, url)}   (#{li.comment_counts})")
    end if list&&list.is_a?(Array)&&!list.empty?
    if links&&!links.empty?
      content_tag("ul", links.join("\n"))
    end
  end

  #显示最新的留言
  def show_latest_message(messages)
    links=[]
    messages.collect do |message|
      links << content_tag("li", "<font color='#2A5685'>#{message.author}</font>:  #{message.content.gsub(/<.*?>/, '')}")
    end if messages&&messages.is_a?(Array)&&!messages.empty?
    if links&&!links.empty?
      content_tag("ul", links.join("\n"))
    end
  end
end
