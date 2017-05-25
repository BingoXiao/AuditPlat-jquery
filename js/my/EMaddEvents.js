//获取url的参数id
var url = decodeURIComponent($('#rightIframe', window.top.document).attr('src'));
var loc = url.substring(url.indexOf("?"), url.length);
var ID = common.getUrlParameters(loc, 'id');

var selectedCRes = [];  //已添加优惠券
var couponsListRes = [];  //优惠券
var shopID = [];
var count = 0;
var current = new Date();    //当前日期
var table = {
    selectedCTable: null,
    ClistTable: null,
    //优惠券列表
    couponsList: function () {
        var res = null;
        return $('#couponsListTable').DataTable({
            ajax: {
                url: EVENTS_CLTABLE_URL,
                type: EVENTS_CLTABLE_TYPE,
                async: false,
                dataSrc: function (data) { //提交成功的回调函数
                    if (data.success) {
                        couponsListRes = (data.content).coupons;
                        return res = (data.content).coupons;// 对返回数据进行处理
                    }
                }
            },
            "data": res,
            "dom": 't<"bottom info"i>',
            "autoWidth": false,
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "rowId": "id",
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录",
                "zeroRecords": "没有找到记录",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "info": "共有 _TOTAL_ 条, 每页显示：10条"
            },
            "columnDefs": [
                {    //第1列选择
                    "targets": 0,
                    "data": null,
                    "width": '10%',
                    "className": "addShops",
                    "defaultContent": "<span class='fa fa-plus-square addShops'></span>"
                },

                {     //第2列类型
                    "targets": 1,
                    "data": 'type',
                    "width": '10%',
                    "className": 'type'
                },

                {     //第3列名称
                    "targets": 2,
                    "data": 'name',
                    "width": '20%',
                    "className": 'couponsName'
                },

                {     //第4列优惠
                    "targets": 3,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        return "满<span>" + data.amount_full + "</span>元减<span>"
                            + data.amount_cut + "</span>元";
                    }
                },

                {     //第5列门店
                    "targets": 4,
                    "data": null,
                    "width": '20%',
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        if ((data.buses).length > 1) {
                            return "<span'>指定门店（" + (data.buses).length + "家）</span>";
                        } else {
                            return "全部门店";
                        }
                    }
                },

                {     //第6列有效时间
                    "targets": 5,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        var begin = (data.valid_startdate).replace(/-/g, "");
                        var end = (data.valid_enddate).replace(/-/g, "");
                        if (data.valid_startdate == "" && data.valid_enddate == "") {
                            return "24小时";
                        } else {
                            return begin + "~" + end;
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                //添加
                $(".addShops").on("click", function () {
                    var id = $(this).closest("tr").attr("id");
                    addEvents.selectFun(id);
                });
            }
        });
    },
    //已添加优惠券
    selectedCoupons: function () {
        return $('#selectedCouponsTable').DataTable({
            "data": selectedCRes,
            "dom": 't<"bottom info"i>',
            "autoWidth": false,
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "rowId": "id",
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录",
                "zeroRecords": "没有找到记录",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "info": "共有 _TOTAL_ 条, 每页显示：10条"
            },
            "columnDefs": [
                {    //第1列选择
                    "targets": 0,
                    "data": null,
                    "width": '10%',
                    "defaultContent": "<span class='fa fa-minus-square minusShops'></span>"
                },

                {     //第2列类型
                    "targets": 1,
                    "data": 'type',
                    "width": '10%',
                    "className": 'type'
                },

                {     //第3列名称
                    "targets": 2,
                    "data": 'name',
                    "width": '20%',
                    "className": 'couponsName'
                },

                {     //第4列优惠
                    "targets": 3,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        return "满<span>" + data.amount_full + "</span>元减<span>"
                            + data.amount_cut + "</span>元";
                    }
                },

                {     //第5列门店
                    "targets": 4,
                    "data": null,
                    "width": '20%',
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        if ((data.buses).length > 1) {
                            return "<span'>指定门店（" + (data.buses).length + "家）</span>";
                        } else {
                            return "全部门店";
                        }
                    }
                },

                {     //第6列有效时间
                    "targets": 5,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        var begin = (data.valid_startdate).replace(/-/g, "");
                        var end = (data.valid_enddate).replace(/-/g, "");
                        if (data.valid_startdate == "" && data.valid_enddate == "") {
                            return "24小时";
                        } else {
                            return begin + "~" + end;
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                //删除
                $(".minusShops").on("click", function () {
                    var id = $(this).closest("tr").attr("id");
                    addEvents.deleteFun(id);
                });
            }
        });
    }
};
var addEvents = {
    //新增活动验证
    addEventsV: function ($input) {
        for (var i = 0; i < $input.length; i++) {
            if ($.trim($($input[i]).val()) === "") {
                $($input[i]).addClass("errorInput");
            }
        }
    },
    //搜索门店后添加门店
    selectFun: function (id) {
        var addData = null;

        $.each(couponsListRes, function (index, item) {
            if (item.id == id) {
                addData = couponsListRes[index];
            }
        });

        if (($.grep(selectedCRes, function (cur, i) {
                return cur.id == id;
            })).length < 1) {
            selectedCRes.push(addData);
            count++;
        }

        $("#badge").html(count); //增加徽章值
    },
    //从已选门店中进行删除
    deleteFun: function (id) {
        var deleteIndex = null;

        $.each(selectedCRes, function (index, item) {
            if (item.id == id) {
                deleteIndex = index;
            }
        });

        if (selectedCRes[deleteIndex]) {
            selectedCRes = $.grep(selectedCRes, function (obj, index) {   //从selectArr中过滤该id
                return index !== deleteIndex;
            });
            count--;
        }

        (table.selectedCTable).clear().rows.add(selectedCRes).draw();

        //减少徽章值
        $("#badge").html(count);
    },
    //获取活动信息
    eventsInfo: function (id) {
        ajax_request({
            url: EVENTS_EDITINFO_URL(id),
            type: EVENTS_EDITINFO_TYPE,
            async: false,
            success_fun: function (data) {
                //日期
                $("#addEventsFrom .dateFrom").val(data.activityinfo.startdate);
                $("#addEventsFrom .dateTo").val(data.activityinfo.enddate);
                $("#eventsName").val(data.activityinfo.name);

                count = (data.clist).length;
                selectedCRes = data.clist;
                $("#badge").html((data.clist).length);
                (table.selectedCTable).clear().rows.add(data.clist).draw();
            }
        });
    },
    //保存（上线或修改）活动
    saveEvents: function (url, type, flag) {
        var start, end;
        start = $("#addEventsFrom .dateFrom").val();
        start = start.replace(/年|月/g, "-").replace(/日/g, "");
        end = $("#addEventsFrom .dateTo").val();
        end = end.replace(/年|月/g, "-").replace(/日/g, "");

        $.each(selectedCRes, function (index, value) {
            shopID.push(value.id);
        });
        ajax_request({
            url: url,
            type: type,
            data: JSON.stringify({
                "name": $("#eventsName").val(),
                "startdate": start,
                "enddate": end,
                "coupon_ids": shopID,
                "flag": flag   //SAVE 保存  UP 上线
            }),
            async: false,
            success_fun: function (data) {
                if (flag == "UP") {
                    alert("成功上线！");
                } else {
                    alert("保存成功！");
                }
                $("#EMeventsList", window.top.document).trigger("click");
            }
        });
    }
};

