class ImageType < ActiveRecord::Base
  has_many :images, :dependent=>:destroy
  #封面
  belongs_to :title_image, :class_name=>"Image", :foreign_key=>'title_image_id'

  #得到封面的图片对象
  def find_title_image
    #排除登录的用户
    return title_image ? title_image : (images.empty? ? Image.find(1): images[0]) if User.current
    #即图片的访问权限为"回答问题"
    if permission!=2
      if images&&!images.empty?
        title_image ? title_image : images[0]
      else
        Image.find(1)
      end
    else
      Image.find(2)
    end
  end

  #得到是否能显示此图片类型的图片
  def show_image_permission
    return 0 if User.current
    if permission!=2
      if images&&!images.empty?
        0
      else
        1   #当为空时
      end
    else
      2  #当为需在回答问题时
    end
  end

  #检查访问问题的答案的正确性
  def check_answer(access_answer)
    if access_answer==answer
      return true
    end
    return false
  end
end