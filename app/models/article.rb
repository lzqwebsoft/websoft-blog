class Article < ActiveRecord::Base
  belongs_to :article_type
  belongs_to :author, :class_name => 'User'
  #只关联于根评论
  has_many :comments, :class_name=>'RootComment', :dependent=>:destroy

  #得到评论的条数
  def comment_counts
    self.comments.length
  end
end