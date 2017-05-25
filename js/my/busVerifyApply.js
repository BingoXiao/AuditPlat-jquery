
$(function () {

    //获取url的参数(注册号)
    var loc = decodeURIComponent(window.location.hash);
    var para = common.getUrlParameters(loc, 'num');

    //提交通过或者驳回
    function pass(flag, reason, page) {
        ajax_request({
            url: BDVERIFY_APPLYPASS_URL,
            type: BDVERIFY_APPLYPASS_TYPE,
            async: false,
            data: JSON.stringify({
                flag: flag,   //通过为true，驳回为false
                applynum: para,
                reject_reason: reason
            }),
            success_fun: function (data) {
                $('.close', window.top.document).trigger("click");
                window.location.href = page;
            }
        });
    }

    //模态框初始化
    common.modal_Initiate();

    //银行信息选项卡
    $("input[name='bankdiv']").on("change", function () {
        if ($("#hasBank").prop("checked")) {   //有银行信息
            $("#bankDetailsDiv").css("display", "");
        } else if ($("#noBank").prop("checked")) {  //没有银行信息
            $("#bankDetailsDiv").css("display", "none");
        }
    });
    //身份信息选项卡
    $("input[name='LicenseJustify']").on("change", function () {
        if ($("#hasPerLicense").prop("checked")) {   //有身份信息
            $("#identityInfo").css("display", "");
        } else if ($("#noPerLicense").prop("checked")) {   //没有身份信息
            $("#identityInfo").css("display", "none");
        }
    });

    $("#modifyInfo input[name='reasons']").on("click", function () {
        if ($("#options4").prop("checked")) {
            $("#otherReasons").removeAttr("disabled");
        } else {
            $("#otherReasons").attr("disabled", true);
        }
    });


    //初始化
    register.initialize_provinces();
    register.initialize_lclass();
    register.initialize_bankProvinces();

    //商家审核信息填充
    infoFilling.BDregister_modify_info(para, "disabled");
    if (sessionStorage.getItem('topListb') == "shopApplyRecord") {
        $("#verifyState").css("display", "");
        $(".VBtn").css("display", "none");
     }

//图片放大
    //图片点击进入另一页面展示
    $(".disabledOverlay").on("click", function () {
        var imgSrc = $(this).closest(".form-group").find("img.tmp_img").attr("src");
        window.open('./imgShow.html#img=' + imgSrc);
    });

//点击“通过”按钮************************************
    $("#busVpass").on('click', function () {
        pass(true, "", './busVerifyPass.html');
    });


//点击驳回
    $("#reject").on("click", function () {
        $("#my_modal").modal('show');
        $("#rejectNum").html(para);
    });

    $("#sendReasonsBtn").on('click', function () {   //点击按钮（商家申请驳回确定）发送驳回原因
        var $form = $("#modifyInfo");
        var reason = $form.find("input[name='reasons']:checked").val();
        reason += $form.find("#otherReasons").val();

        if($("#options4").prop("checked") && ($("#otherReasons").val()).replace(/\s/g, "")==""){
            alert("请填写驳回原因!");
        }else{
            pass(false,reason,'./busVerifyFail.html');
        }
    });


//点击返回按钮
    $("#return").on("click", function () {
        window.location.href = '../checkIndex.html#busVerify';
    });

});