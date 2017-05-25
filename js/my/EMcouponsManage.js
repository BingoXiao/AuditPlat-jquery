//获取url的参数(注册号)
var loc = decodeURIComponent(window.location.search);
var para = common.getUrlParameters(loc, 'num') || "";
var id = common.getUrlParameters(loc, 'id');

var myTable = null;      //我的优惠券表格
var searchTable = null;  //搜索门店表格
var selectedTable = null;//已选门店表格

var myCoupondData = [];  //我的优惠券总数据
var res = [];            //我的优惠券筛选数据
var editID;  //修改
var searchCRes = [];     //搜索门店数据
var selectedCRes = [];   //已选门店数据
var count = 0;
var current = new Date();    //当前日期

function refreshCouponsTable() {
    tableFun.mycoupons_getdatas();
    myTable.clear().rows.add(res).draw();
}
var tableFun = {
    //获取所有优惠券
    mycoupons_getdatas: function () {
        ajax_request({
            url: EVENTS_CMTABLE_URL,
            type: EVENTS_CMTABLE_TYPE,
            async: false,
            success_fun: function (data) {
                myCoupondData = data.coupons;
                res = table_operation.date_compare(
                    moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                    moment(current).format('YYYY年MM月DD日'), myCoupondData);
            }
        });
    },
    //我的优惠券
    myCoupons: function () {
        tableFun.mycoupons_getdatas();
        return $('#couponsTable').DataTable({
            "data": res,
            "destroy": true,
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
                {    //第1列创建时间
                    "targets": 0,
                    "data": 'create_datetime',
                    "width": '20%'
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
                    "width": '10%',
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        if ((data.buses)[0] !== "全平台通用") {
                            return "<span class='viewBuses'>指定门店（" + (data.buses).length + "家）</span>";
                        } else {
                            return (data.buses)[0];
                        }
                    }
                },

                {     //第6列为操作
                    "targets": -1,
                    "data": null,
                    "width": '20%',
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        return "<button class='btn btn-default glyphicon glyphicon-pencil editIcon' style='margin-right:6px;'>&nbsp;修改" +
                            "</button><button class='btn btn-default glyphicon glyphicon-trash deleteIcon'>&nbsp;删除</button>";
                    }
                }
            ],
            "drawCallback": function (settings) {
                //点击查看指定门店
                $(".viewBuses").on("click", function () {
                    var $tr = $(this).closest("tr");
                    var id = encodeURIComponent($tr.attr("id"));
                    var name = encodeURIComponent($tr.find(".couponsName").html());

                    $('#rightIframe', window.top.document).attr('src',
                        './eventsManage/wholeShopsTable.html?id=' + id + "&name=" + name);
                });

                //点击删除
                $(".deleteIcon").on("click", function () {
                    var id = $(this).closest("tr").attr("id");

                    window.parent.set_modal({
                        path: "./modal/events/deleteCouponsModal.html",
                        para: id
                    });
                });

                //点击修改
                $(".editIcon").on("click", function () {
                    editID = $(this).closest("tr").attr("id");

                    //获取数据
                    $("#Newcoupons").trigger("click");
                });
            }
        });
    },
    //修改优惠券（获取信息）
    CouponsInfo: function (id) {
        ajax_request({
            url: EVENTS_CMGETINFO_URL(id),
            type: EVENTS_CMGETINFO_TYPE,
            success_fun: function (res, table) {
                var data = res.couponinfo;
                //发放时间
                if (data.provide_starttime == "" && data.provide_starttime == "") {
                    $("#provide24hours").prop("checked", true);
                } else {
                    $("#providehoursPeriod").prop("checked", true);
                }
                $("#provideFrom").val(data.provide_starttime);
                $("#provideTo").val(data.provide_starttime);
                //有效时间
                if (data.valid_startdate == "" && data.valid_enddate == "") {
                    $("#valid24hours").prop("checked", true);
                } else {
                    $("#valideHoursPeriod").prop("checked", true);
                }
                $("#validFrom").val(data.valid_startdate);
                $("#validTo").val(data.valid_enddate);

                if ((res.blist).length == 0) {  //全部门店
                    $("#wholeShops").prop("checked", true);
                } else {
                    $("#chooseShop").prop("checked", true);
                    $("#chooseShopsDiv").css("display", "");
                    $("#editBtn").css("display", "");  //修改按钮
                    $("#addBtn").css("display", "none");
                    count = (res.blist).length;
                    selectedCRes = res.blist;
                    $("#badge").html((res.blist).length);
                    selectedTable.clear().rows.add(res.blist).draw();
                }

                $("input[name='CP']").val(data.type);
                $("#couponName").val(data.name);
                $("#total").val(data.amount_full);
                $("#gap").val(data.amount_cut);
            }
        });
    },
    //新增优惠券（门店搜索）
    searchCoupons: function () {
        var res = null;
        return $('#searchShopsTable').DataTable({
            ajax: {
                url: EVENTS_CMSEARCHSHOPS_URL,
                type: EVENTS_CMSEARCHSHOPS_TYPE,
                async: false,
                dataSrc: function (data) { //提交成功的回调函数
                    if (data.success) {
                        searchCRes = (data.content).buses;
                        return res = (data.content).buses;// 对返回数据进行处理
                    }
                }
            },
            "data": res,
            "destroy": true,
            "dom": 't<"bottom info"i>',
            "autoWidth": false,
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "rowId": "bus_id",
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
                    "defaultContent": "<span class='fa fa-plus-square addShops'></span>"
                },

                {     //第2列门店名称
                    "targets": 1,
                    "data": 'busname',
                    "width": '50%'
                },

                {     //第3列门店账号
                    "targets": 2,
                    "data": 'account',
                    "width": '40%'
                }
            ],
            "drawCallback": function (settings) {
                $(".addShops").on("click", function () {
                    var id = $(this).closest("tr").attr("id");
                    selfFun.selectFun(id);
                });
            }
        });
    },
    //已选门店
    selectedCoupons: function () {
        return $('#selectedShopsTable').DataTable({
            "data": selectedCRes,
            "destroy": true,
            "dom": 't<"bottom info"i>',
            "autoWidth": false,
            "ordering": false,
            "lengthChange": false,
            "pageLength": 10,
            "rowId": "bus_id",
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

                {     //第2列门店名称
                    "targets": 1,
                    "data": 'busname',
                    "width": '45%'
                },

                {     //第3列门店账号
                    "targets": 2,
                    "data": 'account',
                    "width": '45%'
                }
            ],
            "drawCallback": function (settings) {
                //去除门店
                $(".minusShops").on("click", function () {
                    var id = $(this).closest("tr").attr("id");
                    selfFun.deleteFun(id);
                });
            }
        });
    }
};
var selfFun = {
    //新增优惠券验证
    addCouponsV: function ($input) {
        for (var i = 0; i < $input.length; i++) {
            if ($.trim($($input[i]).val()) === "") {
                $($input[i]).addClass("errorInput");

                if ($("#provide24hours").prop("checked")) {
                    $("#provideFrom").removeClass("errorInput");
                    $("#provideTo").removeClass("errorInput");
                }

                if ($("#valid24hours").prop("checked")) {
                    $("#validFrom").removeClass("errorInput");
                    $("#validTo").removeClass("errorInput");
                }
            }
        }
        var aa = moment($('#provideFrom').data("DateTimePicker").date()).format("HH:mm");
        var bb = moment($('#provideTo').data("DateTimePicker").date()).format("HH:mm");
        if (aa >= bb) {
            $('#provideFrom, #provideTo').addClass("errorInput");
        }
    },
    //搜索门店后添加门店
    selectFun: function (id) {
        var addData = null;

        $.each(searchCRes, function (index, item) {
            if (item.bus_id == id) {
                addData = searchCRes[index];
            }
        });

        if (($.grep(selectedCRes, function (cur, i) {
                return cur.bus_id == id;
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
            if (item.bus_id == id) {
                deleteIndex = index;
            }
        });

        if (selectedCRes[deleteIndex]) {
            selectedCRes = $.grep(selectedCRes, function (obj, index) {   //从selectArr中过滤该id
                return index !== deleteIndex;
            });
            count--;
        }
        selectedTable.clear().rows.add(selectedCRes).draw();

        //减少徽章值
        $("#badge").html(count);
    },
    //新增优惠券
    AddCoupon: function () {
        var beginV, endV, beginP, endP;
        var shopsID = [];

        if ($("#providehoursPeriod").prop("checked")) {
            beginP = $("#provideFrom").val();
            endP = $("#provideTo").val();
        } else if ($("#provide24hours").prop("checked")) {
            beginP = "";
            endP = "";
        }

        if ($("#valideHoursPeriod").prop("checked")) {
            beginV = $("#validFrom").val();
            endV = $("#validTo").val();

            beginV = beginV.replace(/年|月/g, "-").replace(/日/g, "");
            endV = endV.replace(/年|月/g, "-").replace(/日/g, "");
        } else if ($("#valid24hours").prop("checked")) {
            beginV = "";
            endV = "";
        }

        if ($("#wholeShops").prop("checked")) {
            shopsID = [];
        } else if ($("#chooseShop").prop("checked")) {
            $.each(selectedCRes, function (index, value) {
                shopsID.push(value.bus_id);
            });
        }

        ajax_request({
            url: EVENTS_CMADDSHOPS_URL,
            type: EVENTS_CMADDSHOPS_TYPE,
            data: JSON.stringify({
                "type": $("input[name='CP']:checked").val(),
                "name": $("#couponName").val(),
                "amount_full": $("#total").val(),
                "amount_cut": $("#gap").val(),
                "provide_starttime": beginP,
                "provide_endtime": endP,
                "valid_startdate": beginV,
                "valid_enddate": endV,
                "bus_ids": shopsID
            }),
            success_fun: function (data) {
                alert("新增成功！");
                $("#MyCoupons").trigger("click");
            }
        });
    },
    //修改优惠券
    editCoupon: function (id) {
        var beginV, endV, beginP, endP;
        var shopsID = [];

        if ($("#providehoursPeriod").prop("checked")) {
            beginP = $("#provideFrom").val();
            endP = $("#provideTo").val();
        } else if ($("#provide24hours").prop("checked")) {
            beginP = "";
            endP = "";
        }

        if ($("#valideHoursPeriod").prop("checked")) {
            beginV = $("#validFrom").val();
            endV = $("#validTo").val();

            beginV = beginV.replace(/年|月/g, "-").replace(/日/g, "");
            endV = endV.replace(/年|月/g, "-").replace(/日/g, "");
        } else if ($("#valid24hours").prop("checked")) {
            beginV = "";
            endV = "";
        }

        if ($("#wholeShops").prop("checked")) {
            shopsID = [];
        } else if ($("#chooseShop").prop("checked")) {
            $.each(selectedCRes, function (index, value) {
                shopsID.push(value.bus_id);
            });
        }

        ajax_request({
            url: EVENTS_CMEDIT_URL(id),
            type: EVENTS_CMEDIT_TYPE,
            data: JSON.stringify({
                "type": $("input[name='CP']:checked").val(),
                "name": $("#couponName").val(),
                "amount_full": $("#total").val(),
                "amount_cut": $("#gap").val(),
                "provide_starttime": beginP,
                "provide_endtime": endP,
                "valid_startdate": beginV,
                "valid_enddate": endV,
                "bus_ids": shopsID
            }),
            success_fun: function (data) {
                alert("修改成功！");
                $("#MyCoupons").trigger("click");
                editID = null;
            }
        });
    }
};

$(function () {

//时间初始化
    common.datepicker_Timerange_initiate();
    common.datepicker_range_initiate(current);//日期初始化

//所有表格初始化
    myTable = tableFun.myCoupons();
    searchTable = tableFun.searchCoupons();
    selectedTable = tableFun.selectedCoupons();

//顶部菜单选择
    $("#eventsList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        $("#couponsSerach").val("");    //清空搜索栏
        //sessionStorage.setItem('topListE', $('#eventsList .active').attr("id"));

        if ($("#MyCoupons").hasClass("active")) {    //我的优惠券
            $("#myCouponsDiv").css("display", "");
            $("#addCouponsDiv").css("display", "none");
            tableFun.mycoupons_getdatas();
            myTable.clear().rows.add(res).draw();
            editID = null;

            $("input[type='text']").val("");
            $("input").removeClass("errorInput");

            $("#commonCoupon").prop("checked", true);
            $("#provide24hours").prop("checked", true);
            $("#valid24hours").prop("checked", true);

        } else if ($("#Newcoupons").hasClass("active")) {    //新增优惠券
            $("#myCouponsDiv").css("display", "none");
            $("#addCouponsDiv").css("display", "");

            searchTable.ajax.reload();
            selectedTable.clear().rows.add(selectedCRes).draw();

            if (!!editID) {   //修改
                tableFun.CouponsInfo(editID);
                $("#editBtn").css("display", "");
                $("#addBtn").css("display", "none");
            } else {   //新增
                $("#editBtn").css("display", "none");
                $("#addBtn").css("display", "");
            }
        }
    });
//顶部菜单刷新时定位
    /*if (sessionStorage.getItem('topListE') != null) {
     $("#" + sessionStorage.getItem('topListE')).trigger("click");
     }*/


    /********************我的优惠券************************/
//选中高亮
    common.selectShow("#couponsTable", "td");

//日期选择器改变时，商家申请记录表格数据过滤
    $(".dateFrom", "#myCouponsDiv").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#myCouponsDiv .dateTo').data("DateTimePicker").minDate(e.date);
        res = table_operation.datepickerFrom_change("#myCouponsDiv", myCoupondData);
        myTable.clear().rows.add(res).draw();
    });

    $(".dateTo", "#myCouponsDiv").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#myCouponsDiv .dateFrom').data("DateTimePicker").maxDate(e.date);
        res = table_operation.datepickerTo_change(e, "#myCouponsDiv", myCoupondData);
        myTable.clear().rows.add(res).draw();
    });

