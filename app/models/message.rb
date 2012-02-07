class Message < ActiveRecord::Base

  #找到所有的子评论
  def find_all_child_messages
    Message.find(:all, :conditions=>{:parent_id=>self.id})
  end
end