var shopApply_table = null;  //商家申请（记录）表格
var shopInfo_table = null;  //商家信息修改（记录）表格
var current = new Date();    //当前日期

var SAtabledatas = [];
var busAres = [];    //商家申请当前数据
function SAtabledatas_getdatas(type) {   //商家申请记录总数据
    ajax_request({
        url: BDVERIFY_APPLYTABLE_URL,
        type: BDVERIFY_APPLYTABLE_TYPE,
        data: {
            type: type
        },
        async: false,
        success_fun: function (data) {
            SAtabledatas = data;
            busAres = table_operation.date_compare(
                moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                moment(current).format('YYYY年MM月DD日'), data);
        }
    });
};

var SItabledatas = [];  //商家信息修改总数据
var busMres = [];    //商家信息修改当前数据
function SItabledatas_getdatas(type) {   //商家信息修改记录总数据
    ajax_request({
        url: BDVERIFY_EDITTABLE_URL,
        type: BDVERIFY_EDITTABLE_TYPE,
        data: {
            type: type
        },
        async: false,
        success_fun: function (data) {
            SItabledatas = data;
            if (type == "H") {
                busMres = table_operation.date_compare(
                    moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                    moment(current).format('YYYY年MM月DD日'), data);
            } else {
                busMres = data;
            }

        }
    });
};