$(function () {
//表格初始化
    table.selectedCTable = table.selectedCoupons();
    table.ClistTable = table.couponsList();

    if (!!ID) {
        addEvents.eventsInfo(ID);
        parent.window.location.hash += "?id=" + ID;
    }

    common.datepicker_range_initiate(current);//日期初始化


//日期选择器改变时，商家申请记录表格数据过滤
    $(".dateFrom", "#addEventsFrom").on("dp.change", function (e) {
        $('#addEventsFrom .dateTo').data("DateTimePicker").minDate(e.date);
    });
    $(".dateTo", "#addEventsFrom").on("dp.change", function (e) {
        $('#addEventsFrom .dateFrom').data("DateTimePicker").maxDate(e.date);
    });


    //优惠券选择 菜单栏
    $("#coupons li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        if ($("#selectedCoupons").hasClass("active")) {    //已添加优惠券
            $("#selectedCouponsDiv").css("display", "");
            $("#couponsListDiv").css("display", "none");

            (table.selectedCTable).clear().rows.add(selectedCRes).draw();

        } else if ($("#couponsList").hasClass("active")) {    //优惠券列表
            $("#selectedCouponsDiv").css("display", "none");
            $("#couponsListDiv").css("display", "");

            (table.ClistTable).ajax.reload();
        }
    });


    //保存
    $("#saveBtn").on("click", function () {
        if($.trim($("#eventsName").val())==""){
          alert("请填写活动名称！");
        }else{
            if (!!ID) {   //修改
                addEvents.saveEvents(EVENTS_EDITEVENT_URL(ID), EVENTS_EDITEVENT_TYPE, "SAVE");
            } else {    //新增
                addEvents.saveEvents(EVENTS_ONLINE_URL, EVENTS_ONLINE_TYPE, "SAVE");
            }
        }
    });


    var $input = $("input[type='text']");
    for (var i = 0; i < $input.length; i++) {
        $($input[i]).on("input propertyChange", function () {   //输入改变时
            $(this).removeClass("errorInput");
        });
    }
    //立即上线
    $("#onlineBtn").on("click", function () {
        addEvents.addEventsV($input);
        if ($(".errorInput").length > 0) {
            alert("请完善活动信息！");
        } else {
            if (selectedCRes.length == 0) {
                alert("请添加优惠券！");
            } else {
                if (!!ID) {   //修改
                    addEvents.saveEvents(EVENTS_EDITEVENT_URL(ID), EVENTS_EDITEVENT_TYPE, "UP");
                } else {    //新增
                    addEvents.saveEvents(EVENTS_ONLINE_URL, EVENTS_ONLINE_TYPE, "UP");
                }
            }
        }
    });


//页面跳转
    table_operation.pageJump(table.selectedCTable, "#previous1", "#next1", "#first1", "#last1", "#pageIndex1");
    table_operation.pageJump(table.ClistTable, "#previous2", "#next2", "#first2", "#last2", "#pageIndex2");
});


