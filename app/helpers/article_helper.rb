module ArticleHelper  
  #确定文章查询类
  def retrieve_article_query
    @article_query=ArticleQuery.new
    #由URL的GET请求参数来得到过滤的条件
    @article_query.available_filters.each do |filter|
       if params[filter[0]]
         case filter[0]
         when :article_type_id then @article_query.add_filter(filter[0], "=", params[filter[0]].to_i.to_a)
         when :title then @article_query.add_filter(filter[0], "contain", params[filter[0]].to_a)
         when :updated_at then  @article_query.add_filter(filter[0], "=t", params[filter[0]].to_a)
         end
       end
    end
    
  end

  #由类型来判断查询的操作符
  def operators_for_select(type)
    ArticleQuery.operators_by_filter_type[type.to_s].collect { |operator| [ ArticleQuery.operators[operator], operator ] }
  end

  #显示所有的分类
  def show_article_type(types, drafts)
    links=[]
    types.collect do |type|
      links << content_tag("li", "#{link_to(type.name, :controller=>"article", :action=>"index", :article_type_id=>type.id)}   (#{type.articles.find(:all, :conditions=>"status=1").length})")
    end if types&&types.is_a?(Array)&&!types.empty?
    links << content_tag("li", "<font color='#2A5685'>草稿箱</font>  (#{drafts.length})") if drafts
    if links&&!links.empty?
      content_tag("ul", links.join("\n"))
    end
  end
end