var tableFun = {
    // 商家申请表格
    SAtableInit: function () {
        return $('#shopApplyTable').DataTable({
            "destroy": true,
            "data": busAres,
            "autoWidth": false,
            "dom": 't<"bottom info"i><"tablePage"p>',
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "pagingType": "full_numbers",
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录",
                "zeroRecords": "没有找到记录",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "info": "共有 _TOTAL_ 条, 每页显示：10条",
                "paginate": {
                    "first": "首页",
                    "previous": "上一页",
                    "next": "下一页",
                    "last": "末页"
                }
            },
            "rowId": "item_id",
            "columnDefs": [
                {    //第1列为提交时间
                    "targets": 0,
                    "data": 'submit_time',
                    "width": '15%'
                },

                {  //第2列为审编号
                    "targets": 1,
                    "className": 'applynum',
                    "data": 'applynum',
                    "width": '15%'
                },

                {     //第3列商家名称
                    "targets": 2,
                    "data": 'busname',
                    width: '15%'
                },

                {    //第4列为城市
                    "targets": 3,
                    "data": 'city',
                    "width": '10%'
                },

                {    //第5列为商圈
                    "targets": 4,
                    "data": 'city_near',
                    "width": '10%'
                },

                {    //第6列为联系人
                    "targets": 5,
                    "data": 'bd',
                    "className": 'bd',
                    "width": '15%'
                },

                {    //第7列为状态
                    "targets": 6,
                    "data": 'status',
                    "defaultContent": "未审核",
                    "width": '10%',
                    "className": 'state',
                    "visible": false
                },

                {     //第8列为操作
                    "targets": 7,
                    "data": null,
                    "className": 'verify',
                    "width": '10%',
                    "defaultContent": "<button class='btn btn-default glyphicon glyphicon-hand-right verifyIcon'>&nbsp;查看</button>",
                    "render": function (data, type, full, meta) {
                        if ($("#shopApply").hasClass("active")) {
                            return "<button class='btn btn-default verifyIcon'><img src='../img/14.png' " +
                                "style='width:13px;vertical-align:text-top'/>&nbsp;&nbsp;&nbsp;审核</button>";
                        } else if ($("#shopApplyRecord").hasClass("active")) {
                            return "<button class='btn btn-default glyphicon glyphicon-hand-right verifyIcon'>&nbsp;查看</button>";
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                $('.verifyIcon').on('click', function () {
                    var $tr = $(this).closest("tr");

                    //url传递的参数为：bd、状态及原因、审编号
                    var bd = encodeURIComponent($tr.find(".bd").html());
                    var num = encodeURIComponent($tr.find("td.applynum").html());
                    var state = encodeURIComponent($tr.find("td.state").html());
                    var reason = encodeURIComponent($tr.find("td.state").find(".Reason").html());

                    window.open('./busVerify/busVerifyApply.html#num=' + num);
                });
            }
        });
    },

    // 商家信息修改表格
    SItableInit: function () {
        return $('#shopInfoTable').DataTable({
            "destroy": true,
            "data": busMres,
            "autoWidth": false,
            "dom": 't<"bottom info"i><"tablePage"p>',
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "pagingType": "full_numbers",
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录",
                "zeroRecords": "没有找到记录",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "info": "共有 _TOTAL_ 条, 每页显示：10条",
                "paginate": {
                    "first": "首页",
                    "previous": "上一页",
                    "next": "下一页",
                    "last": "末页"
                }
            },
            "rowId": "item_id",
            "columnDefs": [
                {    //第1列为提交时间
                    "targets": 0,
                    "data": 'submit_time',
                    "width": '15%'
                },

                {  //第2列为审编号
                    "targets": 1,
                    "data": 'applynum',
                    "width": '15%'
                },

                {     //第3列商家名称
                    "targets": 2,
                    "data": 'busname',
                    width: '15%'
                },

                {    //第4列为城市
                    "targets": 3,
                    "data": 'city',
                    "width": '10%'
                },

                {    //第5列为商圈
                    "targets": 4,
                    "data": 'city_near',
                    "width": '10%'
                },

                {    //第6列为联系人
                    "targets": 5,
                    "data": 'bd',
                    "className": 'bd',
                    "width": '15%'
                },

                {    //第7列为状态
                    "targets": 6,
                    "data": 'status',
                    "width": '10%',
                    "defaultContent": "未审核",
                    "className": 'state',
                    "visible": false
                },

                {     //第8列为操作
                    "targets": 7,
                    "data": null,
                    "className": 'verify',
                    "width": '10%',
                    "defaultContent": "<button class='btn btn-default glyphicon glyphicon-hand-right verifyIcon'>&nbsp;查看</button>",
                    "render": function (data, type, full, meta) {
                        if ($("#shopInfoModify").hasClass("active")) {
                            return "<button class='btn btn-default editIcon'><img src='../img/14.png' " +
                                "style='width:13px;vertical-align:text-top'/>&nbsp;&nbsp;&nbsp;审核</button>";
                        } else if ($("#shopInfoModifyRecord").hasClass("active")) {
                            return "<button class='btn btn-default glyphicon glyphicon-hand-right editIcon'>&nbsp;查看</button>";
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                $('.editIcon').on('click', function () {
                    var $tr = $(this).closest("tr");

                    //url传递参数为：item_id和状态
                    var id = encodeURIComponent($tr.attr("id"));
                    var state = encodeURIComponent($tr.find("td.state").html());
                    var reason = encodeURIComponent($tr.find("td.state").find(".Reason").html());

                    window.open('./busVerify/busVerifyInfoEdit.html#id=' + id);
                });
            }
        });
    }
};


$(function () {
    //日期初始化
    common.datepicker_range_initiate(current);
    //BD列表初始化
    table_operation.assignList("#BDList");
    //表格初始化
    shopApply_table = tableFun.SAtableInit();
    shopInfo_table = tableFun.SItableInit();

// 顶部菜单栏内容切换
    $("#busVerifyList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        $(".verifyNumInput").val("");    //清空搜索栏

        sessionStorage.setItem('topListb', $(this).attr("id"));

        if ($("#shopApply").hasClass("active") || $("#shopApplyRecord").hasClass("active")) {
            $("#shopApplyDiv").css("display", "");
            $("#shopInfoDiv").css("display", "none");

            if ($("#shopApply").hasClass("active")) {    //商家申请
                SAtabledatas_getdatas("V");
                shopApply_table.clear().rows.add(busAres).draw();
                shopApply_table.column(6).visible(false);

            } else if ($("#shopApplyRecord").hasClass("active")) {    //商家申请记录
                SAtabledatas_getdatas("H");
                shopApply_table.clear().rows.add(busAres).draw();
                shopApply_table.column(6).visible(true);
            }
            table_operation.datepicker_reset(current, "#shopApplyDiv");
        } else {

            $("#shopApplyDiv").css("display", "none");
            $("#shopInfoDiv").css("display", "");

            if ($("#shopInfoModify").hasClass("active")) {    //商家信息修改

                $("#shopInfoDiv .verifyS").css("display", "");
                $("#shopInfoDiv .lookS").css("display", "none");

                SItabledatas_getdatas("V");
                shopInfo_table.clear().rows.add(busMres).draw();
                shopInfo_table.column(6).visible(false);

            } else if ($("#shopInfoModifyRecord").hasClass("active")) {    //商家信息修改记录

                $("#shopInfoDiv .verifyS").css("display", "none");
                $("#shopInfoDiv .lookS").css("display", "");

                SItabledatas_getdatas("H");
                shopInfo_table.clear().rows.add(busMres).draw();
                shopInfo_table.column(6).visible(true);
                table_operation.datepicker_reset(current, "#shopInfoDiv");
            }
        }
    });

//顶部菜单刷新时定位
    if (!!sessionStorage.getItem('topListb')) {
        $("#" + sessionStorage.getItem('topListb')).trigger("click");
    } else {
        SAtabledatas_getdatas("V");
        shopApply_table.clear().rows.add(busAres).draw();
        shopApply_table.column(6).visible(false);
    }


// 刷新数据
    $("#refreshDatas2").on("click", function () {
        if ($("#shopApply").hasClass("active")) {    //商家申请
            SAtabledatas_getdatas("V");
            shopApply_table.clear().rows.add(busAres).draw();
            shopApply_table.column(6).visible(false);

        } else {    //商家申请记录
            SAtabledatas_getdatas("H");
            shopApply_table.clear().rows.add(busAres).draw();
            shopApply_table.column(6).visible(true);
        }
    })
    $("#refreshDatas3").on("click", function () {
        SItabledatas_getdatas("V");
        shopInfo_table.clear().rows.add(busMres).draw();
        shopInfo_table.column(6).visible(false);
    })
    $("#refreshDatas4").on("click", function () {
        SItabledatas_getdatas("H");
        shopInfo_table.clear().rows.add(busMres).draw();
        shopInfo_table.column(6).visible(true);
        table_operation.datepicker_reset(current, "#shopInfoDiv");
    })


//选中高亮
    common.selectShow("table", "td");

//表格自定义搜索框
    table_operation.select_search(shopApply_table, "#BDList", '全部', 5);
    table_operation.input_search(shopApply_table, "#shopApplyDiv .verifyNumInput", 1);
    table_operation.input_search(shopInfo_table, "#shopInfoDiv .verifyNumInput", 1);


//日期选择器改变时，商家申请记录表格数据过滤
    $(".dateFrom", "#shopApplyDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#shopApplyDiv .dateTo').data("DateTimePicker").minDate(e.date);

        busAres = table_operation.datepickerFrom_change("#shopApplyDiv", SAtabledatas);
        shopApply_table.clear().rows.add(busAres).draw();
    });

    $(".dateTo", "#shopApplyDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#shopApplyDiv .dateFrom').data("DateTimePicker").maxDate(e.date);

        busAres = table_operation.datepickerTo_change("#shopApplyDiv", SAtabledatas);
        shopApply_table.clear().rows.add(busAres).draw();
    });


//日期选择器改变时，商家信息修改记录表格数据过滤
    $(".dateFrom", "#shopInfoDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#shopInfoDiv .dateTo').data("DateTimePicker").minDate(e.date);

        busMres = table_operation.datepickerFrom_change("#shopInfoDiv", SItabledatas);
        shopInfo_table.clear().rows.add(busMres).draw();
    });

    $(".dateTo", "#shopInfoDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#shopInfoDiv .dateFrom').data("DateTimePicker").maxDate(e.date);

        busMres = table_operation.datepickerTo_change("#shopInfoDiv", SItabledatas);
        shopInfo_table.clear().rows.add(busMres).draw();
    });


});