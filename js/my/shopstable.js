

$(function () {
    var res = checkVerify.shopsInfo;

    var table = $('#shopsTable').DataTable({
        data: res,
        "dom": 't<"bottom info"i>',
        "ordering": false,
        "lengthChange": false,
        "pageLength": 10,
        //rowId: "bususer_id",
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "info": "共有 _TOTAL_ 条, 每页显示：10条"
        },
        "columnDefs": [   //第1列门店名称
            {
                "targets": 0,
                "data": 'name',
                "className":'col-xs-3'
            },

            {     //第2列logo
                "targets": 1,
                "data": null,
                "className":'col-xs-3',
                "render": function (data,type,full,meta ) {
                    return "<img width='80px' height='80px' src="+data.logo+">";
                }
            },

            {     //第3列地址
                "targets": 2,
                "data": 'address',
                "className":'col-xs-3'
            },

            {     //第4列电话
                "targets": -1,
                "data": null,
                "className":'col-xs-31',
                "render": function (data,type,full,meta ) {
                    var tel = "";
                    for(var j=0;j<5;j++){
                        var telNum = "tel_"+(j+1);
                        if(data[telNum]=="null" || typeof data[telNum]=="undefined"){   //电话为空
                            break;
                        }else{
                            tel += "<div>"+data[telNum]+"</div>";
                        }
                    }
                    return tel;
                }
            }
        ]
    });

    //页面跳转
    table_operation.pageJump(table,"#previous","#next","#first","#last");
});
