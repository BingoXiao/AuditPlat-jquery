//操作退款 团购券号码查询
function refund_search(token) {     //结款记录总数据
    ajax_request({
        url: CHECKVERIFY_REFUND_SEARCH_URL,
        type: CHECKVERIFY_REFUND_SEARCH_TYPE,
        data: {
            token: token
        },
        success_fun: function (result) {
            var state = result.status;
            var $id = $("#verified");

            $("#refundState").css("display", "");
            $("#couponNum").html($("#couponNumInput").val());   //团购券号码
            $id.css("display", "");

            if (state === "UN") {   //验证
                $("#Vrefund").css("display", "");
                $("#coupnState").html("已验证！");
                $id.find(".proName").html(result.item);    //项目名称
                $id.find(".buyTime").html(result.buy_time);    //购买时间
                $id.find(".Monetary").html(result.deserve);    //消费者购买金额
                $id.find(".onlineDate").html(result.create_time);    //上线日期

            } else if (state === "S") {  //已退款
                $("#Vrefund").css("display", "none");
                $("#coupnState").html("已退款！");
            }

            $id.find(".proName").html(result.item);    //项目名称
            $id.find(".proName").attr("id", result.refundnum);
            $id.find(".buyTime").html(result.buy_time);    //购买时间
            $id.find(".consumeTime").html(result.consume_time);    //消费时间
            $id.find(".settleTime").html(result.billing_time);    //结算时间
            $id.find(".Monetary").html(result.deserve);    //消费者购买金额
            $id.find(".onlineDate").html(result.create_time);    //上线日期
        },
        fail_fun: function (error_info) {
            if (error_info == "logout") {
                top.window.location.href = "../../login.html";
            } else {
                $("#verified").css("display", "none");
                alert(error_info);
            }
        }
    });
}

var current = new Date();     //当前日期
var selectArr = [];    //高亮选中数组
var flag = true;   //全选记录
var table1 = null;   //结款申请
var table2 = null;   //结款记录
var table3 = null;   //商家银行账户修改
var table4 = null;   //商家银行账户修改记录
var table5 = null;   //退款记录

var settleApply = [];
var settleTdatas = [];  //存储结款记录表格总数据
var settleTres = [];   // 结款记录数据
function settleTdatas_getdatas(type) {     //结款记录总数据
    ajax_request({
        url: CHECKVERIFY_APPLY_URL,
        type: CHECKVERIFY_APPLY_TYPE,
        data: {
            "type": type
        },
        async: false,
        success_fun: function (data) {
            settleTdatas = data;    //结款记录总数据
            if (type == "H") {
                settleTres = table_operation.date_compare(
                    moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                    moment(current).format('YYYY年MM月DD日'), settleTdatas);
            } else {
                settleApply = data;
            }
        }
    });
}

var bankTdatas = [];  //存储银行账户修改记录表格总数据
var bankTres = [];  // 商家银行账户修改记录
function bankTdatas_getdatas() {     //商家银行账户修改记录总数据
    ajax_request({
        url: CHECKVERIFY_BANKEDIT_URL,
        type: CHECKVERIFY_BANKEDIT_TYPE,
        data: {
            "type": "H"
        },
        async: false,
        success_fun: function (data) {
            bankTdatas = data;    //结款记录总数据
            bankTres = table_operation.date_compare(
                moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                moment(current).format('YYYY年MM月DD日'), data);
        }
    });
}

var refundTdatas = [];  //存储退款记录表格总数据
var refundTres = [];   // 退款记录
function refundTdatas_getdatas() {     //退款记录总数据
    ajax_request({
        url: CHECKVERIFY_REFUNDRECORD_URL,
        type: CHECKVERIFY_REFUNDRECORD_TYPE,
        async: false,
        success_fun: function (data) {
            refundTdatas = data;    //结款记录总数据
            refundTres = table_operation.date_compare(
                moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                moment(current).format('YYYY年MM月DD日'), refundTdatas);
        }
    });
}


