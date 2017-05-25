
$(function (){
    var table=null;
    var res = null;

    // 下载列表
    $("#downloadList").click(function () {
        window.open("/bus-manage/buses/download/", '_self');
    });

//****************表格数据加载(初始化) OK**********************/
    table = $('#busListTable').DataTable({
        ajax:{
            url:BUSLIST_TABLE_URL,
            type:BUSLIST_TABLE_TYPE,
            dataSrc:function(data) { //提交成功的回调函数
                if (data.success) {
                    return res=data.content;// 对返回数据进行处理
                }
            }
        },
        "data": res,
        "dom": 't<"bottom info"i><"tablePage"p>',
        "autoWidth": false,
        "ordering": false,
        "lengthChange": false,
        "pageLength": 10,
        "pagingType":   "full_numbers",
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "info": "共有 _TOTAL_ 条, 每页显示：10条",
            "paginate": {
                "first":      "首页",
                "previous":   "上一页",
                "next":       "下一页",
                "last":       "末页"
            }
        },
        "rowId": "bususer_id",
        "columnDefs": [   //第1列商家编号
            {
                "targets": 0,
                "data": 'number',
                "width":'15%'
            },

            {     //第2列商家账号
                "targets": 1,
                "data": 'account',
                "width":'15%',
                "className":'shop'
            },

            {     //第3列城市
                "targets": 2,
                "data": 'city',
                "width":'10%'
            },

            {     //第4列商圈
                "targets": 3,
                "data": 'city_near',
                "width":'10%'
            },

            {     //第5列商家分类
                "targets": 4,
                "data": 'class',
                "width":'15%'
            },

            {     //第6列状态
                "targets": 5,
                "data": 'status',
                "width":'10%'
            },

            {    //第7列为提交时间
                "targets": 6,
                "data": 'date_join',
                "width":'15%'
            },

            {     //第8列为操作
                "targets": -1,
                "data":null,
                "className":"operate",
                "width":'10%',
                "defaultContent": "<button class='btn btn-default glyphicon glyphicon-hand-right viewIcon'>&nbsp;查看</button>"
            }
        ],
        "drawCallback": function( settings ) {
            //点击查看
            $(".viewIcon").on("click",function(){
                var $tr=$(this).closest("tr");
                $(this).closest("tr").addClass('selected');
                $tr.siblings("tr").removeClass("selected");

                //url传递参数：商家账号、bususer_id
                var id = encodeURIComponent($(this).closest("tr").attr("id"));
                var acc = encodeURIComponent($(this).closest("tr").children("td:nth-child(2)").html());

                $('#rightIframe',window.top.document).attr('src','busListDetail.html?id='+id+'&acc='+acc);
                $('#left-navlist', window.top.document).css("display", "none");

            });
        }
    });


//*************** 自定义搜索框 ok****************/
    table_operation.select_search(table,"#dropdownMenuState","全部",5);   //状态搜索

    $("#NumInput").on("keyup",function () {
        table.columns(".shop").search(this.value).draw();
    });

    register.initialize_lclass();   //一级分类初始化
    //项目分类 <!--商家分类下拉框改变事件-->
    $("#repast").change(function () {
        $("#category").empty();
        $("#category").append('<option value="">品类</option>');

        $("#small_category").empty();
        $("#small_category").append('<option value="">子分类</option>');

        if($(this).val()==""){

        }else{
            register.get_mclass($(this).val());
        }
        table.column(4).search("").draw();
    });

    $("#category").change(function () {
        $("#small_category").empty();
        $("#small_category").append('<option value="">子分类</option>');

        if($(this).val()==""){
            table.column(4).search("").draw();
        }else{
            register.get_sclass($(this).val());
            table.column(4).search($(this).find("option:selected").text()).draw();
        }
    });

    $('#small_category').on("change",function () {
        if($(this).val()==""){
            table.column(4).search($("#category").find("option:selected").text()).draw();
        }else{
            table.column(4).search($("#category").find("option:selected").text()
                +$(this).find("option:selected").text()).draw();
        }
    });


//选中高亮
    common.selectShow("#busListTable", "td");

});

