class HomeController < ApplicationController
  before_filter :find_top_ten_latest_article, :only=>[:index]
  before_filter :find_last_ten_latest_messages, :only=>[:index]

  def index
  end

  private
  #找到最新的前10篇文章
  def find_top_ten_latest_article
    @latest_articles=Article.find(:all, :order=>'updated_at DESC', :limit=>10, :conditions=>"status=1");
  end

  #找到最新的留言
  def find_last_ten_latest_messages
    @latest_messages=Message.find(:all, :order=>'created_at DESC', :limit=>10, :conditions=>"parent_id IS NULL")
  end
end