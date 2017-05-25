
var index = {
    //后台审核首页登录
    login: function () {
        ajax_request({
            url: ACCOUNTS_LOGIN_URL,
            type: ACCOUNTS_LOGIN_TYPE,
            data: {
                account: $("#username").val(),
                password: $("#password").val()
            },
            success_fun: function (data) {
                var anchor = permsSetting(data.perms);
                window.location.href = "./html/checkIndex.html" + anchor;
                $('#left-navlist').css("display", "");

                if($("#remember").prop("checked")){   //记住自动登录
                    $.cookie("REMEMBER","1",{ expires:30});
                }
            }
        });
    },

    //首页自动登录
    logAuto: function () {
        ajax_request({
            url: AUTO_LOGIN_URL,
            type: AUTO_LOGIN_TYPE,
            data: {
                account: $("#username").val(),
                password: $("#password").val()
            },
            success_fun: function (data) {
                if($.cookie("REMEMBER")==="1"){
                    var anchor = permsSetting(data.perms);
                    window.location.href = "./html/checkIndex.html" + anchor;
                    $('#left-navlist').css({display: ""});
                }
            },
            fail_fun: function (error_info) {
                console.log(error_info);
            }
        });
    }
};


$(function () {

    index.logAuto();

    $("#username").val("");   //清空数据
    $("#password").val("");

    /***********审核后台登陆 **********/
    $("#loginForm").validate({
        rules: {
            username: {
                required: true,
                isAccount: ""
            },
            password: {
                required: true,
                isPassword: ""
            }
        },
        messages: {
            username: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请输入用户名",
                isAccount: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;账号必须为2~63位，且只能包含数字、字母及特殊符号"
            },
            password: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请输入密码",
                isPassword: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;密码必须为6~32位，且只能包含数字、字母及特殊符号（不包含空格）"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("errorBlock");
            {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {// element出错时触发
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass) { // element通过验证时触发
            $(element).closest('.form-group').removeClass('has-error');
        },
        submitHandler: function (form) {
            index.login();   //登录
        }
    });
});