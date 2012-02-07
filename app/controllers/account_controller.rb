class AccountController < ApplicationController
  def login
    if request.get?
      
    else
      #验证用户的登录
      user=User.try_to_login(params[:username], params[:password])
      unless user
        flash.now[:error] = "无效的用户名或密码"
      else
        #保存登录用户
        self.logined_user = user
        redirect_back_or_default :controller=>"home", :action=>"index"
      end
    end
  end

  def logout
    if User.current
      self.logined_user = nil
    end
    redirect_to :controller=>"home", :action=>"index"
  end

  #用户的帐户信息
  def my
    return if require_login
    if request.get?
      @user=User.current
    else
      @user= User.current
      @user.name=params[:user][:name]
      @user.email=params[:user][:email]
      @user.pwd_question= params[:user][:pwd_question]
      @user.pwd_answer= params[:user][:pwd_answer]
      if @user.save!
        flash[:notice]="帐户信息更新成功！"
        redirect_to :action=>"my"
      end
    end
  end

  #修改帐户的密码
  def password
    return if require_login
    if request.get?
      @user= User.current
    else
      #检查用户输入的合法性
      if check_update_password?
        @user= User.current
        #验证用户的旧密码输入是否正确
        if @user.check_password?(params[:password])
          @user.salt_password(params[:new_password])
          if @user.save
            flash[:notice]="密码更新成功"
            redirect_to :action=>"my"
          end
        else
          flash[:error]="密码错误"
        end
      end
    end
  end

  private
  #将当前登录的用户的user_id保存在session中
  def logined_user=(user)
    #清除session原先的储存的对象,并初始化一个新对象
    reset_session unless session.empty?
    if user && user.is_a?(User)
      User.current = user
      session[:user_id] = user.id
    else
      User.current = nil
    end
  end

  #检证用户的密码更新
  def check_update_password?
    if params[:password]&&!params[:password].empty?&&params[:password_confirmation]&&!params[:password_confirmation].empty?&&params[:new_password]&&!params[:new_password].empty?
      if params[:password_confirmation]!=params[:new_password]
        flash[:error]="两次输入的密码不相同!"
        return false
      end
    else
      flash[:error]="必填信息不能为空！"
      return false
    end
    true
  end
end
