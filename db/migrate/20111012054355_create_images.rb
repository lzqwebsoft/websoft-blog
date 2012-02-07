class CreateImages < ActiveRecord::Migration
  def self.up
    create_table :images do |t|
      t.integer :image_type_id
      t.string :filename, :default => "", :null => false
      t.string :disk_filename, :default => "", :null => false
      t.integer :filesize, :default => 0, :null => false
      t.string :content_type, :limit => 60, :default => ""
      t.string :description
      t.integer :author_id, :default => 0, :null => false
      t.timestamp :created_on
    end

    #初始化建立暂无图片及需要密码时的图片
    Image.create(:filename=>"no_photo.png", :disk_filename=>"111020152934_no_photo.png", :filesize=>2950,
      :author_id=>1, :content_type=>"image/png", :description=>"暂无图片")
    Image.create(:filename=>"need_pass.png", :disk_filename=>"111020153003_need_pass.png", :filesize=>2691,
      :author_id=>1, :content_type=>"image/png", :description=>"需要密码")
    Image.create(:filename=>"face_default.png", :disk_filename=>"111028163401_face_default.png", :filesize=>8011,
      :author_id=>1, :content_type=>"image/png", :description=>"头像")
  end

  def self.down
    drop_table :images
  end
end
