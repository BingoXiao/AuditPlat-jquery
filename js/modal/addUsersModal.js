/**
 * Created by ThinkPad on 2016/11/23.
 */

$(function () {
    function addAccount() {   //添加账号（提交）
        ajax_request({
            url: ACCOUNTS_ADD_URL,
            type: ACCOUNTS_ADD_TYPE,
            data: {
                name: $("#username").val(),
                account: $("#account").val(),
                password: $("#password").val(),
                bus_verify: $("#priority1").val(),    //商家审核的权限
                project_verify: $("#priority2").val(),  //项目审核权限
                checkout_verify: $("#priority3").val(),   //结款审核权限
                bus_apply: $("#priority4").val(),//商家申请权限
                bus_register: $("#priority5").val(), //商家注册权限
                item_list: $("#priority6").val() //项目列表权限
            },
            async: false,
            success_fun: function (data) {
                var PRI = "";
                if ($("#priority1").val()) {
                    PRI += "<img src='../img/11.png'/>";
                }
                if ($("#priority2").val()) {
                    PRI += "<img src='../img/12.png'/>";
                }
                if ($("#priority3").val()) {
                    PRI += "<img src='../img/13.png'/>";
                }
                if ($("#priority4").val()) {
                    PRI += "<img src='../img/14.png'/>";
                }
                if ($("#priority5").val()) {
                    PRI += "<img src='../img/15.png'/>";
                }
                if ($("#priority6").val()) {
                    PRI += "<img src='../img/16.png'/>";
                }

                var jj = $("<tr id=" + data.employee_id + ">").append("<td></td>", "<td>" +
                    $('#username').val() + "</td>", "<td>" + $('#account').val() +
                    "</td>", "<td>" + PRI + "</td>", "<td></td>", "<td></td>");

                //添加成功
                $(".close").trigger("click");
                set_modal({
                    path: "./modal/accM/addSuccessModal.html",
                    disappear: true,
                    loadFun: function () {
                        window.frames["iframe_account"].accrefresh();
                    }
                });
            }
        });
    }


//添加用户（验证）
    $("#addForm").validate({
        rules: {
            username: {
                required: true,
                isName: ""
            },
            account: {
                required: true,
                isAccount: ""
            },
            password: {
                required: true,
                isPassword: ""
            },
            priority: {
                required: true,
                rangelength: [1, 5]
            }
        },
        messages: {
            username: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请填写用户名"
            },
            account: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请填写账号"
            },
            password: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请填写密码"
            },
            priority: {
                required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;至少选择1个权限",
                rangelength: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;至多选择5个选项"
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            if ($(element).attr("type") === "checkbox") {
                error.insertAfter(element.closest(".row")).addClass("col-md-offset-2 errorExtra");
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) { // element出错时触发
            if ($(element).attr("type") === "checkbox") {
                $("input[name='priority']").closest("div").css({
                    "color": "#ab0000",
                    "font-size": "12px"
                });
            } else {
                $(element).addClass('errorInput');
            }
        },
        unhighlight: function (element, errorClass) { // element通过验证时触发
            $(element).removeClass('errorInput');
            $("input[name='priority']").closest("div").css({"color": "#919191"});
        }
    });


// 验证成功后点击提交
    $("#addAccount").on("click", function () {
        if ($("#addForm").valid()) {
            addAccount();
        }
    });
});