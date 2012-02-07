class ImageController < ApplicationController
  before_filter :find_image_by_param, :only=>[:show]

  #处理文件的上传
  def upload
    #这里的设置图片类型为"博客用图"
    @image=Image.attach_files(params[:imgFile], params[:imgTitle], User.current.id, 1)
    if @image
      render :text => {"error" => 0, "url" => "#{url_for :controller=>"image", :action=>"show", :id=>@image}" }.to_json
    else
      render  :text => {"error" => 1}
    end
  end

  #显示图片
  def show
    data=File.new(@image.diskfile, "rb").read
    send_data(data, :filename=>@image.filename,
      :type=>@image.content_type, :disposition => "inline")
  end

  #显示所有上传的图片
  def show_image_list
    @images=Image.find(:all, :conditions=>"image_type_id <> '' ")
    @json=[]
    @images.each do |image|
      temp= %Q/{
            "filesize" : "#{image.filesize}",
            "filename" : "#{image.filename}",
            "dir_path" : "#{url_for :controller=>"image", :action=>"show", :id=>image}.#{image.filename_suffix}",
            "datetime" : "#{image.created_on.strftime("%Y-%m-%d %H:%M")}"
      }/
      @json << temp
    end
    render :text => ("{\"file_list\":[" << @json.join(", ") << "]}")
  end

  private
  def find_image_by_param
    @image=Image.find(params[:id]) if  params[:id]
  end
end