
//获取url的参数item_id、BD
var url = decodeURIComponent($('#rightIframe', window.top.document).attr('src'));
var loc = url.substring(url.indexOf("?"), url.length);
var para = common.getUrlParameters(loc, 'id');


//商家银行账户修改
function busBankpass(flag) {   //提交通过或者驳回
    ajax_request({
        url: CHECKVERIFY_EDITINFO_URL,
        type: CHECKVERIFY_EDITINFO_TYPE,
        async: false,
        data: JSON.stringify({
            flag: flag,   //通过为true，驳回为false
            item_id: para,
            reject_reason: ""
        }),
        success_fun: function (data) {
            $('.close',window.top.document).trigger("click");
            $('#rightIframe', window.top.document).attr('src', "../settleVerify.html");
        }
    });
}

$(function () {

    if(sessionStorage.getItem('topLists') == "bankAccoutRecord"){
        $("#bankEdit").css("display","none");
    }

    //按钮显示
    if($("#bankAccoutRecord").hasClass("active")){
        $("#bankEdit").css("display","none");
        $("#bankView").css("display","");
    }

    //内容填充
    infoFilling.settleVbusbank_info(para);

    $("#basicInfo_pass").on("click", function () {   //通过
        window.parent.set_modal({
            path:"modal/setV/busbankAccYes.html"
        });
    });
    $("#basicInfo_reject").on("click", function () {   //驳回
        window.parent.set_modal({
            path:"modal/setV/busbankAccNo.html"
        });
    });

    $("#bankView").on("click", function () {   //返回
        $('#rightIframe', window.top.document).attr('src', 'settleVerify.html');
    });

});