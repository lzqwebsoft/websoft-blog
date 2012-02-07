class CreateArticles < ActiveRecord::Migration
  def self.up
    create_table :articles, :force => true do |t|
      t.string :title, :null=>false
      t.integer :author_id, :null=>false
      t.text :content, :null=>false
      t.integer :article_type_id, :null=>false
      t.integer :status, :default=>1
      t.timestamps
    end
  end

  def self.down
    drop_table :articles
  end
end