//自定义搜索框
    table_operation.input_search(myTable, "#couponsSerach", 2);
//页面跳转
    table_operation.pageJump(myTable, "#previous", "#next", "#first", "#last", "#pageIndex");


    /************************新增优惠券************************/
//顶部菜单选择
    $("#addCouponsTable li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        if ($("#selectedShops").hasClass("active")) {    //已选门店
            $("#selectedShopsDiv").css("display", "");
            $("#searchShopsDiv").css("display", "none");

            selectedTable.clear().rows.add(selectedCRes).draw();

        } else if ($("#shopsSearch").hasClass("active")) {    //门店搜索

            $("#selectedShopsDiv").css("display", "none");
            $("#searchShopsDiv").css("display", "");

            searchTable.ajax.reload();
        }
    });


//日期选择器改变时，商家申请记录表格数据过滤
    $("#validFrom").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('#validTo').data("DateTimePicker").minDate(e.date);
    });

    $("#validTo").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('#validFrom').data("DateTimePicker").maxDate(e.date);
    });


//选择门店（显示表格进行添加）
    $(document).on("click", "input[name='chooseShops']", function () {
        if ($("#wholeShops").prop("checked")) {
            $("#chooseShopsDiv").css("display", "none");
        } else {
            $("#chooseShopsDiv").css("display", "");
            $("#selectedShops").trigger("click");
        }
    });

    //点击选择门店右边的搜索按钮
    $("#chooseShopBtn").on("click", function () {
        $("#shopsSearch").trigger("click");

        $("#chooseShop").prop("checked", true);
        $("#chooseShopsDiv").css("display", "");

        $("#selectedShopsDiv").css("display", "none");
        $("#searchShopsDiv").css("display", "");
    });

//选中高亮
    common.selectShow("#searchShopsTable", "td");

    var $input = $("#addCouponsDiv input[type='text']").not('.verifyNumInput');
    for (var i = 0; i < $input.length; i++) {
        $($input[i]).on("input propertyChange", function () {   //输入改变时
            $(this).removeClass("errorInput");
        });
    }
    //点击新增
    $("#addBtn").on("click", function () {
        selfFun.addCouponsV($input);
        if ($(".errorInput").length > 0) {
            alert("请完善优惠券信息！");
        } else {
            selfFun.AddCoupon();
        }
    });

    //点击修改
    $("#editBtn").on("click", function () {
        selfFun.addCouponsV($input);
        if ($(".errorInput").length > 0) {
            alert("请完善优惠券信息！");
        } else {
            selfFun.editCoupon(editID);
        }
    });

    //门店搜索
    table_operation.input_search(searchTable, "#searchShopsDiv .verifyNumInput", 1);

    //页面跳转
    table_operation.pageJump(selectedTable, "#previous1", "#next1", "#first1", "#last1", "#pageIndex1");
    table_operation.pageJump(searchTable, "#previous2", "#next2", "#first2", "#last2", "#pageIndex2");
});


