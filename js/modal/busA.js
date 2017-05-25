


$(function () {

    var BDid = null;   //商家分配BD的id

//BD分配列表显示
    function assignList() {
        ajax_request({
            url: BDAPPLY_LIST_URL,
            type: BDAPPLY_LIST_TYPE,
            async: false,
            success_fun: function (data) {
                $("#allBD").empty();    //清空BD列表

                if(data.length>0){
                    $(data).each(function(index,element){   //BD列表添加数据
                        $("#allBD").append("<option value="+element.bd_id+">"+element.name+"</option>");
                    });

                    BDid = data[0].bd_id;
                }
            }
        });
    }

//分配给BD
    function assignto(id){
        ajax_request({
            url: BDAPPLY_ASSIGN_URL,
            type: BDAPPLY_ASSIGN_TYPE,
            data: {
                bd_id:id,
                applynum: urlpera
            },
            async: false,
            success_fun: function (data) {
                $(".close").trigger("click");

                set_modal({
                    path:"modal/busA/assignSuccessModal.html",
                    disappear:true,
                    loadFun:function () {
                        window.frames["iframe_account"].busArefresh();
                    }
                });
            }
        });
    }


    assignList();   // 获取BD列表


//BD下拉菜单改变
    $("#allBD").on("change",function(){
        BDid = $(this).val();
    });

//点击（分配）
    $("#assignBtn").on("click",function(){
        assignto(BDid);
    });


});
