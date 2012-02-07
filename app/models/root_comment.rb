class RootComment < Comment
  #依赖于文章对象
  belongs_to :article
  #关联一些子评论
  has_many :child_comments, :class_name=>'SubComment', :dependent=>:destroy, :foreign_key=>'parent_id'
end