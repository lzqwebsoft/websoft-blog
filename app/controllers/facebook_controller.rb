class FacebookController < ApplicationController
  before_filter :find_image_type_from_param, :only=>[:creat_type]
  
  def index
    #找出不为"仅自己"权制的相册
    @image_types= User.current.nil? ? ImageType.find(:all, :conditions=>["permission != ?", 1]) : ImageType.find(:all)
    #将所得的相册信息转换为数给形式
    @image_type_text=[]
    @image_type_value=[]
    @image_types.each do |image_type|
      @image_type_text << "#{image_type.name}"
      @image_type_value << "#{image_type.id}"
    end if @image_types&&!@image_types.empty?
  end

  #批量处理上传的文件
  def upload_files
    return if require_login
    image_type=nil
    if params[:image_type]  #当为选择类型上传
      image_type=ImageType.find(params[:image_type]);
    elsif params[:new_image_type]&&!params[:new_image_type].empty? #当为创建类型上传
      image_type=ImageType.new(:name=>params[:new_image_type], :permission=>0)
      image_type.save!
    end
    params[:images].each_with_index do |image, i|
      Image.attach_files(image[1], params[:descriptions][i.to_s]||"", User.current.id, image_type.id)
    end if params[:images]&&!params[:images].empty?
    #更新相册的时间
    image_type.update_attribute("updated_at", Time.now);
    redirect_to :action=>"index"
  end

  #设置为封面
  def set_image_title
    return if require_login
    if params[:id]
      image=Image.find(params[:id])
      image_type=image.image_type
      image_type.title_image= image
      image_type.save
    end
    redirect_to :action=>"index"
  end

  #删除图片
  def remove_image
    return if require_login
    image= Image.find(params[:id])
    if request.xhr?
      image_type= image.image_type
      image_types=ImageType.find(:all, :conditions=>"id!=#{image_type.id}")
      image_type_text=[]
      image_type_value=[]
      image_types.each do |type|
        image_type_text << type.name
        image_type_value << type.id
      end if image_types&&!image_types.empty?
      render :update do |page|
        page.call "createDeleteImageDialog", url_for(:action=>:remove_image), image.filename,
          image.id, image_type_value.join(","), image_type_text.join(",")
      end
    else
      if params[:delete_method_select]&&params[:delete_method_select]=="0"
        #为彻底删除时
        target_type=image.image_type
        image.destroy if image
      elsif params[:delete_method_select]
        #移动到其它相册时
        target_type= ImageType.find(params[:delete_method_select])
        image.image_type=target_type
        image.save
      end
      redirect_to :action=>:show_all, :id=>target_type
    end
  end

  #创建一个新的相册
  def creat_type
    return if require_login
    @image_type.save if @image_type
    redirect_to :action=>"index"
  end

  #更新一个相册
  def update_type
    return if require_login
    #判断是否为Ajax提交
    if request.xhr?
      image_type= ImageType.find(params[:id]);
      render :update do |page|
        page.call "showEditDialog", url_for(:action=>:update_type),
          image_type.id, image_type.name, image_type.permission, image_type.question, image_type.answer
      end
    else
      find_image_type_from_param
      @image_type.save!
      redirect_to :action=>"index"
    end
  end

  #删除一个相册
  def remove_type
    return if require_login
    #过滤掉博客用户与我的帖图的删除
    image_type= ImageType.find(params[:id]) if (params[:id]!="1"||params[:id]!="2");
    if request.xhr?
      image_types= ImageType.find(:all, :conditions=>"id!=#{image_type.id}");
      type_text=[]
      type_value=[]
      image_types.each do |type|
        type_text << type.name
        type_value << type.id
      end if image_types&&!image_types.empty?
      render :update do |page|
        page.call "showDeleteDialog", url_for(:action=>:remove_type), image_type.name,
          image_type.id, type_value.join(","), type_text.join(",")
      end
    else
      if params[:delete_method_select]&&params[:delete_method_select]=="0"
        #为彻底删除时
        image_type.destroy if image_type
      elsif params[:delete_method_select]
        images= image_type.images
        target_type= ImageType.find(params[:delete_method_select])
        images.each do |image|
          #更改图片的类型
          image.image_type=target_type
          image.save
        end if images&&!images.empty?
        #删除类型
        image_type.delete if image_type
      end
      redirect_to :action=>"index"
    end
  end

  #浏览的有的图片
  def show_all
    @image_type= ImageType.find(params[:id]);
    #当用此时的权限不为回答问题
    if User.current||@image_type.permission!=2
        @images=@image_type.images
    else
      flash[:error]="访问受限,请检查您的访问权限！";
      redirect_to :action=>:index
    end
  end

  #显示一个相册的问题
  def access_question
    image_type=ImageType.find(params[:id]) if params[:id]
    render :update do |page|
      page.call "show_answer_quesion", url_for(:action=>:check_access_answer, :id=>image_type), image_type.question
    end
  end

  #检验访问的合法性
  def check_access_answer
    @image_type=ImageType.find(params[:id]) if params[:id]
    #检查用户输入的答案
    if (@image_type.check_answer(params[:access_answer]))
      @images=@image_type.images
      render :action=>:show_all
    else
      #当输入的答案有问题时
      flash[:error]="访问受限，权限认证失败！"
      redirect_to :action=>:index
    end
  end
  private
  #从params中得到相册对象
  def find_image_type_from_param
    @image_type= params[:id] ? ImageType.find(params[:id]) : ImageType.new
    if params[:facebook_name]
      @image_type.name=params[:facebook_name]
      @image_type.permission=params[:permissions]||0
      #如果权限为2,说明为"回答问题"
      if params[:permissions]=="2"
        @image_type.question=params[:view_question]
        @image_type.answer=params[:view_answer]
      else
        @image_type.question=""
        @image_type.answer=""
      end
    end
  end
end
