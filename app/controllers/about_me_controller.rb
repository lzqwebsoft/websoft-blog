class AboutMeController < ApplicationController
  
  def index
    #找到管理员
    @blog_author= User.find(1)
    #找到所有的相册,这样当弹出修改头像对话框时能列举出所有的相册
    image_types= ImageType.find(:all);
    @type_values=["-1"]
    @type_texts=["请选择相册"]
    image_types.each do |type|
      @type_values << type.id
      @type_texts << type.name
    end if image_types&&!image_types.empty?
  end

  #更新博主的信息
  def update
    return if require_login
    #得到需要更新的数据
    @blog_author= User.find(params[:id])
    @blog_author.sex= params[:sex] if params[:sex]
    @blog_author.email= params[:email] if params[:email]
    @blog_author.name= params[:username] if params[:username]
    @author_info= @blog_author.user_info
    @author_info.age= params[:age].to_i if params[:age]
    @author_info.province= params[:province] if params[:province]
    @author_info.city= params[:city] if params[:city]
    @author_info.profession= params[:profession] if params[:profession]
    @author_info.astrolabe= params[:constallation] if params[:constallation]
    @author_info.zone_message= params[:note] if params[:note]
    @author_info.signature= params[:blog_signing] if params[:blog_signing]
    #更新到数据库
    @blog_author.save
    @author_info.save
    redirect_to :action=>'index'
  end

  #当改变相册时调用,用于查找对应的图片集
  def change_type
    return if require_login
     image_type= ImageType.find(params[:id]) if params[:id]
     images= image_type.images;
     @image_srcs= [];
     images.each do |image|
       @image_srcs << "#{url_for(:controller=>"image", :action=>"show", :id=>image)}"
     end if images&&!images.empty?
     render :update do |page|
       page.call "showPhoteList", @image_srcs.join(",")
     end
  end

  #修改头像
  def update_head
    return if require_login
    unless request.xhr?
      @blog_author= User.find(params[:id]|| 1);
      image=Image.attach_files(params[:head_image], "", User.current.id, 2)  #上传头像图片，默认设为我的帖图相册中
      @blog_author.head_image=image
      @blog_author.save
      redirect_to :action=>'index'
    else
      @blog_author= User.find(params[:id]|| 1);
      if params[:image_id]
        head_image= Image.find(params[:image_id])
        @blog_author.head_image= head_image
        @blog_author.save
      end
      #找到所有的相册,这样当弹出修改头像对话框时能列举出所有的相册
      image_types= ImageType.find(:all);
      @type_values=["-1"]
      @type_texts=["请选择相册"]
      image_types.each do |type|
        @type_values << type.id
        @type_texts << type.name
      end if image_types&&!image_types.empty?
      render :update do |page|
        page.replace_html "head_image_div", :partial=>"head_image"
      end
    end
  end
end