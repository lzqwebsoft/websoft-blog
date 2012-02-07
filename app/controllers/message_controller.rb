class MessageController < ApplicationController
  before_filter :find_all_messages, :only=>[:index]
  before_filter :find_message_by_id, :only=>[:delete]

  def index
    
  end

  #创建一个新的根留言
  def create
    message=Message.new
    message.author=(params[:message][:name]&&!params[:message][:name].empty?) ? params[:message][:name] : '游客'
    message.content=params[:message][:content]
    if message.save!
      #得到新的messages
      find_all_messages
      render :partial=>"message_list", :layout=>false
    end
  end

  def delete
    return if require_login
    if @message.destroy
      @messages=Message.find(:all, :conditions=>"parent_id IS NULL", :order=>"created_at DESC")
      render :partial=>"message_list", :layout=>false
    end
  end

  #创建一个子留言
  def create_submessage
    parent_message=Message.find(params[:id])
    message=Message.new
    message.content=params[:content]
    message.author=(params[:reportName]&&!params[:reportName].empty?) ? params[:reportName] : "游客"
    message.parent_id= parent_message.id
    render :update do |page|
      page.insert_html :bottom, "message_child_div_#{parent_message.id}", :partial=>"child_message", :locals=>{:child_message=>message}
      page.call "createReportText", 'reportCommentEdit'  #回到我来说一句的状态
    end if message.save!
  end

  private
  #找到所有的根留言
  def find_all_messages
    #得到总的留言数
    @counts=Message.count(:conditions=>"parent_id IS NULL")
    #找到总的留言页数
    @pages=@counts/15+1
    #找到当前的页数
    @current_page = params[:page] || "0"
    @current_page=@current_page.to_i
    @messages=Message.find(:all, :conditions=>"parent_id IS NULL", 
                           :order=>"created_at DESC",
                           :offset=>@current_page*15,
                           :limit=>15)
  end

  #由提交的id来得到一个message对象
  def find_message_by_id
    @message=Message.find(params[:id]) if params[:id]
  end
end