/**
 * Created by ThinkPad on 2016/11/23.
 */
$(function () {

    function editInfo() {    //表格内部（修改资料）
        ajax_request({
            url: ACCOUNTS_EDITINFO_URL,
            type: ACCOUNTS_EDITINFO_TYPE,
            data: {
                id:urlpera,
                bus_verify: $("#pria").val(),    //商家审核的权限
                project_verify: $("#prib").val(),  //项目审核权限
                checkout_verify: $("#pric").val(),   //结款审核权限
                bus_apply: $("#prid").val(),//商家申请权限
                bus_register: $("#prie").val(), //商家注册权限
                item_list: $("#prif").val() //项目列表权限
            },
            async: false,
            success_fun: function (data) {
                var Pri = "";

                if ($("#pria").val()) {Pri += "<img src='../img/11.png'/>";}
                if ($("#prib").val()) {Pri += "<img src='../img/12.png'/>";}
                if($("#pric").val()){Pri += "<img src='../img/13.png'/>";}
                if($("#prid").val()){Pri += "<img src='../img/14.png'/>";}
                if($("#prie").val()){Pri += "<img src='../img/015.png'/>";}
                if($("#prif").val()){Pri += "<img src='../img/16.png'/>";}

                //修改资料成功
                $(".close").trigger("click");
                set_modal({
                    path:"modal/accM/editSuccessModal.html",
                    disappear:true,
                    loadFun:function () {
                        window.frames["iframe_account"].accrefresh();
                    }
                });
            }
        });
    }

//修改资料（验证）
    $("#modifyInfo").validate({
        rules: {
            pri:{
                required:true,
                rangelength:[1,5]
            }
        },
        messages:{
            pri:{
                required:"<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请至少选择1个权限",
                rangelength:"<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;至多选择5个选项"
            }
        },
        errorElement:"div",
        errorPlacement: function (error, element) {
            //error.addClass("errorBlock");
            error.insertAfter(element.closest(".row")).addClass("col-md-offset-2 errorExtra");
        },
        highlight:function (element, errorClass, validClass) {// element出错时触发
            if($(element).attr("type")==="checkbox"){
                $("input[name='pri']").closest("div").css({"color":"#ab0000"});
            }
        },
        unhighlight: function(element, errorClass) { // element通过验证时触发
            //$(element).removeClass('errorInput');
            $("input[name='pri']").closest("div").css({"color":"#919191"});
        }
    });


    // 修改资料（提交）
    $("#modifyBtn").click(function(){
        if($("#modifyInfo").valid()){
            editInfo();
        }
    });

});