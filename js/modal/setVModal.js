
$(function (){

    //结款申请  1
    //结款成功(失败)
    function checkOut(flag,arr){     //退款记录总数据
        ajax_request({
            url: CHECKVERIFY_SUCCESS_SEARCH_URL,
            type: CHECKVERIFY_SUCCESS_SEARCH_TYPE,
            data: {
                "flag":flag,     // S代表成功 F 代表失败
                "applynums":arr
            },
            success_fun: function (data) {
                alert("操作成功！");
                $(".close").trigger("click");
            }
        });
    }

    //操作退款
    function refundOperation(token,refundnum) {
        ajax_request({
            url: CHECKVERIFY_REFUND_URL,
            type: CHECKVERIFY_REFUND_TYPE,
            data: {
                token:token,
                refundnum:refundnum,
                refund_reason:$("#refundReasons").val()
            },
            success_fun: function (data) {
                $(".close").trigger("click");
                $(window.frames["iframe_account"].document)
                    .find("#Vrefund").attr("disabled",true);
            }
        });
    }


    //结款成功
    $("#checkSuccess").click(function () {
        checkOut("S", urlpera);
    });
    //结款失败
    $("#checkFail").click(function () {
        checkOut("F", urlpera);
    });


    //商家银行账户修改审核   3
    $("#bbAYAgree").on("click",function(){
        window.frames["iframe_account"].busBankpass(true, "");
    });

    $("#bbANNo").on("click",function(){
        window.frames["iframe_account"].busBankpass(false, "");
    });

    //操作退款   5
    $("#refundReasons").on("input propertyChange", function () {
        $("#refundReasons").removeClass("errorInput");
    });

    $("#refundOper").on("click",function () {
        if($.trim($("#refundReasons").val())===""){
            $("#refundReasons").addClass("errorInput");
        }else{
            refundOperation(urlpera.token,urlpera.refundnum);
        }
    });


});