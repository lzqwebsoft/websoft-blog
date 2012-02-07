class ArticleController < ApplicationController
  before_filter :find_all_article_types
  before_filter :find_all_drafts, :only=>[:index, :update_tab, :delete_type, :update_type, :create_type]
  before_filter :find_articles, :only=>[:index, :update_tab]
  before_filter :find_article_type_from_params, :only=>[:delete_type, :update_type]
  before_filter :find_article_from_params, :only=>[:show, :create_comment, :delete, :update, :delete_draft]
  before_filter :find_article_form_filter_conditions, :only=>[:filter_article]
  before_filter :find_commment_from_params, :only=>[:create_comment]

  include  ArticleHelper
  def index
    if User.current
      url=url_for(:conroller=>"article", :action=>'update_tab')
      @tabs = [{:name => 'list', :partial => 'article/list', :label => "我的文章", :url=>url},
        {:name => 'write', :partial => 'article/write', :label => "发表文章", :url=>url},
        {:name => 'type', :partial => 'article/article_types', :label => "分类管理", :url=>url},
        {:name => 'draft', :partial => 'article/draft_box', :label => "草稿箱", :url=>url}]
    else
      #当用户没有登录时则设其为空,从而只显示我的文章选项卡
      @tabs=[]
    end
  end

  #更新选项卡的内容
  def update_tab
    return if require_login
    tab_name=params[:tab_name]
    if tab_name=="list"
      render :update do |page|
        page.replace_html "tab-content-#{tab_name}", :partial=>"article/list"
      end
    elsif tab_name=="write"
      render :update do |page|
        page.replace "article_article_type_id", select_tag("article[article_type_id]", options_for_select(@article_types.collect { |article_type| [article_type.name, article_type.id] }), :id=>"article_article_type_id")
        page.replace "notice_info", "<p id='notice_info' style='display: none;'>&nbsp</p>"
      end
    elsif tab_name=="type"
      render :update do |page|
        page.replace_html "tab-content-#{tab_name}", :partial=>"article/article_types"
      end
    else
      render :update do |page|
        page.replace_html "tab-content-#{tab_name}", :partial=>"article/draft_box"
      end
    end
  end

  #创建文章
  def create
    return if require_login
    #检查是否这篇文章保存了已
    article= params[:article][:id]? Article.find(params[:article][:id]) : Article.new
    article.title=params[:article][:title]
    article.content=params[:article][:content]
    article.article_type=ArticleType.find(params[:article][:article_type_id]);
    article.author_id= User.current.id;        #当前用户
    article.status= params[:save_to_draft] ? 0 : 1;
    if article.save
      if params[:save_to_draft]
        redirect_to :controller=>"article", :action=>"index"
      else
        redirect_to  :controller=>"article", :action=>"show", :id=>article
      end
    end
  end

  #保存草稿
  def save_draft
    return if require_login
    @article= params[:id]? Article.find(params[:id]): Article.new
    @article.title=params[:article][:title]
    @article.content=params[:article][:content]
    @article.article_type=ArticleType.find(params[:article][:article_type_id]);
    @article.author_id= 1        #暂用于测试
    @article.status=0            #设置为保存的状态
    if @article.save
      @drafts=Article.find(:all, :conditions=>"status=0")  #更新草稿箱用于同步侧边框
      render :update do |page|
        #当保存了后则更改提交按钮来添加ID这个参数
        page.replace "save_to_draft", submit_to_remote('save_to_draft',"保存至草稿箱", :url=> { :controller=>"article" ,:action=>"save_draft", :id=>@article} ,:html=>{:id=>"save_to_draft"})
        page.replace "notice_info", "<p id='notice_info' style='color:#090; padding-left:10px; '>已保存 #{ @article.updated_at.strftime("%Y-%m-%d %H:%M:%S") }</p>"
        #添加hidden域来保存草稿文件的ID，从面避免当发表时产生一个新的文单对象
        page.insert_html :bottom, "create_article_form", hidden_field(:article, :id)
        #用于更新页面的侧边框数据
        page.replace_html "article_sidebar_div", :partial=>"sidebar"
      end
    end
  end

  #编辑文章
  def update
    return if require_login
    if request.post?
      @article.title=params[:article][:title]
      @article.content=params[:article][:content]
      @article.article_type=ArticleType.find(params[:article][:article_type_id])
      @article.status=1   #将状态设置为1，表示发表
      redirect_to(:controller=>"article", :action=>"show", :id=>@article) if @article.save
    end
  end

  #显示文章
  def show
    
  end

  #删除文章
  def delete
    return if require_login
    @article.destroy
    #只查找发表的文章，即状态为1
    @articles=Article.find(:all, :conditions=>{:status=>1})
    #更新侧边框
    @drafts=Article.find(:all, :conditions=>{:status=>0})
    render :update do |page|
      page.replace_html "aritcles_list_div", :partial=>'article_table', :layout=>false
      page.replace_html "article_sidebar_div", :partial=>"sidebar"
    end
  end

  #删除草稿
  def delete_draft
    return if require_login
    @article.destroy
    #只查找发表的文章，即状态为1
    @drafts=Article.find(:all, :conditions=>{:status=>0})
    render :update do |page|
      page.replace_html "tab-content-draft", :partial=>'draft_box', :layout=>false
      page.replace_html "article_sidebar_div", :partial=>"sidebar"
    end
  end

  #由给定的条件来查找文章
  def filter_article
    render :update do |page|
      page.replace_html 'aritcles_list_div', :partial=>'article_table'
    end
  end
  
  #创建一个评论
  def create_comment
    if @comment.save!
      render :partial=>'comments', :layout=>false
    end
  end

  #删除一个评论
  def delete_comment
    return if require_login
    if params[:id]&&!params[:id].blank?
      comment=Comment.find(params[:id]);
      @article=comment.article
      comment.destroy
      render :partial=>'comments', :layout=>false
    end
  end

  #添加一个子评论
  def create_subcomment
    #test=params
    if params[:id]
      #找到父评论
      parent_comment=RootComment.find(params[:id])
      if parent_comment
        subcomment=SubComment.new
        #找到回复的游客
        if (params[:reportName]&&params[:reportName].length!=0)
          subcomment.author=params[:reportName]
        else
          subcomment.author= '游客'
        end
        #设置关联的文章ID
        subcomment.article_id=parent_comment.article_id
        #判断提交的params不为空
        subcomment.content=params[:content]
        #设置它的父评论的ID
        subcomment.parent_id=parent_comment.id
        if subcomment.save!
          #用rjs的技术实现Ajax刷新页面
          render :update do |page|
            page.insert_html :bottom, "subcomments_#{parent_comment.id}", :partial=>"repcomment", :locals=>{:repcomment=>subcomment}
            #提交完成后调用createReportText方法，来回到"我来一句"的状态
            page.call "createReportText", 'reportCommentEdit'
          end
        end
      end
    end
  end

  #创建一个文章类型
  def create_type
    return if require_login
    article_type=ArticleType.new
    article_type.name=params[:article_type_name]
    if article_type.save!
      @article_types=ArticleType.find(:all)
      render :update do |page|
        page.replace_html "article_type", :partial=>"article_type_list"
        page.replace_html "article_sidebar_div", :partial=>"sidebar"
      end
    end
  end

  #更新一个文章类型
  def update_type
    return if require_login
    @article_type.name= params[:article_type_name] if params[:article_type_name]
    if @article_type.save
      @article_types=ArticleType.find(:all)
      render :update do |page|
        page.replace_html "article_type", :partial=>"article_type_list"
        page.replace_html "article_sidebar_div", :partial=>"sidebar"
      end
    end
  end

  #删除一个文章类型
  def delete_type
    return if require_login
    #将所有要删除的文章类型中的文单转入到first_type类型中
    @first_type=ArticleType.find(:first, :order=>"id")
    if @article_type && @article_type.id!=@first_type
      @article_type.articles.each do |article|
        article.article_type=@first_type
        article.save!
      end
      @article_type.destroy
      @article_types=ArticleType.find(:all)
      render :update do |page|
        page.replace_html "article_type", :partial=>"article_type_list"
        page.replace_html "article_sidebar_div", :partial=>"sidebar"
      end
    end
  end

  private
  def find_all_article_types
    @article_types=ArticleType.find(:all)
    #找到第一个type，使其不能被删除与编辑
    @first_type=ArticleType.find(:first, :order=>"id")
  end

  #找到由params中的类型ID来得到article_type
  def find_article_type_from_params
    @article_type=ArticleType.find(params[:id]) if params[:id]
  end

  #找到指定条件的文章
  def find_articles
    #得到过滤的条件
    retrieve_article_query
    @articles=@article_query.articles()
  end

  #查找所有保存在草稿箱中的文章
  def find_all_drafts
    @drafts=Article.find(:all, :conditions=>"status=0")
  end

  #由提交的ID来找到指定的文章
  def find_article_from_params
    @article=Article.find(params[:id])
  end

  def find_commment_from_params
    @comment=RootComment.new
    @comment.author=(params[:comment][:name]&&params[:comment][:name].length!=0) ? params[:comment][:name] : "游客"
    @comment.content=params[:comment][:content]
    @comment.article=@article
  end

  #从用户提交的过滤条件中得到articles对象集
  def find_article_form_filter_conditions
    if params[:f]
      article_query=ArticleQuery.new
      #将用户提交的过滤条件添加到article_query对象中
      article_query.add_filters(params[:f], params[:op], params[:v])
      #根据article_query来得到所有的文章集合
      @articles=article_query.articles()
    end
  end
end