var selfFun = {
    //结款申请（记录）选择
    selectCheckbox: function ($tr) {   //高亮复选框选中函数
        if ($tr.hasClass('selected')) {    //表格行选中状态时
            $tr.find("td").eq(0).find(":checkbox").prop("checked", true).val("1");  //复选框选中

            if (selectArr.length < 1) {    //selectArr没有数据
                selectArr.push($tr.attr("id"));

            } else {    //selectArr已经存有数据，判断添加的id是否已经存在selectArr中
                if (selectArr.indexOf($tr.attr("id")) == -1) {   //不存在时添加数据
                    selectArr.push($tr.attr("id"));
                }
            }
        } else {   //表格行未选中

            $tr.find("td").eq(0).find(":checkbox").prop("checked", false).val("0");   //复选框去除选中

            selectArr = $.grep(selectArr, function (num, index) {   //从selectArr中过滤该id
                return num == $tr.attr("id");
            }, true);

        }
    },
    //高亮
    getselected: function (id) {
        $(id + ' tbody').on('click', 'td', function () {
            var $tr = $(this).closest("tr");
            $tr.toggleClass('selected');

            selfFun.selectCheckbox($tr);
        });
    },
    //全选
    allSelected: function (id) {
        $(id + ' .selectAll').on('click', function () {
            var $trArr = $(this).closest(".table").find("tbody tr");
            selectArr = [];

            if ($trArr.length > 0 && !!$($trArr[0]).attr("id")) {
                if (flag) {   //未选中
                    for (var i = 0; i < $trArr.length; i++) {
                        $($trArr[i]).find("input[type='checkbox']").prop("checked", true);
                        $($trArr[i]).addClass('selected');

                        selectArr.push($($trArr[i]).attr("id"));
                    }
                    flag = false;
                } else {   //已选中
                    for (var j = 0; j < $trArr.length; j++) {
                        $($trArr[j]).find("input[type='checkbox']").prop("checked", false);
                        $($trArr[j]).removeClass('selected');
                    }

                    selectArr = [];
                    flag = true;
                }
            }
        });
    }
};

