class Image < ActiveRecord::Base
  belongs_to :image_type

  #上传的文件在服务器端上的目录路径
  cattr_accessor :storage_path
  @@storage_path = "#{RAILS_ROOT}/files"

  #这里由页面上提交的一个file表单对象来得到文件其它属性
  def file=(file_field)
    unless file_field.nil?
      @temp_file = file_field
      if @temp_file.size > 0
        self.filename = sanitize_filename(@temp_file.original_filename)
        self.disk_filename = Image.disk_filename(filename)
        self.content_type = @temp_file.content_type.to_s.chomp
        if content_type.blank?
          self.content_type = content_type_by_filename(filename)
        end
        self.filesize = @temp_file.size
      end
    end
  end

  #为Image对象设置file属性
  def file
    nil
  end

  #在保存image对象之前将上传的文件得到并保存在服务器上的目录中
  def before_save
    if @temp_file && (@temp_file.size > 0)
      #应用缓冲的方法得到文件的内容并将其保存
      File.open(diskfile, "wb") do |f|
        buffer = ""
        while (buffer = @temp_file.read(8192))
          f.write(buffer)
        end
      end
    end
    # Don't save the content type if it's longer than the authorized length
    if self.content_type && self.content_type.length > 255
      self.content_type = nil
    end
  end

  # 在删除数据库文件信息时将本地的文件也连带删除
  def after_destroy
    File.delete(diskfile) if !filename.blank? && File.exist?(diskfile)
  end

  #返回文件在服务端的地址
  def diskfile
    "#{@@storage_path}/#{self.disk_filename}"
  end

  #保存由文件域上传提交的文件
  def self.attach_files(file_field, description, author, image_type_id=1)
     image=Image.new(:description => description.to_s.strip,
                     :image_type_id=>image_type_id,                        #设置图片的类型
                     :author_id => author) if file_field&&file_field.size > 0   #这里的作者用于测试
     image.file= file_field
     image.save
     image
  end

  #得到文件的后缀名
  def filename_suffix
    m= self.filename.to_s.match(/(^|\.)([^\.]+)$/)
    m[2].downcase
  end
  
  private
  #规范filename
  def sanitize_filename(value)
    # get only the filename, not the whole path
    #将文件名中的\和/符号去掉
    just_filename = value.gsub(/^.*(\\|\/)/, '')
    # NOTE: File.basename doesn't work right with Windows paths on Unix
    # INCORRECT: just_filename = File.basename(value.gsub('\\\\', '/'))

    # Finally, replace all non alphanumeric, hyphens or periods with underscore
    @filename = just_filename.gsub(/[^\w\.\-]/,'_')
  end

  # Returns an ASCII or hashed filename
  # 返回一个由时ascii码与时间截组成的文件名
  def self.disk_filename(filename)
    #得到当前的时间截
    timestamp = DateTime.now.strftime("%y%m%d%H%M%S")
    ascii = ''
    if filename =~ %r{^[a-zA-Z0-9_\.\-]*$}
      ascii = filename
    else
      ascii = Digest::MD5.hexdigest(filename)
      # keep the extension if any
      ascii << $1 if filename =~ %r{(\.[a-zA-Z0-9]+)$}
    end
    #判断当前目录中是否存在生成的文件
    while File.exist?(File.join(@@storage_path, "#{timestamp}_#{ascii}"))
      #如果生成的文件名与目录中的文件相冲突则调用succ方法来去重
      timestamp.succ!
    end
    "#{timestamp}_#{ascii}"
  end

  #由filename来得到ContentType
  def content_type_by_filename(filename)
    m = filename.to_s.match(/(^|\.)([^\.]+)$/)
    case m[2].downcase
    when 'gif' then  return'image/gif'
    when 'jpg' , 'jpeg' ,'jpe' then return 'image/jpeg'
    when 'png' then return 'image/png'
    when 'tiff, tif'then return 'image/tiff'
    when  "bmp" then return "image/x-ms-bmp"
    when 'xpm' then return "image/x-xpixmap"
    end
  end

end
