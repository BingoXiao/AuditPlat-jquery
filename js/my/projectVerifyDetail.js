//获取url的参数item_id、BD
var url = decodeURIComponent($('#rightIframe', window.top.document).attr('src'));
var loc = url.substring(url.indexOf("?"), url.length);
var para = common.getUrlParameters(loc, 'id');

var editor = CKEDITOR.instances.editor2;  //脉点编辑器

// 项目审核通过（驳回）
function operation(boo, reason) {
    ajax_request({
        url: PROVERIFY_PASS_URL,
        type: PROVERIFY_PASS_TYPE,
        data: JSON.stringify({
            item_id: para,
            flag: boo,   //通过为true，驳回为false
            reject_reason: reason,   //驳回原因，若为通过则设置为""
            commission: $("#rate").val(),  // 佣金比例
            "manual_billing_cycle": $("#takeTime").val(),  // 手动结算周期，单位天
            "auto_billing_cycle": $("#LossCutTime").val()
        }),
        success_fun: function (data) {
            if (boo) {    //通过成功
                $(".close", window.top.document).trigger("click");
                window.parent.set_modal({
                    path: "modal/proV/projectAgreeSuccessModal.html",
                    disappear: true
                });
                window.parent.hidemode_func('projectVerify.html');   //返回项目审核表格页面

            } else {   //驳回成功
                $(".close", window.top.document).trigger("click");
                window.parent.set_modal({
                    path: "modal/proV/projectRejectSuccessModal.html",
                    disappear: true
                });
                window.parent.hidemode_func('projectVerify.html');   //返回项目审核表格页面

            }
        }
    });
}

// 保存（上线）脉点
function JMstar(id, data, type) {
    ajax_request({
        url: PROLIST_JM_URL,
        type: PROLIST_JM_TYPE,
        data: {
            item_id: id,
            data: data,
            type: type //上线 S保存,R上线
        },
        success_fun: function (data) {
            if (type === "S") {
                alert("保存成功！");
            } else if (type === "R") {
                alert("上线成功！")
            }
        }
    });
}

// 获取脉点
function getJMstar(id) {
    ajax_request({
        url: PROLIST_JMDATA_URL,
        type: PROLIST_JMDATA_TYPE,
        data: {
            item_id: id
        },
        success_fun: function (data) {
            editor.setData(data);
        }
    });
}

$(function () {

    function project_verify($basic_list) {   //数据修改验证
        for (var i = 0; i < $basic_list.length; i++) {
            if ($.trim($($basic_list[i]).val()) === "") {
                $($basic_list[i]).addClass("errorInput");
            } else {
                if ($($basic_list[i]).attr("id") === "rate") {    //佣金比例
                    verify_function.commission_verify($($basic_list[i]));
                }
            }
        }
    }

    common.modal_Initiate();  //模态框初始化
    checkVerify.getFestivals();  //获取节假日
    infoFilling.projectVerify_info(para);//项目审核信息填充

    if (sessionStorage.getItem('topListp') == "proRecord") {//项目审核记录（只能查看）
        $(".operbtn").css("display", "none");
        $(".fa-lock").css("display", "none");
    }


    // 顶部菜单栏
    $("#proInnerList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        //菜单内容切换
        if ($("#planInfoNav").hasClass("active")) {
            $("#planInfo").css("display", "");
            $("#planInfo").siblings().css("display", "none");
        } else if ($("#JMPointNav").hasClass("active")) {
            $("#JMPoint").css("display", "");
            $("#JMPoint").siblings().css("display", "none");
        }
    });


//显示更多门店信息（表格）
    $("#more").click(function () {
        window.open("shopstable.html", "",
            'height=500,width=860,top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',alwaysRaised=yes,' +
            'toolbar=no,menubar=no,location=no,status=no');
    });


//佣金比例、结算周期LOCK
    $("#ratelock").click(function () {
        $("#ratelock").css("display", "none");
        $("#rateUnlock").css("display", "");
        $("#rate").attr("disabled", false);
    });
    $("#rateUnlock").click(function () {
        $("#rateUnlock").css("display", "none");
        $("#ratelock").css("display", "");
        $("#rate").attr("disabled", true);
    });
    /*$("#settleLock").click(function () {
        $("#settleLock").css("display", "none");
        $("#settleUnlock").css("display", "");
        $("#settleTime input").attr("disabled", false);
    });
    $("#settleUnlock").click(function () {
        $("#settleUnlock").css("display", "none");
        $("#settleLock").css("display", "");
        $("#settleTime input").attr("disabled", true);
    });*/


    /*var $pro_list = $("#settleTime input,#rate");
    for (var i = 0; i < $pro_list.length; i++) {
        $($pro_list[i]).on("input propertyChange", function () {    //输入时
            $(this).removeClass("errorInput");
        });
    }*/
    var $pro_list = $("#rate");
    for (var i = 0; i < $pro_list.length; i++) {
        $($pro_list[i]).on("input propertyChange", function () {    //输入时
            $(this).removeClass("errorInput");
        });
    }

//点击按钮（同意）
    $("#passBtn").click(function () {
        project_verify($pro_list);
        if ($(".errorInput").length < 1) {
            $(".close").trigger("click");
            window.parent.set_modal({
                path: "./modal/proV/projectAgreeModal.html"
            });
        } else {
            $('html,body').animate({
                scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
            }, "fast");
        }
    });


//点击驳回按钮
    $("#reject").on("click", function () {
        project_verify($pro_list);
        if ($(".errorInput").length < 1) {
            window.parent.set_modal({
                path: "./modal/proV/projectRejectModal.html"
            });
        } else {
            $('html,body').animate({
                scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
            }, "fast");
        }
    });


//点击返回按钮(项目审核)
    $("#return").on("click", function () {
        $('#rightIframe', window.top.document).attr('src', 'projectVerify.html');
        $('#left-navlist', window.top.document).css("display", "");
    });

//点击返回按钮（项目列表）
    $("#returnL").on("click", function () {
        $('#rightIframe', window.top.document).attr('src', 'projectList.html');
        $('#left-navlist', window.top.document).css("display", "");
    });


    /**********************************    脉点编辑   ***********************************/
    var JM = null;
    var content = null;

    if(!(typeof editor=="undefined")){
        getJMstar(para, editor);   //获取脉点
    }


    //预览
    $("#viewBtn").on("click", function () {
        JM = editor.getData();
        content = "<div class='modal-header' style='padding:10px 18px;background-color:#000;'>" +
            "<button type='button' class='close' data-dismiss='modal' aria-hidden='true' " +
            "style='padding:0;color: #ffffff;opacity:1;'>×</button></div>" +
            "<div class='modal-body'>" + JM + "</div>";
        window.parent.JMView(content);
    });

    //保存
    $("#saveBtn").on("click", function () {
        JM = editor.getData();
        JMstar(para, JM, "S");
    });

    //上线
    $("#uploadBtn").on("click", function () {
        JM = editor.getData();
        JMstar(para, JM, "R");
    });


});