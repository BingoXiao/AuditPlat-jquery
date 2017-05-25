var table = null;   //表格
var Res = [];         //表格填充数据
var allDatas = [];    //表格所有数据
var current = new Date();


function refreshTable() {
    if ($("#applyShopRegister").hasClass("active")) {
        selfFun.newRegisterdatas_getdatas("APPLY");
    } else if ($("#newShopRegister").hasClass("active")) {
        selfFun.newRegisterdatas_getdatas("NEW");
    } else if ($("#branchesRegister").hasClass("active")) {
        selfFun.newRegisterdatas_getdatas("BRANCH");
    }
    table.clear().rows.add(Res).draw();
}


var selfFun = {
    //注册获取数据
    newRegisterdatas_getdatas: function (type) {
        ajax_request({
            url: BDREGISTER_TABLE_URL,
            type: BDREGISTER_TABLE_TYPE,
            data: {
                type: type
            },
            async: false,
            success_fun: function (data) {
                allDatas = data;
                Res = table_operation.date_compare(
                    moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                    moment(current).format('YYYY年MM月DD日'), allDatas);
            }
        });
    },

    //初始化表格
    tableInit: function () {
        return $('#BDregisterTable').DataTable({
            "data": Res,
            "destroy": true,
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
            //"rowId": applynum,
            "columnDefs": [   //第一列注册号
                {
                    "targets": 0,
                    "data": 'applynum',
                    "width": "13%"
                },

                {     //第二列商家名称
                    "targets": 1,
                    "data": 'busname',
                    "width": "9%"
                },

                {    //第三列为城市
                    "targets": 2,
                    "data": 'city',
                    "width": "6%"
                },

                {    //第四列为商圈
                    "targets": 3,
                    "data": 'city_near',
                    "width": "10%"
                },

                {    //第五列为联系人
                    "targets": 4,
                    "data": null,
                    "width": "13%",
                    "render": function (data, type, full, meta) {
                        var np = data.name;
                        np += '<br/>';
                        np += data.phonenum;
                        return np;
                    }
                },


                {    //第6列为状态
                    "targets": 5,
                    "data": null,
                    "width": "12%",
                    "render": function (data, type, full, meta) {
                        if (data.status === "驳回") {
                            return "<span class='registerState'>" + data.status + "</span><br/><span class='why' style='color:#af1609;font-size:14px;'>" + data.reject_reason + "</span>";
                        } else {
                            return "<span class='registerState'>" + data.status + "</span>";
                        }
                    }
                },

                {    //第8列为BD
                    "targets": 6,
                    "data": 'bd',
                    "width": "7%"
                },

                {    //第7列为提交时间
                    "targets": 7,
                    "data": 'submit_time',
                    "width": "15%"
                },

                {     //第9列为操作
                    "targets": -1,
                    "data": null,
                    "className": "operate",
                    "width": "15%",
                    "render": function (data, type, full, meta) {
                        if ($("#applyShopRegister").hasClass("active")) {
                            if (data.status == '送审中') {
                                return "<span class='glyphicon glyphicon-minus' style='padding:0 33px'></span>&nbsp;" +
                                    "<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>";
                            } else if (data.status == '驳回' || data.status == '处理中') {
                                return "<button class='btn btn-default glyphicon glyphicon-pencil editIcon'>&nbsp;修改</button>" +
                                    "&nbsp;<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>" +
                                    "<button class='btn btn-default glyphicon glyphicon-trash deleteIcon'>&nbsp;删除</button>";
                            } else {
                                return "<button class='btn btn-default glyphicon glyphicon-bullhorn registerIcon'>&nbsp;注册" +
                                    "</button>&nbsp;<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>" +
                                    "<button class='btn btn-default glyphicon glyphicon-trash deleteIcon'>&nbsp;删除</button>";
                            }
                        } else {
                            if (data.status == '送审中') {
                                return "<span class='glyphicon glyphicon-minus' style='padding:0 33px'></span>&nbsp;";
                            } else {
                                return "<button class='btn btn-default glyphicon glyphicon-pencil editIcon'>&nbsp;修改</button>&nbsp;" +
                                    "<button class='btn btn-default glyphicon glyphicon-trash deleteIcon'>&nbsp;删除</button>";
                            }
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                /************************查看 (商家申请注册)***********************/
                $(".lookIcon").on("click", function () {
                    //将参数放在url中(注册号)
                    var num = encodeURIComponent($(this).closest("tr").children("td:first-child").html());

                    window.open('./BDregister/BDregisterApply.html#num=' + num);
                });


                /************************ 注册 ***********************/
                $(".registerIcon").on("click", function () {   //新店
                    //将参数放在url中(注册号)
                    var num = encodeURIComponent($(this).closest("tr").children("td:first-child").html());
                    //商家申请注册 “注册”
                    if ($("#applyShopRegister").hasClass("active")) {
                        var state = encodeURIComponent("apply");
                    }

                    window.open('./BDregister/BDregisterReview.html#num=' + num + "&state=" + state);
                });

                /************************ 删除 ***********************/
                $(".deleteIcon").on("click", function () {   //新店
                    //将参数放在url中(注册号)
                    var num = $(this).closest("tr").children("td:first-child").html();
                    var name = $(this).closest("tr").children("td:nth-child(2)").html();
                    window.parent.set_modal({
                        path: "./modal/deleteModal.html",
                        para: num,
                        loadFun: function () {
                            $("#deleteName", window.top.document).html(name);
                        }
                    });
                });


                /************************修改*****************************/
                $(".editIcon").on("click", function () {
                    //将参数放在url中(注册号)
                    var num = encodeURIComponent($(this).closest("tr").children("td:first-child").html());

                    if ($("#branchesRegister").hasClass("active")) {   //分店修改

                        window.open('./BDregister/BDregisterbranch.html#num=' + num);

                    } else {    //新店修改或者商家申请注册修改

                        window.open('./BDregister/BDregisterReview.html#num=' + num);
                    }
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
    table = selfFun.tableInit();

// 顶部菜单栏内容切换
    $("#busRegisterList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        $("#applyNumInput").val("");    //清空搜索框
        sessionStorage.setItem('topListr', $(this).attr("id"));

        if ($("#applyShopRegister").hasClass("active")) {
            $("#stateList").empty();
            $("#stateList").append("<option value='全部'>全部</option><option value='未处理'>未处理</option>" +
                "<option value='处理中'>处理中</option><option value='送审中'>送审中</option>" +
                "<option value='驳回'>驳回</option>'");

            $("#newregister").css("display", "none");

            selfFun.newRegisterdatas_getdatas("APPLY");
            table.clear().rows.add(Res).draw();

        } else if ($("#branchesRegister").hasClass("active")) {
            $("#stateList").empty();
            $("#stateList").append("<option value='全部'>全部</option><option value='处理中'>处理中</option>" +
                "<option value='送审中'>送审中</option><option value='驳回'>驳回</option>'");

            $("#newregister").css("display", "");

            selfFun.newRegisterdatas_getdatas("BRANCH");
            table.clear().rows.add(Res).draw();

        } else if ($("#newShopRegister").hasClass("active")) {
            $("#stateList").empty();
            $("#stateList").append("<option value='全部'>全部</option>" +
                "<option value='处理中'>处理中</option><option value='送审中'>送审中</option>" +
                "<option value='驳回'>驳回</option>'");

            $("#newregister").css("display", "");

            selfFun.newRegisterdatas_getdatas("NEW");
            table.clear().rows.add(Res).draw();
        }
        table_operation.datepicker_reset(current, ".searchForm");
    });

//顶部菜单刷新时定位
    if (!!sessionStorage.getItem('topListr')) {
        $("#" + sessionStorage.getItem('topListr')).trigger("click");
    } else {
        selfFun.newRegisterdatas_getdatas("NEW");
        table.clear().rows.add(Res).draw();
    }


// 刷新数据
    $("#refreshDatas").on("click", function () {
        refreshTable()
    })


//选中高亮
    common.selectShow("#BDregisterTable", "td");


//日期选择器改变时，新店注册记录表格数据过滤
    $(".dateFrom").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('.dateTo').data("DateTimePicker").minDate(e.date);

        Res = table_operation.datepickerFrom_change(".searchForm", allDatas);
        table.clear().rows.add(Res).draw();
    });

    $(".dateTo").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('.dateFrom').data("DateTimePicker").maxDate(e.date);

        Res = table_operation.datepickerTo_change(".searchForm", allDatas);
        table.clear().rows.add(Res).draw();
    });

//*************** 自定义搜索框 ****************/
    table_operation.input_search(table, "#applyNumInput", 0);
    table_operation.select_search(table, "#stateList", '全部', 5);
    table_operation.select_search(table, "#BDList", '全部', 6);


//点击按钮（立即注册）
    $("#newregister").click(function () {
        if ($("#newShopRegister").hasClass("active")) {       //新店注册
            window.open('./BDregister/BDregisterReview.html');

        } else if ($("#branchesRegister").hasClass("active")) {     //分店注册
            window.open('./BDregister/BDregisterbranch.html');
        }

    });


});