//表格数据加载
var settleV_table = {
    //  1  结款申请
    settleapply_datatables: function () {
        settleTdatas_getdatas("V");
        return $('#settleApplyTable').DataTable({
            "data": settleApply,
            "destroy": true,
            /*"dom": '<".down"B>t<"bottom info"i>',
             buttons: [{
             extend: 'excelHtml5',
             text: '下载结款明细',
             filename: "结款申请",
             customize: function (xlsx) {
             var sheet = xlsx.xl.worksheets['sheet1.xml'];
             $('row c[r^="C"]', sheet).attr('s', '2');
             },
             }],*/
            "dom": 't<"bottom info"i><"tablePage"p>',
            "autoWidth": false,
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
            "rowId": "applynum",
            "columnDefs": [   //第1列选择
                {
                    "targets": 0,
                    "data": null,
                    "width": "10%",
                    "defaultContent": "<div class='checkbox'><input type='checkbox' value='0' class='isSeleced'/><label></label></div>"
                },

                {     //第2列提交时间
                    "targets": 1,
                    "data": 'submit_time',
                    "width": "15%"
                },

                {    //第3列为商家账号
                    "targets": 2,
                    "data": 'account',
                    "width": "15%"
                },

                {    //第4列为开户名称
                    "targets": 3,
                    "data": 'person_or_company_name',
                    "width": "10%"
                },

                {    //第5列为开户行
                    "targets": 4,
                    "data": "bank_name",
                    "width": "10%"
                },

                {    //第6列为银行账号
                    "targets": 5,
                    "data": "bank_account",
                    "width": "20%"
                },

                {    //第7列为提款金
                    "targets": 6,
                    "data": 'balance',
                    "width": "10%"
                },

                {    //第8列为状态
                    "targets": 7,
                    "data": null,
                    "width": "10%",
                    "defaultContent": "申请结款"
                }
            ]
        });
    },
    //  2  结款记录
    settleRecord_datatables: function () {
        settleTdatas_getdatas("H");
        return $('#settleRecordTable').DataTable({
            "data": settleTres,
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
            "rowId": "applynum",
            "columnDefs": [   //第1列选择
                {
                    "targets": 0,
                    "data": null,
                    "width": "10%",
                    "defaultContent": "<div class='checkbox'><input type='checkbox' value='0' class='isSeleced'/><label></label></div>"
                },

                {     //第2列提交时间
                    "targets": 1,
                    "data": 'submit_time',
                    "width": "15%"
                },

                {    //第3列为商家账号
                    "targets": 2,
                    "data": 'account',
                    "width": "15%"
                },

                {    //第4列为开户名称
                    "targets": 3,
                    "data": 'bank_name',
                    "width": "10%"
                },

                {    //第5列为开户行
                    "targets": 4,
                    "data": "person_or_company_name",
                    "width": "10%"
                },

                {    //第6列为银行账号
                    "targets": 5,
                    "data": "bank_account",
                    "width": "20%"
                },

                {    //第7列为提款金
                    "targets": 6,
                    "data": 'balance',
                    "width": "10%"
                },

                {    //第8列为状态
                    "targets": 7,
                    "data": 'status',
                    "width": "10%"
                }
            ]
        });
    },
    //  3  商家银行账户修改
    busBankAcc_datatables: function () {
        var res = null;
        return $('#bankAccountTable').DataTable({
            ajax: {
                url: CHECKVERIFY_BANKEDIT_URL,
                type: CHECKVERIFY_BANKEDIT_TYPE,
                data: {
                    type: "V"
                },
                async: false,
                dataSrc: function (data) { //提交成功的回调函数
                    if (data.success) {
                        res = data.content;
                        return res;
                    }
                }
            },
            "data": res,
            "destroy": true,
            "dom": 't<"bottom info"i><"tablePage"p>',
            "autoWidth": false,
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
            "columnDefs": [   //第1列商家编号
                {
                    "targets": 0,
                    "data": 'num',
                    "width": "18%"
                },

                {    //第2列为商家账号
                    "targets": 1,
                    "data": 'account',
                    "width": "17%"
                },

                {    //第3列为BD联系人
                    "targets": 2,
                    "data": "bd_info",
                    "width": "20%"
                },

                {    //第4列为状态
                    "targets": 3,
                    "data": 'peer_operation_type',
                    "width": "10%"
                },

                {     //第5列提交时间
                    "targets": 4,
                    "data": 'submit_time',
                    "width": "20%"
                },

                {    //第6列为操作
                    "targets": 5,
                    "data": null,
                    "width": "15%",
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        return "</button>&nbsp;<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>";
                    }
                }
            ],
            "drawCallback": function (settings) {
                $(".lookIcon").on("click", function () {
                    var id = encodeURIComponent($(this).closest("tr").attr("id"));
                    $('#rightIframe', window.top.document).attr('src', 'settleVerify/busbankAcc.html?id=' + id);
                });
            }
        });
    },
    //  4  商家银行账户修改记录
    busBankAccRecord_datatables: function () {
        bankTdatas_getdatas();
        return $('#bankAccEditRecordTable').DataTable({
            "data": bankTres,
            "destroy": true,
            "dom": 't<"bottom info"i><"tablePage"p>',
            "autoWidth": false,
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
            "columnDefs": [   //第1列商家编号
                {
                    "targets": 0,
                    "data": 'num',
                    "width": "18%"
                },

                {    //第2列为商家账号
                    "targets": 1,
                    "data": 'account',
                    "width": "17%"
                },

                {    //第3列为BD联系人
                    "targets": 2,
                    "data": "bd_info",
                    "width": "20%"
                },

                {    //第4列为状态
                    "targets": 3,
                    "data": 'status',
                    "width": "10%"
                },

                {     //第5列提交时间
                    "targets": 4,
                    "data": 'submit_time',
                    "width": "20%"
                },

                {    //第6列为操作
                    "targets": 5,
                    "data": null,
                    "width": "15%",
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        return "</button>&nbsp;<button class='btn btn-default glyphicon glyphicon-hand-right lookIcon'>&nbsp;查看</button>";
                    }
                }
            ],
            "drawCallback": function (settings) {
                $(".lookIcon").on("click", function () {
                    var id = encodeURIComponent($(this).closest("tr").attr("id"));
                    $('#rightIframe', window.top.document).attr('src', 'settleVerify/busbankAcc.html?id=' + id);
                });
            }
        });
    },
    //  5  退款记录
    refundRecord_datatables: function () {
        refundTdatas_getdatas();
        return $('#refundRecordTable').DataTable({
            "data": refundTres,
            "destroy": true,
            "dom": 't<"bottom info"i><"tablePage"p>',
            "autoWidth": false,
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
                {   //第1列提交时间
                    "targets": 0,
                    "data": 'submit_time',
                    "width": "15%"
                },

                {    //第2列为退款号
                    "targets": 1,
                    "data": 'number',
                    "width": "10%"
                },

                {    //第3列为团购券号码
                    "targets": 2,
                    "data": "token",
                    "width": "10%"
                },

                {    //第4列为项目名称
                    "targets": 3,
                    "data": 'item',
                    "width": "10%"
                },

                {    //第5列购买金额
                    "targets": 4,
                    "data": 'deserve',
                    "width": "10%"
                },

                {     //第6列团购券状态
                    "targets": 5,
                    "data": 'status',
                    "width": "10%"
                },

                {     //第7列消费时间
                    "targets": 6,
                    "data": 'consume_time',
                    "width": "15%"
                },

                {     //第8列上线时间
                    "targets": 7,
                    "data": 'create_time',
                    "width": "10%"
                },

                {    //第9列为操作
                    "targets": -1,
                    "data": null,
                    "width": "10%",
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        return "</button>&nbsp;<button class='btn btn-default viewReasons'>退款原因</button>" +
                            "<span class='reason' style='display:none'>" + data.refund_reason + "</span>"
                    }
                }
            ],
            "drawCallback": function (settings) {
                $(".viewReasons").on("click", function () {
                    var reason = $(this).closest("tr").find(".reason").html();
                    window.parent.set_modal({
                        path: "modal/setV/refundReasonModal.html",
                        loadFun: function () {
                            $("#reasonInput", window.top.document).html(reason);
                        }
                    });
                });
            }
        });
    }
};

