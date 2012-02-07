class SubComment < Comment
  #依赖于root_commment
  belongs_to :parent_comment, :class_name => 'RootComment', :foreign_key => :parent_id
end