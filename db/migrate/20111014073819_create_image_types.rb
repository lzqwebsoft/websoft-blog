class CreateImageTypes < ActiveRecord::Migration
  def self.up
    create_table :image_types do |t|
      t.string :name, :null=>false
      t.integer :permission, :default=>0
      t.string :question, :null=>true
      t.string :answer, :null=>true
      t.string :title_image_id
      t.timestamps
    end

    ImageType.create(:name=>'博客用图')
    ImageType.create(:name=>'我的帖图')
  end

  def self.down
    drop_table :image_types
  end
end
