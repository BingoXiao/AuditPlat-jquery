//删除合约图片
function delete_tmp(e) {
    $(e.target).closest(".img_wrap").remove();
}

//图片放大
$("#shop_pictures img,.upload_pic_div img").on("mouseenter",function () {
    var $image = $(this);
    var $imgDiv = $(this);
    register.amplify_tmpImg($image,$imgDiv);
});
$("#shop_pictures img,.upload_pic_div img").on("mouseleave", function () {
    $(this).tooltip("hide");
});
$("form:not('.constraForm')").on("mouseenter", function () {
    var $imgDiv = $(this);
    var $image = $(this).find("img.tmp_img");
    register.amplify_tmpImg($image,$imgDiv);
});
$("form:not('.constraForm')").on("mouseleave", function () {
    $(this).tooltip("hide");
});


$(function () {
    //获取url的参数bususer_id、account
    var url = decodeURIComponent($('#rightIframe', window.top.document).attr('src'));
    var loc = url.substring(url.indexOf("?"), url.length);
    var para = common.getUrlParameters(loc, 'id');
    var urlAcc = common.getUrlParameters(loc, 'acc');

    var busList = {
        //获取合约信息
        constraInfo: function () {
            ajax_request({
                url: BUSLIST_SUBMITCONSTRA_URL,
                type: BUSLIST_SUBMITCONSTRA_TYPE,
                data: {
                    account: urlAcc,
                    date: $("#constractDate").val(),
                    name: $("#contractTitle").val(),
                    image1_url: $(".img_wrap img").first().attr("src"),
                    image2_url: typeof($(".img_wrap img").eq(1).attr("src")) == "undefined" ? "" : $(".img_wrap img").eq(1).attr("src"),
                    image3_url: typeof($(".img_wrap img").eq(2).attr("src")) == "undefined" ? "" : $(".img_wrap img").eq(2).attr("src")
                },
                success_fun: function (data) {
                    window.parent.set_modal({
                        path: "./modal/savaSuccessModal.html",
                        disappear: true
                    });
                    window.parent.hidemode_func('busList.html');   //返回项目审核表格页面
                }
            });
        },

        //合约信息验证
        constract_verify: function ($id_list) {   //身份信息验证
            for (var i = 0; i < $id_list.length; i++) {
                if ($.trim($($id_list[i]).val()) === "") { //为空
                    $($id_list[i]).addClass("errorInput");
                }
            }
        }
    };


    $("#busAccountTop").html(urlAcc);


    //日历初始化
    common.datepicker_initiate();
    $('.constractDate').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: 'zh-CN',
        showClose: true,
        defaultDate: new Date(),
        showTodayButton: true,
        ignoreReadonly: true
    });

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

    //获取分店列表
    busListInfo.branchList(para, urlAcc);

    //分店下拉菜单改变时，内容变化
    $("#shopBranches").on("change", function (e) {
        busListInfo.shop_id = $("#shopBranches").val();
        busListInfo.basicInfo(busListInfo.shop_id);   //基本信息
        busListInfo.blicInfo(busListInfo.shop_id);  // 营业执照信息
        busListInfo.slicInfo(busListInfo.shop_id);  // 餐饮许可信息
    });

    //顶部菜单内容切换
    $("#busList li").bind("click", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");

        if ($("#busNav").hasClass("active")) {
            $("#basicInfo").css("display", "");
            $("#basicInfo").siblings().css("display", "none");
        } else if ($("#blicNav").hasClass("active")) {
            $("#blicInfo").siblings().css("display", "none");
            $("#blicInfo").css("display", "");
        } else if ($("#slicNav").hasClass("active")) {
            $("#slicInfo").siblings().css("display", "none");
            $("#slicInfo").css("display", "");
        } else if ($("#settleNav").hasClass("active")) {
            $("#settleAndIdentityInfo").siblings().css("display", "none");
            $("#settleAndIdentityInfo").css("display", "");
        } else if ($("#busConNav").hasClass("active")) {
            $("#busConInfo").siblings().css("display", "none");
            $("#busConInfo").css("display", "");
        }
    });


//修改商家负责人信息
    $("#shopLock").on("click", function () {
        $(this).css("display", "none");
        $("#shopUnlock").css("display", "");

        $("#res_name").attr("disabled", false);
        $("#res_phone").attr("disabled", false);
    });

    $("#shopUnlock").on("click", function () {
        $(this).css("display", "none");
        $("#shopLock").css("display", "");

        $("#res_name").attr("disabled", true);
        $("#res_phone").attr("disabled", true);
    });

//修改营业状态
    $("#openingStateLock").on("click", function () {
        $(this).css("display", "none");
        $("#openingStateUnlock").css("display", "");
        $("#openingStateList").attr("disabled", false);
    });

    $("#openingStateUnlock").on("click", function () {
        $(this).css("display", "none");
        $("#openingStateLock").css("display", "");
        $("#openingStateList").attr("disabled", true);
    });


//修改信息时
    var $res_list = $("#res_input input");

    for (var k = 0; k < $res_list.length; k++) {
        $res_list.on("input propertyChange", function () {
            $res_list.removeClass("errorInput");
            $("#phone_tips").css("display", "none");
        });
    }

    //提交信息
    $("#submitform").on("click", function () {
        for (var i = 0; i < $res_list.length; i++) {
            if ($.trim($($res_list[i]).val()) == "") {
                $($res_list[i]).addClass("errorInput");
            } else {
                verify_function.phone_verify($("#res_phone"));
            }
        }

        if ($("#res_input .errorInput").length > 0) {
            $('html,body').animate({
                scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
            }, "fast");

            $("#shopLock").css("display", "none");
            $("#shopUnlock").css("display", "");

            $("#res_name").attr("disabled", false);
            $("#res_phone").attr("disabled", false);

        } else {
            window.parent.set_modal({
                path: "modal/busL/busListConfirmModal.html",
                para: {
                    id: busListInfo.shop_id,
                    status: $("#openingStateList").val(),
                    name: $("#res_name").val(),
                    phonenum: $("#res_phone").val()
                }
            });
        }
    });

    /*********************************    商家合约    *****************************/
        //传入图片
    $("#upload_conkey input").change(function (e) {
        if ($(e.target).closest(".upload_pic_div").find("img[data-path!='']").length < 3) {   //未传满3张图片
            register.uploadConstract_verifyImg(e);
        } else {
            $(e.target).closest(".form-group").find("small").css("color", "#393939");
        }
        $("form").tooltip("hide");
    });


    var $cons_list = $("#busConInfo input").not("#conImg");

    for (var i = 0; i < $cons_list.length; i++) {  //输入改变时
        $($cons_list[i]).on("input propertyChange", function () {
            $(this).removeClass("errorInput");
        });
    }


    //保存合约信息
    $("#saveBtn").click(function () {
        busList.constract_verify($cons_list);
        if ($("#basicInfo .errorInput").length === 0) {
            var tmp = $("#constractImg").find("img");
            if (tmp.length > 0) {
                busList.constraInfo();  // 合约信息
            } else {
                $("#constractImg").find("small").css("color", "#ab0000");
            }
        }
    });


//返回商家列表按钮
    $("#returnTo,#return").on("click", function () {
        $('#rightIframe', window.top.document).attr('src', 'busList.html');
        $('#left-navlist', window.top.document).css("display", "");

    });

});