# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  #protect_from_forgery # See ActionController::RequestForgeryProtection for details
  layout 'base'
  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  before_filter :find_blog_info, :find_current_user

  #找到博主的个人信息
  def find_blog_info
    @blog_info= UserInfo.find(1)
  end

  #找到当前登录的用户
  def find_current_user
    return User.current=User.find(session[:user_id]) if session[:user_id]
  end

  #要求用户先登录
  def require_login
    unless User.current
      #url为记录当前用户请求的路径
      if request.get?
        url = url_for(params)
      else
        url = url_for(:controller => params[:controller], :action => params[:action], :id => params[:id])
      end
      respond_to do |format|
        format.html {redirect_to :controller=>"account", :action=>"login", :back_url =>url }
      end
      return true
    end
    false
  end

  #当存在back_url时，则跳转到back_url指定的地址
  def redirect_back_or_default(default)
    back_url = CGI.unescape(params[:back_url].to_s)
    if !back_url.blank?
      begin
        uri = URI.parse(back_url)
        # do not redirect user to another host or to the login or register page
        if (uri.relative? || (uri.host == request.host)) && !uri.path.match(%r{/(login)})
          redirect_to(back_url)
          return
        end
      rescue URI::InvalidURIError
        # redirect to default
      end
    end
    redirect_to default
    false
  end
end
