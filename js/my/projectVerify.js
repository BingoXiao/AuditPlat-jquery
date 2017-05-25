
$(function () {
    var current = new Date();
    var table = null;
    var tabledatas = [];
    var res = [];

    function datas_getdatas(type){     //项目记录
        ajax_request({
            url: PROVERIFY_TABLE_URL,
            type: PROVERIFY_TABLE_TYPE,
            async: false,
            data: {
                operate_type:type
            },
            success_fun: function (data) {
                tabledatas = data;
                if($("#proRecord").hasClass("active")){
                    res = data;
                }else{
                    res = table_operation.date_compare(
                        moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                        moment(current).format('YYYY年MM月DD日'), tabledatas);
                }
            }
        });
    };

var tableFun = {
    tableInit: function () {
        return $('#projectverifyTable').DataTable({
            "data": res,
            "destroy": true,
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
            "rowId": "item_id",
            "columnDefs": [
                {    //第1列为申请时间
                    "targets": 0,
                    "data": 'submit_time',
                    "width": '15%'
                },

                {//第2列门店名称
                    "targets": 1,
                    "className": "name",
                    "data": 'bus_names',
                    "width": '15%',
                    "render": function (cell, type, full, meta) {
                        var strs = $.trim(cell).split(" ");
                        cell = "";
                        for (var i = 0; i < strs.length; i++) {
                            cell += strs[i] + "<br/>";
                        }
                        return cell;
                    }
                },

                {    //第3列为项目名称
                    "targets": 2,
                    "data": 'name',
                    "className": "name",
                    "width": '20%'
                },

                {    //第4列为项目分类
                    "targets": 3,
                    "data": 'class',
                    "width": '20%',
                    "render": function (cell, type, full, meta) {
                        var strs = $.trim(cell).split(" ");
                        cell = "";
                        for (var i = 0; i < strs.length; i++) {
                            if (i < strs.length - 1) {
                                cell += strs[i] + ">";
                            } else {
                                cell += strs[i];
                            }
                        }
                        return cell;
                    }
                },

                {    //第5列为项目类型
                    "targets": 4,
                    "data": 'item_type',
                    "width": '10%'
                },

                {    //第6列为状态
                    "targets": 5,
                    "data": 'status',
                    "width": '10%',
                    "className": "state"
                },

                {     //第7列为操作
                    "targets": 6,
                    "data": null,
                    "width": '10%',
                    "className": 'check',
                    "defaultContent": "</button>&nbsp;<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>"
                }
            ],
            "drawCallback": function (settings) {
                //点击查看
                $(".lookIcon").on("click", function () {
                    var $tr = $(this).closest("tr");

                    //url传递参数：item_id、状态
                    var id = encodeURIComponent($tr.attr("id"));

                    $('#rightIframe', window.top.document).attr('src', 'projectVerify/projectVerifyOnline.html?id='+id);
                    $('#left-navlist', window.top.document).css("display", "none");
                });
            }
        });
    }
};

    //日期初始化
    common.datepicker_range_initiate(current);
    //餐饮分类下拉列表初始化
    register.initialize_lclass();

    //表格初始化
    table = tableFun.tableInit();

    // 顶部菜单栏
    $("#projectList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        //输入框清空
        $("#InputSearch").val("");
        $("select").val("");

        sessionStorage.setItem('topListp', $(this).attr('id'));

        //菜单内容切换
        if ($("#proRecord").hasClass("active")) {
            $(".datepickerGroup").css("display","");
            $(".stateFilter").css("display","");

            datas_getdatas("HIS");
            table.clear().rows.add(res).draw();
            table_operation.datepicker_reset(current,"#onlineApplyDiv");

        }else{
            $(".datepickerGroup").css("display","none");
            $(".stateFilter").css("display","none");

            if ($("#onlineApply").hasClass("active")) {
                datas_getdatas("UP");
                table.clear().rows.add(res).draw();

            } else if ($("#modifyApply").hasClass("active")) {
                datas_getdatas("EDIT");
                table.clear().rows.add(res).draw();

            } else if ($("#offlineApply").hasClass("active")) {
                datas_getdatas("DOWN");
                table.clear().rows.add(res).draw();
            }
        }
    });


    //顶部菜单刷新时定位
    if (sessionStorage.getItem('topListp') != null) {
        $("#" + sessionStorage.getItem('topListp')).trigger("click");
    }else{
        datas_getdatas("UP");
        table.clear().rows.add(res).draw();
    }


//*************** 申请 自定义搜索框 ok****************/
    //开始日期改变时，搜索数据
    $(".dateFrom", "#onlineApplyDiv").on("dp.change", function (e) {
        $('#onlineApplyDiv .dateTo').data("DateTimePicker").minDate(e.date);

        res = table_operation.datepickerFrom_change("#onlineApplyDiv", tabledatas);
        table.clear().rows.add(res).draw();
    });
    //结束日期改变时，搜索数据
    $(".dateTo", "#onlineApplyDiv").on("dp.change", function (e) {
        $('#onlineApplyDiv .dateFrom').data("DateTimePicker").maxDate(e.date);

        res = table_operation.datepickerTo_change("#onlineApplyDiv", tabledatas);
        table.clear().rows.add(res).draw();
    });


    $("#InputSearch").on("keyup", function () {   //门店名称
        table.column(".name").search(this.value).draw();
    });

    table_operation.select_search(table, "#PType", '全部', 3);   //项目类型
    table_operation.select_search(table, "#dropdownMenuState", '全部', -2);   //状态

    //项目分类 搜索
    $("#repast").change(function () {
        $("#category").empty();
        $("#category").append('<option value="">品类</option>');

        $("#small_category").empty();
        $("#small_category").append('<option value="">子类别</option>');

        if ($(this).val() == "") {
            table.column(3).search("").draw();
        } else {
            register.get_mclass($(this).val());
            table.column(3).search("").draw();
        }
    });
    $("#category").change(function () {
        $("#small_category").empty();
        $("#small_category").append('<option value="">子类别</option>');

        if ($(this).val() == "") {
            table.column(3).search("").draw();
        } else {
            register.get_sclass($(this).val());
            table.column(3).search($(this).find("option:selected").text()).draw();
        }
    });
    $('#small_category').on("change", function () {
        if ($(this).val() == "") {
            table.column(3).search($("#category").find("option:selected").text()).draw();
        } else {
            table.column(3).search($("#category").find("option:selected").text() + $(this).find("option:selected").text()).draw();
        }
    });


//选中高亮
    common.selectShow("#projectverifyTable", "td");


});



