class User < ActiveRecord::Base
  has_many :articles
  has_many :comments
  belongs_to :head_image, :class_name=>"Image", :foreign_key=>"header_image_id"
  has_one :user_info, :dependent=>:destroy

  #记录当前的登录用户
  def self.current=(user)
    @current_user = user
  end

  def self.current
    @current_user
  end

  #验证输入的帐户和密码
  def self.try_to_login(login, password)
    #确保密码不能为空
    return nil if password.to_s.empty?
    #由login来查找user对象
    user = first(:conditions => ["login = ?", login.to_s.downcase])
    if user
      #验证用户的密码
      return nil unless user.check_password?(password)
      #更新用户的最后登录时间
      user.last_login_time=Time.now
      user.save
      user
    end
  end


  #将用户的明码加密通过将明码转码,再与一个随机产生的salt相加再进行转码一资来得到
  def salt_password(clear_password)
    self.salt = User.generate_salt
    self.password = User.hash_password("#{salt}#{User.hash_password clear_password}")
  end
  
  # 检查用户的密码是否正确
  def check_password?(clear_password)
      User.hash_password("#{salt}#{User.hash_password clear_password}") == password
  end

  # 返回用户的的明码，通过加密后行成的哈西码
  def self.hash_password(clear_password)
    Digest::SHA1.hexdigest(clear_password || "")
  end

  # 随机产生一个salt数,用于加密密码
  def self.generate_salt
    ActiveSupport::SecureRandom.hex(16)
  end
end