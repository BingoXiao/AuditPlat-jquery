

$(function (){

    var res=null;
    var selectArr = [];   //选中组（按钮）
    var table=null;


//***********************表格复选框 ok*****************************/
    $("input[type='checkbox']").on("click",function(){
        if( $(this).prop("checked")){
            $(this).attr("value","1");
        }
        else{
            $(this).attr("value","0");
        }
    });



//高亮复选框选中函数ok
    selectCheckbox= function ($tr) {

        if($tr.hasClass('selected')){

            $tr.find("td").eq(0).find(":checkbox").prop("checked",true).val("1");

            if(selectArr.length==0) {
                selectArr.push($tr.attr("id"));

            }else{
                if(selectArr.indexOf($tr.attr("id"))==-1){
                    selectArr.push($tr.attr("id"));
                }
            }

        }else{

            $tr.find("td").eq(0).find(":checkbox").prop("checked",false).val("0");
            selectArr = $.grep(selectArr,function(num,index){
                return num==$tr.attr("id");
            },true);
        }

    };



//****************表格数据加载(初始化) OK**********************/
    table = $('#complaintsTable').DataTable({
        ajax:{
            url:COMPAINTS_TABLE_URL,
            type:COMPAINTS_TABLE_TYPE,
            dataSrc:function(data) { //提交成功的回调函数
                if (data.success) {
                    return res=data.content;// 对返回数据进行处理
                }
            }
        },
        "data": res,
        "dom": 't<"bottom info"i>',
        ordering:false,
        "lengthChange": false,
        "pageLength": 5,
        "rowId": "id",
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "info": "共有 _TOTAL_ 条, 每页显示：10条"
        },
        "columnDefs": [   //第一列默认复选框
            {
                "targets": 0,
                "data": null,
                "className":'col-xs-1',
                "defaultContent": "<div class='checkbox'><input type='checkbox' value='0' class='isSeleced'/><label></label></div>"
            },

            {     //第二列举报时间
                "targets": 1,
                "data": 'time',
                "className":'col-xs-2'
            },

            {     //第二列商家名称
                "targets": 2,
                "data": 'busname',
                "className":'col-xs-2'
            },

            {     //第三列处理等级
                "targets": 3,
                "data": 'rank',
                "className":'col-xs-1'
            },

            {    //第四列为举报事件
                "targets": 4,
                "data": "content",
                "className":'col-xs-3'
            },

            {    //第四列为BD联系人
                "targets": 5,
                "data": "bd",
                "className":'col-xs-1'
            },


            {   //第五列为状态
                "targets": -1,
                "data": "status",
                className: "col-xs-2"
            }
        ]
    });



//*************** 自定义搜索框 ****************/

    table_operation.select_search(table,"#stateList",'all',-1);
    table_operation.select_search(table,"#rank",'0',3);


//*********点击选中高亮 **************/
    $('#complaintsTable tbody').on('click','td',function () {
        var $tr=$(this).closest("tr");
        $tr.toggleClass('selected');

        selectCheckbox($tr);
    });



 //提交处理
    submitComplaints = function(status){
        ajax_request({
            url: COMPAINTS_SUBMIT_URL,
            type: COMPAINTS_SUBMIT_TYPE,
            async: false,
            data: {
                ids:selectArr,
                status:status
            },
            success_fun: function (data) {
                table.ajax.reload(null,false);
            }
        });
    };


    //已处理
    $("#treated").click(function () {
        if(selectArr.length>0){
            submitComplaints("HANDLED");
        }
    });

    //未处理
    $("#untreated").click(function () {
        if(selectArr.length>0){
            submitComplaints("UNHANDLED");
        }
    });


//页面跳转
    table_operation.pageJump(table,"#previous","#next","#first","#last");

});


