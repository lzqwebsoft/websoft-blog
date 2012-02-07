class CreateArticleTypes < ActiveRecord::Migration
  def self.up
    create_table :article_types, :force => true do |t|
      t.string :name, :null=>false, :limit=>100
      t.timestamps
    end

    ArticleType.create(:name=>'个人日志')
    ArticleType.create(:name=>'技术文摘')
    ArticleType.create(:name=>'小小说')
  end

  def self.down
    drop_table :article_types
  end
end