$(function () {
    //日期初始化
    common.datepicker_range_initiate(current);

    // 顶部菜单栏内容切换
    $("#settleList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        flag = true;   //复位全选
        selectArr = [];    // 清空数组
        $(".shopAccount").val(""); //清空搜索输入框
        $("#couponNumInput").val("");
        sessionStorage.setItem('topLists', $(this).attr("id"));   //标记顶部菜单

        if ($("#settleApply").hasClass("active")) {    //结款申请

            $("#settleApplyDiv").siblings().css("display", "none");
            $("#settleApplyDiv").css("display", "");

            table1 = settleV_table.settleapply_datatables();

        } else if ($("#settleRecord").hasClass("active")) {    //结款记录

            $("#settleRecordDiv").siblings().css("display", "none");
            $("#settleRecordDiv").css("display", "");

            table2 = settleV_table.settleRecord_datatables();
            table_operation.datepicker_reset(current, "#settleRecordDiv");   //重置日期

        } else if ($("#bankAccountEdit").hasClass("active")) {    //商家银行账户

            $("#bankAccountEditDiv").siblings().css("display", "none");
            $("#bankAccountEditDiv").css("display", "");

            table3 = settleV_table.busBankAcc_datatables();

        } else if ($("#bankAccoutRecord").hasClass("active")) {   //商家银行账户修改

            $("#bankAccEditRecordDiv").siblings().css("display", "none");
            $("#bankAccEditRecordDiv").css("display", "");

            table4 = settleV_table.busBankAccRecord_datatables();
            table_operation.datepicker_reset(current, "#bankAccEditRecordDiv");   //重置日期

        } else if ($("#Refund").hasClass("active")) {     //操作退款选中
            $("#RefundDiv").siblings().css("display", "none");
            $("#RefundDiv").css("display", "");

            $(".refundserachDiv").css("display", "none");

        } else if ($("#refundRecord").hasClass("active")) {     //退款记录选中
            $("#refundRecordDiv").siblings().css("display", "none");
            $("#refundRecordDiv").css("display", "");

            table5 = settleV_table.refundRecord_datatables();
            table_operation.datepicker_reset(current, "#refundRecordDiv");   //重置日期
        }
    });


//顶部菜单刷新时定位
    if (sessionStorage.getItem('topLists') != null) {
        $("#" + sessionStorage.getItem('topLists')).trigger("click");
    } else {
        table1 = settleV_table.settleapply_datatables();
    }


//********************************  结款申请 1 ********************************
    //选中高亮
    selfFun.getselected('#settleApplyTable');

    //点击按钮（全选）
    selfFun.allSelected('#settleApplyTable');

    //下载当日任务
    $("#downloadBtn").click(function () {
        //$("#settleApplyDiv .down a").trigger("click");   //触发下载按钮
        window.open("/bus-manage/settlement/items/dtasks/", '_self');
    });

    //上传结账信息
    $("#uploadBtn input").change(function (e) {   //excel上传
        register.excelFile_upload();
    });

    //结款成功
    $("#successBtn").on("click", function () {
        if (selectArr.length > 0) {
            window.parent.set_modal({
                path: "modal/setV/payok.html",
                para: selectArr
            });
        }
    });

    //结款失败
    $("#failBtn").on("click", function () {
        if (selectArr.length > 0) {
            window.parent.set_modal({
                path: "modal/setV/payfalse.html",
                para: selectArr
            });
        }
    });

//****************************  结款记录 2 ****************************
    //高亮
    selfFun.getselected('#settleRecordTable');

    //点击按钮（全选）
    selfFun.allSelected('#settleRecordTable');

    //日期改变时
    $(".dateFrom", "#settleRecordDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#settleRecordDiv .dateTo').data("DateTimePicker").minDate(e.date);
        settleTres = table_operation.datepickerFrom_change("#settleRecordDiv", settleTdatas);
        table2.clear().rows.add(settleTres).draw();
    });
    $(".dateTo", "#settleRecordDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#settleRecordDiv .dateFrom').data("DateTimePicker").maxDate(e.date);
        settleTres = table_operation.datepickerTo_change("#settleRecordDiv", settleTdatas);
        table2.clear().rows.add(settleTres).draw();
    });


    //下载结款明细(选中项)
    $("#downloadReBtn").click(function () {
        window.open("/bus-manage/settlement/items/drecord/?applynums=" + JSON.stringify(selectArr), '_self');
    });


