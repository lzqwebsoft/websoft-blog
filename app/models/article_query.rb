class ArticleQuery

  #对应的操作符的解释文本
  @@operators={
    "="=>"等于",
    "!"=>"不等于",
    "contain"=>"包含",
    "except"=>"不包含",
    ">t"=>"前几天以前",
    "<t"=>"前几天以内",
    "=t"=>"前几天",
    "w"=>"本周",
    "t"=>"今天",
    "y"=>"昨天"
  }
  cattr_reader :operators

  #即过滤的条件的操作符的值
  @@operators_by_filter_type={
    "equest_list"=>["=","!"],
    "contain_list"=>["except", "contain"],
    "date_list"=>[">t", "<t", "=t", "w", "t", "y"]
  }
  cattr_reader :operators_by_filter_type

  def initialize
    #初始化用户过滤的条件
    @filters= @filters || {:title=>{:operator=>"contain", :values=>[""]}}
  end

  #返回已存在在的过滤条件
  attr_reader :filters

  #得到可用的查询
  def available_filters
    #一些过滤的条件
    @available_filters={
      :article_type_id=>{:type=>:equest_list, :order=>1, :value=>ArticleType.find(:all, :order=>"id").collect{|type| [type.name, type.id]}},
      :title=>{:type=>:contain_list, :order=>2},
      :updated_at=>{:type=>:date_list, :order=>3}
    }
  end

  #得到过滤条件的名字
  def filter_name
    @filter_name={
      :article_type_id=>"类型",
      :title=>"标题",
      :updated_at=>"更新于"
    }
  end

  #由field来得到filters中的操作符
  def operator_for(field)
    if has_filter?(field)
      @filters[field][:operator]
    else
      nil
    end
  end

  #由field来得到filters中的值
  def value_for(field)
    if has_filter?(field)
      @filters[field][:values]
    end
  end

  #用来判断过滤条件中是否存在field这个过滤域
  def has_filter?(field)
    @filters && @filters[field]
  end

  #添加过滤的条件
  def add_filter(field, operator, values)
    #判断这个域是否在可利用的查询语名中存在
    @filters[field.to_sym]={:operator=>operator, :values=>values} if available_filters.has_key?(field.to_sym)
  end

  #添加过滤条件组合
  def add_filters(fields, operators, values)
    fields.each do |field|
        add_filter(field, operators[field], values[field])
      end if fields.is_a?(Array) && operators.is_a?(Hash) && values.is_a?(Hash)
  end

  #由filters生成sql的conditions语句
  def statement
    #定义一个过滤条件数组,初始化时查找状态为1，即已发表的文章
    filter_conditions=["#{Article.table_name}.status = 1 "]
    @filters.each_key do |field|
        if field==:title  #生成标题的查询语句
          value=value_for(field).first
          if operator_for(field)=="contain"
            filter_conditions << "#{Article.table_name}.title LIKE '%#{value}%' "
          else
            filter_conditions << "#{Article.table_name}.title NOT LIKE '%#{value}%' "
          end
        elsif field==:article_type_id #生成文章类型的查询语句
          value="("+value_for(field).join(",")+")"
          if operator_for(field)=="="
            filter_conditions << "#{Article.table_name}.article_type_id IN #{value}"
          else
            filter_conditions << "#{Article.table_name}.article_type_id NOT IN #{value}"
          end
        elsif field==:updated_at      #生成文章更新于的查询语句
          value=value_for(field).first.to_i
          if operator_for(field)==">t"
            filter_conditions << date_range_clause(Article.table_name, "updated_at", nil, -value)
          elsif operator_for(field)=="<t"
            filter_conditions << date_range_clause(Article.table_name, "updated_at", -value, 0)
          elsif operator_for(field)=="=t"
            filter_conditions << date_range_clause(Article.table_name, "updated_at", -value, -value)
          elsif operator_for(field)=="w"
            #得到今天是这个星期中的第几天，星期一为1，星期天为7
            day_of_week = Date.today.cwday
            filter_conditions << date_range_clause(Article.table_name, "updated_at", -day_of_week, 0)
          elsif operator_for(field)=="t"
            filter_conditions << date_range_clause(Article.table_name, "updated_at", 0, 0)
          elsif operator_for(field)=="y"
            filter_conditions << date_range_clause(Article.table_name, "updated_at", -1, -1)
          end
        end
    end
    filter_conditions.any? ? filter_conditions.join(' AND ') : nil
  end

  #由filters的条件来得到符合条件的articles
  def articles()
    Article.find(:all, :conditions=>statement, :order=>"updated_at DESC")
  end

  #得到从from到to这个时间范围的sql语句
  def date_range_clause(table, field, from, to)
    sql=[]
    if from
      #注意这里的end_of_day中将当前的HH:MM:SS加入到时间中，这里不然为00:00:00
      sql << "#{table}.#{field} > '%s'" % [(Date.yesterday + from).end_of_day.strftime("%Y-%m-%d %H:%M:%S")]
    end
    if to
      sql << "#{table}.#{field} <= '%s'" % [(Date.today + to).end_of_day.strftime("%Y-%m-%d %H:%M:%S")]
    end
    sql.join(" AND ")
  end
end
