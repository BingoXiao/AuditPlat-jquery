var table = null;
var res = [];
var eventsList = {
    //获取数据
    getDatas: function(type){
        ajax_request({
            url: EVENTS_ELTABLE_URL,
            type: EVENTS_ELTABLE_TYPE,
            data: {
                type: type
            },
            async: false,
            success_fun: function (data) {
                res = data.alist;
            }
        });
    },
    //填充表格
    tableDatas: function () {
        return $('#eventsTable').DataTable({
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
                {    //第1列活动时间
                    "targets": 0,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        return data.startdate + "~" + data.enddate;
                    }
                },

                {     //第2列活动名称
                    "targets": 1,
                    "data": 'name',
                    "width": '20%'
                },

                {     //第3列优惠券
                    "targets": 2,
                    "data": null,
                    "width": '20%',
                    "render": function (data, type, full, meta) {
                        var $str = "";
                        $.each(data.coupons, function (index, value) {
                            $str += "<div>" + value + "</div>";
                        });
                        return $str;
                    }
                },

                {     //第4列累计抵用金额
                    "targets": 3,
                    "data": null,
                    "width": '10%',
                    "render": function (data, type, full, meta) {
                        return data.amount + "元";
                    }
                },

                {     //第5列状态
                    "targets": 4,
                    "data": 'status',
                    "width": '10%'
                },

                {     //第6列为操作
                    "targets": 5,
                    "data": null,
                    "width": '20%',
                    "className": "operate",
                    "render": function (data, type, full, meta) {
                        if (data.status == "待上线") {
                            return "<button class='btn btn-default glyphicon glyphicon-pencil editIcon'" +
                                " style='margin-right:6px;'>&nbsp;修改" +
                                "</button><button class='btn btn-default glyphicon glyphicon-trash" +
                                " deleteIcon'>&nbsp;删除</button>";
                        } else if (data.status == "已上线") {
                            return "<button class='btn btn-default glyphicon glyphicon-sort-by-attributes-alt" +
                                " offIcon' style='margin-right:6px;'>&nbsp;下线</button><button " +
                                "class='btn btn-default glyphicon glyphicon-hand-right viewIcon'>&nbsp;查看</button>";
                        } else if (data.status == "已下线") {
                            return "<button class='btn btn-default glyphicon glyphicon-hand-right" +
                                " viewIcon'>&nbsp;查看</button>";
                        }
                    }
                }
            ],
            "drawCallback": function (settings) {
                //删除
                $(".deleteIcon").on("click", function () {
                    var $tr = $(this).closest("tr");
                    var id = $tr.attr("id");

                    window.parent.set_modal({
                        path: "./modal/events/deleteEvensModal.html",
                        para:id
                    });
                });

                //查看
                $(".viewIcon").on("click", function (e,a) {
                    var $tr = $(this).closest("tr");
                    var id = encodeURIComponent($tr.attr("id"));

                    $('#rightIframe', window.top.document).attr('src', './eventsManage/viewEvents.html?id=' + id);
                });

                //修改
                $(".editIcon").on("click", function () {
                    var $tr = $(this).closest("tr");
                    var id = encodeURIComponent($tr.attr("id"));

                    $("#EMaddEvents", window.top.document).trigger('click');
                    $('#rightIframe', window.top.document).attr('src', './EMaddEvents.html?id='+ id);
                });

                //下线
                $(".offIcon").on("click", function () {
                    var $tr = $(this).closest("tr");
                    var id = encodeURIComponent($tr.attr("id"));

                    window.parent.set_modal({
                        path: "./modal/events/offlineEventsModal.html",
                        para: id
                    });
                });
            }
        });
    }
};

function refreshEventsTable() {
    if($("#onlineEvents").hasClass("active")){
        eventsList.getDatas("UP");
    }else if($("#wholeEvents").hasClass("active")){
        eventsList.getDatas("ALL");
    }
    table.clear().rows.add(res).draw();
}

$(function () {
    //表格初始化
    table = eventsList.tableDatas();

//顶部菜单选择
    $("#eventsList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        sessionStorage.setItem('topListEL', $('#eventsList .active').attr("id"));

        if ($("#wholeEvents").hasClass("active")) {    //全部活动
            eventsList.getDatas("ALL");
            table.clear().rows.add(res).draw();

        } else if ($("#stayOnEvents").hasClass("active")) {    //待上线活动
            eventsList.getDatas("SAVE");
            table.clear().rows.add(res).draw();

        } else if ($("#onlineEvents").hasClass("active")) {    //已上线活动
            eventsList.getDatas("UP");
            table.clear().rows.add(res).draw();

        } else if ($("#offlineEvents").hasClass("active")) {    //已下线活动
            eventsList.getDatas("DOWN");
            table.clear().rows.add(res).draw();
        }
    });
//顶部菜单刷新时定位
    if (sessionStorage.getItem('topListEL') != null) {
        $("#" + sessionStorage.getItem('topListEL')).trigger("click");
    }else{
        eventsList.getDatas("ALL");
        table.clear().rows.add(res).draw();
    }


//选中高亮
    //选中高亮
    common.selectShow("#eventsTable", "td");


//页面跳转
    table_operation.pageJump(table, "#previous", "#next", "#first", "#last", "#pageIndex");


});


