#记录此博客的作者信息
class UserInfo < ActiveRecord::Base
  belongs_to :user

  #由出生年月来返回年龄
  def age
    (Date.today.year-self.birthday.year).to_i
  end

  #设置年龄
  def age=(age)
    self.birthday=(Time.mktime(Date.today().year-age)).end_of_day
  end

  #得到故乡
  def hometown
    "#{self.province} #{self.city}"
  end

  #星座
  def astrolabe=(num)
    astro_name = ['白羊座',  '金牛座',  '双子座', '巨蟹座', '狮子座', '处女座', '天秤座',
                 '天蝎座', '射手座', '魔羯座', '水瓶座', '双鱼座'];
    self.constellation= astro_name[(num.to_i-1)]
  end
end