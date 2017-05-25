
var table=null;   //商家分配表格
var res = [];
var totalDatas = [];
var current = new Date();
var BDapply = {
    BDid : null,
    //表格数据
    BDapply_getdatas: function(flag){
        ajax_request({
            url:BDAPPLY_TABLE_URL,
            type:BDAPPLY_TABLE_TYPE,
            async:false,
            success_fun: function (data) {
                totalDatas = data;
                if (flag) {
                    res = table_operation.date_compare($(".dateFrom").val(), $(".dateTo").val(), totalDatas);
                } else {
                    res = table_operation.date_compare(
                        moment(current).subtract(1, 'M').format('YYYY年MM月DD日'),
                        moment(current).format('YYYY年MM月DD日'), totalDatas);
                }
            }
        });
        return res;
    },
    //商家分配表格
    assign_datatables : function() {
        return $('#assignTable').DataTable({
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
            "columnDefs": [   //第一列申请号
                {
                    "targets": 0,
                    "data": 'applynum',
                    "width":'20%'
                },

                {     //第二列商家名称
                    "targets": 1,
                    "data": 'busname',
                    "width":'20%'
                },

                {    //第三列为城市
                    "targets": 2,
                    "data": 'city',
                    "width":'10%'
                },

                {    //第四列为商圈
                    "targets": 3,
                    "data": 'city_near',
                    "width":'10%'
                },

                {    //第5列为BD
                    "targets": 4,
                    "data": null,
                    "width":'10%',
                    "defaultContent": "&mdash;",
                    "render": function (data,type,full,meta ){
                        if(data.bd===""){

                        }else{
                            return data.bd;
                        }
                    }
                },

                {    //第6列为提交时间
                    "targets": 5,
                    "data": 'submit_time',
                    "width":'20%'
                },

                {     //第7列为操作
                    "targets": -1,
                    "data":null,
                    "width":'10%',
                    "className":"editIcon",
                    render:function (data,type,full,meta ){
                        if(data.bd===""){
                            return "<button class='btn btn-default glyphicon glyphicon-bullhorn assignIcon'>" +
                                "&nbsp;分配</button><span><span style='display:none'>"+"0"+data.status+"</span></span>"
                        }else{
                            return "<button class='btn btn-default glyphicon glyphicon-pencil assignIcon'>" +
                                "&nbsp;修改</button><span><span style='display:none;'>"+"1"+data.status+"</span></span>"
                        }
                    }
                }
            ],
            "drawCallback": function( settings ) {
                //点击分配（修改）
                $(".assignIcon").on("click",function(){

                    BDapply.BDid = $(this).closest("tr").find("td:first-child").html();
                    window.parent.set_modal({
                        path:"./modal/busA/assignmentModal.html",
                        para:BDapply.BDid
                    });

                });
            }
        });
    }
};

function busArefresh(){   //刷新商家分配表格
    BDapply.BDapply_getdatas(true);
    table.clear().rows.add(res).draw();
};

// 刷新数据
$("#refreshDatas").on("click", function () {
    busArefresh()
})

$(function (){
//日期初始化
    common.datepicker_range_initiate(current);
    //BD列表初始化
    table_operation.assignList("#BDList");

//选中高亮
    common.selectShow("#assignTable", "td");

    //日期选择器改变时，新店注册记录表格数据过滤
    $(".dateFrom").on("dp.change", function (e) {  //开始日期改变时，搜索数据
        $('.dateTo').data("DateTimePicker").minDate(e.date);

        res = table_operation.datepickerFrom_change(".searchForm", totalDatas);
        table.clear().rows.add(res).draw();
    });

    $(".dateTo").on("dp.change", function (e) {   //结束日期改变时，搜索数据
        $('.dateFrom').data("DateTimePicker").maxDate(e.date);

        res = table_operation.datepickerTo_change(".searchForm", totalDatas);
        table.clear().rows.add(res).draw();
    });

//商家分配表格
    BDapply.BDapply_getdatas();
    table = BDapply.assign_datatables();

//自定义搜索框和状态下拉列表搜索
    table_operation.input_search(table,"#applyNumInput",0);
    table_operation.select_search(table,"#stateList",'全部',-1);
    table_operation.select_search(table, "#BDList", '全部', 4);
});