//****************************  商家银行账户修改 3 ****************************


//****************************  商家银行账户修改记录 4 ****************************
    $(".dateFrom", "#bankAccEditRecordDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#bankAccEditRecordDiv .dateTo').data("DateTimePicker").minDate(e.date);
        bankTres = table_operation.datepickerFrom_change("#bankAccEditRecordDiv", bankTdatas);
        table4.clear().rows.add(bankTres).draw();
    });

    $(".dateTo", "#bankAccEditRecordDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#bankAccEditRecordDiv .dateFrom').data("DateTimePicker").maxDate(e.date);
        bankTres = table_operation.datepickerTo_change("#bankAccEditRecordDiv", bankTdatas);
        table4.clear().rows.add(bankTres).draw();
    });


//****************************  操作退款 5 ****************************
    $("#couponSearch").click(function () {    //团购券号码查询
        refund_search($("#couponNumInput").val());
    });

    $("#Vrefund").on("click", function () {
        var refundPara = {
            token: $("#couponNum").html(),
            refundnum: $("#verified").find(".proName").attr("id")
        };
        window.parent.set_modal({
            path: "./modal/setV/refundModal.html",
            para: refundPara
        });
    });


//****************************  退款记录 6 ****************************
    $(".dateFrom", "#refundRecordDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#refundRecordDiv .dateTo').data("DateTimePicker").minDate(e.date);
        refundTres = table_operation.datepickerFrom_change("#refundRecordDiv", refundTdatas);
        table5.clear().rows.add(refundTres).draw();
    });

    $(".dateTo", "#refundRecordDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#refundRecordDiv .dateFrom').data("DateTimePicker").maxDate(e.date);
        refundTres = table_operation.datepickerTo_change("#refundRecordDiv", refundTdatas);
        table5.clear().rows.add(refundTres).draw();
    });


    /****************************  通用 ****************************/
        // 搜索商家账号
    table_operation.input_search(table1, "#settleApplyDiv .shopAccount", 2);
    table_operation.input_search(table2, "#settleRecordDiv .shopAccount", 2);
    table_operation.input_search(table3, "#bankAccountEditDiv .shopAccount", 1);
    table_operation.input_search(table4, "#bankAccEditRecordDiv .shopAccount", 1);
    table_operation.input_search(table5, "#refundRecordDiv .shopAccount", 1);

    //状态搜索
    table_operation.select_search(table4, "#bankAccEditRecordDiv .shopAccount", "全部", 3);

    //每页显示条目数
    table_operation.items_change("#settleApplyDiv", table1);
    table_operation.items_change("#settleRecordDiv", table2);


});
