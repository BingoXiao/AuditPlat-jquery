//修改密码
function submitpwd() {
    ajax_request({
        url: ACCOUNTS_EDITPWD_URL,
        type: ACCOUNTS_EDITPWD_TYPE,
        data: {
            id: urlpera,
            password: $("#newPassword").val()
        },
        async: false,
        success_fun: function (data) {
            $(".close").trigger("click");
            window.parent.set_modal({
                path:"modal/accM/editSuccessModal.html",
                disappear:true
            });   //修改成功
        }
    });
}

$(function () {

    $("#newPassword").focus();

    //密码修改验证
    $("#forgetPWForm").validate({
        rules: {
            password: {
                required: true,
                isPassword: ""
            },
            confirmPW: {
                required: true,
                equalTo: "#newPassword"
            }
        },
        messages: {
            password: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请输入账户"
            },
            confirmPW: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请再次确认密码",
                equalTo: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;密码输入不一致"
            }
        },
        //errorElement:"em",
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        errorElement: "div",
        highlight: function (element, errorClass, validClass) {// element出错时触发
            if ($(element).attr("type") === "checkbox") {
                $(element).closest("div").css({"color": "#ab90000"});
            } else {
                $(element).addClass('errorInput');
            }
        },
        unhighlight: function (element, errorClass) { // element通过验证时触发
            $(element).removeClass('errorInput');
            $(element).closest("div").css({"color": "#919191"});
        }
    });

    // 密码修改验证通过后提交
    $("#forgetPWBtn").click(function () {
        if ($("#forgetPWForm").valid()) {
            submitpwd();
        }
    });


});