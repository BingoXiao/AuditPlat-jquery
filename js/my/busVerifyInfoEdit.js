
//获取url的参数item_id,状态及理由
var loc = decodeURIComponent(window.location.hash);
var para =common.getUrlParameters(loc,'id');


function passE(flag,reason,page){
    ajax_request({
        url: BDVERIFY_EDITPASS_URL,
        type: BDVERIFY_EDITPASS_TYPE,
        async:false,
        data: JSON.stringify({
            flag:flag,
            item_id:para,
            reject_reason:reason
        }),
        success_fun: function (data) {
            $('.close',window.top.document).trigger("click");
            window.location.href=page;
        }
    });
}


$(function(){

    //模态框初始化
    common.modal_Initiate();

    $("#modifyInfo input[name='reasons']").on("click", function () {
        if ($("#options4").prop("checked")) {
            $("#otherReasons").removeAttr("disabled");
        } else {
            $("#otherReasons").attr("disabled", true);
        }
    });

    //商家审核修改信息填充
    infoFilling.busVerifyedit_info(para);

    if(sessionStorage.getItem('topListb') == "shopInfoModifyRecord"){   //记录只有返回按钮
        $("#verifyState").css("display","");
        $(".VBtn").css("display","none");
    }

    //显示更多电话
    $(".telMore").click(function(){
        $(this).parents(".shopInfo").find(".telModule").toggle();
    });


//点击“通过”按钮************************************
    $("#busEpass").on("click", function () {
        passE(true,"",'./busVerifyPass.html');
    });

//审核未通过，填写原因选中textarea
    $("input[name='reasons']").change(function(){
        if($("#options4").is(":checked")){
            $("#otherReasons").attr("disabled",false);
        }else{
            $("#otherReasons").attr("disabled",true);
        }
    });

//点击驳回
    $("#reject").on("click", function () {
        $("#my_modal").modal("show");
        $("#rejectNum").html(para);
    });


    $("#sendReasonsBtn").on('click', function (e) {   //点击按钮（商家申请驳回确定）发送驳回原因
        var $form = $("#modifyInfo");
        var reason = $form.find("input[name='reasons']:checked").val();
        reason += $form.find("#otherReasons").val();

        if($("#options4").prop("checked") && ($("#otherReasons").val()).replace(/\s/g, "")==""){
            alert("请填写驳回原因!");
        }else{
            passE(false,reason,'./busVerifyFail.html');
        }
    });


    //点击返回按钮
    $("#return").on("click", function () {
        window.location.href = '../checkIndex.html#busVerify';
    });


});