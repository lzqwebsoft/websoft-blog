class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments, :force=>true do |t|
      t.integer :article_id, :null=>false
      t.integer :parent_id
      t.text :content
      t.string :author, :limit=>50, :default=>'游客'

      t.string :type
      t.timestamps
    end
  end

  def self.down
    drop_table :comments
  end
end
