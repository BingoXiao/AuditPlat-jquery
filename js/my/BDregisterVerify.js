$(function () {
  var register_verify = {    //注册页面信息验证
    basic_verify: function ($basic_list) {   //基本信息
      for (var i = 0; i < $basic_list.length; i++) {

        if ($.trim($($basic_list[i]).val()) === "") {
          $($basic_list[i]).addClass("errorInput");

          if ($($basic_list[i]).attr("id") === "position") {
            $("#pointError").css("display", "");
          }

          if ($($basic_list[i]).attr("id") === "small_category" && $($basic_list[i]).css("display") === "none") {
            $($basic_list[i]).removeClass("errorInput");
          }

        } else {

          if ($($basic_list[i]).attr("id") === "phoneInput") {    //商家手机
            verify_function.phone_verify($($basic_list[i]));
          }

          if ($($basic_list[i]).hasClass("telstatic")) {   //座机
            verify_function.tel_verify($($basic_list[i]));
          }
        }
      }
    },

    identification_verify: function ($id_list) {   //身份信息验证

      for (var i = 0; i < $id_list.length; i++) {

        if ($.trim($($id_list[i]).val()) === "") { //为空
          $($id_list[i]).addClass("errorInput");

          if ($($id_list[i]).hasClass("id_img")) {

            if ($($id_list[i]).closest(".form-group").css("display") === "none") {
              $($id_list[i]).removeClass("errorInput");

            } else {

              if ($($id_list[i]).closest(".form-group").find(".tmp_img").attr("src") == "") {
                $($id_list[i]).closest(".form-group").find("ol").css("display", "none");
                $($id_list[i]).closest(".form-group").find(".tmperror").css("display", "");
              } else {
                $($id_list[i]).removeClass("errorInput");
              }
            }
          }

          if ($($id_list[i]).attr("id") === "identificationNumInput") {    //身份证号码
            $("#idnum_tips").css("display", "");
          }

        } else {

          if ($($id_list[i]).attr("id") === "identificationNumInput") {    //身份证号码
            verify_function.idnum_verify($($id_list[i]));
          }
        }
      }
    },

    qualification_verify: function ($qua_list) {    //资质信息验证
      for (var i = 0; i < $qua_list.length; i++) {
        if ($.trim($($qua_list[i]).val()) === "") {
          $($qua_list[i]).addClass("errorInput");

          if ($($qua_list[i]).hasClass("shop_img")) {

            if ($($qua_list[i]).closest("form").find("img").attr("src") == "") {
              $($qua_list[i]).parents(".form-group").find("ol").css("display", "none");
              $($qua_list[i]).parents(".form-group").find(".tmperror").css("display", "");
            } else {
              $($qua_list[i]).removeClass("errorInput");
            }

          }

          if ($($qua_list[i]).attr("id") === "datepicker") {
            if ($("#longTime").is(":checked") === true) {
              $("#datepicker").removeClass("errorInput");
            }
          }

        } else {

          if ($($qua_list[i]).hasClass("licname")) {    //执照名称
            verify_function.licname_verify($($qua_list[i]));
          }

          if ($($qua_list[i]).hasClass("licnum")) {    //执照号码
            verify_function.licnum_verify($($qua_list[i]));
          }

          /*if ($($qua_list[i]).hasClass("licadd")) {    //执照地址
           verify_function.licadd_verify($($qua_list[i]));
           }*/
        }
      }
    },

    settle_verify: function ($settle_list) {    //结款信息验证
      for (var i = 0; i < $settle_list.length; i++) {

        if ($.trim($($settle_list[i]).val()) === "") {
          $($settle_list[i]).addClass("errorInput");

          //银行支行
          if ($("#bankEdit").is(":checked")) {     //自定义银行
            if ($($settle_list[i]).attr("id") === "accountBankNameInput") {
              $($settle_list[i]).removeClass("errorInput");
            }
          } else {
            if ($($settle_list[i]).attr("id") === "accountBankNameHand") {
              $($settle_list[i]).removeClass("errorInput");
            }
          }

        } else {

          if ($($settle_list[i]).attr("id") == "bankTelInput") {    //银行卡号
            verify_function.bankcard_verify($($settle_list[i]));
          }

          if ($($settle_list[i]).attr("id") == "billing_account_tel") {    //银行电话
            verify_function.phoneS_verify($($settle_list[i]));
          }
        }
      }
    }

    /*account_verify: function ($acc_list) {    //资质信息验证
     for (var i = 0; i < $acc_list.length; i++) {
     if ($.trim($($acc_list[i]).val()) === "") {
     $($acc_list[i]).addClass("errorInput");

     } else {

     if ($($acc_list[i]).attr("id") === "accountInput") {    //商家账号
     verify_function.account_verify($($acc_list[i]));
     }

     if ($($acc_list[i]).attr("id") === "passwordInput") {    //密码
     verify_function.password_verify($($acc_list[i]));
     }
     }
     }
     }*/
  };

  //获取url的参数(注册号)
  var loc = decodeURIComponent(window.location.hash);
  var para = common.getUrlParameters(loc, 'num') || "";
  var proState = common.getUrlParameters(loc, 'state');

  //提交(新店注册)数据
  function submit_data(perm, is_verify, step, circleIndex) {
    if (step === "BASE") {//基本信息
      var data = register.pack_BASEdata(perm);

    } else if (step === "QUA") {                    //资质信息
      var data = register.pack_QUAdata(perm);

    } else if (step === "BANK") {                   //结款信息
      var pass = {   //银行信息和身份信息判断
        bank: false,
        person: false
      };
      if ($("#hasBank").prop("checked")) {
        pass.bank = true;
      }
      if ($("#hasPerLicense").prop("checked")) {  //有结款信息
        pass.person = true;
      }
      var data = register.pack_BANKdata(perm, is_verify, pass);
    }

    ajax_request({
      url: BDREGISTER_NEWREGISTER_URL,
      type: BDREGISTER_NEWREGISTER_TYPE,
      data: data,
      success_fun: function (data) {
        if (is_verify === 'VERIFYING') {   //送审
          if (para == "") {
            window.location.hash += "num=" + data.applynum;
          }

          if (step !== "BANK") {
            para = data.applynum;
          } else {
            $("#user_tel").html($("#phoneInput").val());
            $("#success").siblings().css("display", "none");
            $("#success").css("display", "");
          }

          common.circlesChange(circleIndex);

        } else if (is_verify === 'HANDLING') {    // 保存
          $("#saveSuccessModal").modal("show");

          $("#saveSuccessModal").on('shown.bs.modal', function (e) {
            setTimeout(function () {
              $("#saveSuccessModal").modal("hide");
              window.location.href = "../checkIndex.html#BDregister";
            }, 1000);
          });
        }
      }
    });
  };


  //日历初始化
  common.datepicker_initiate();

  //初始化
  register.initialize_provinces();
  register.initialize_lclass();
  register.initialize_bankProvinces();

  //下拉框改变事件
  selectChange.province_change();
  selectChange.bank_change();
  selectChange.shopType_change();

  //密码显示与否
  $("#pwdInvisible").click(function () {
    $(this).css("display", "none");
    $("#pwdVisible").css("display", "");
    $("#passwordInput").attr("type", "text");
  });

  $("#pwdVisible").click(function () {
    $(this).css("display", "none");
    $("#pwdInvisible").css("display", "");
    $("#passwordInput").attr("type", "password");
  });

  //图片上传和展示
  $(".upload_key input").change(function (e) {
    register.upload_verifyImg(e);
    $(".div-upload").tooltip("destroy");
  });
  //图片放大
  $(".div-upload").on("mouseenter", function () {
    var $imgDiv = $(this);
    var $image = $(this).find("img.tmp_img");
    register.amplify_tmpImg($image, $imgDiv);
  });
  $(".div-upload").on("mouseleave", function () {
    $(this).tooltip("hide");
  });


  <!--**************************进入页面后信息填充**************************-->
  if (para !== '') {
    if (proState === "apply") {     //(商家申请注册)注册 数据
      infoFilling.BDRegister_apply_info(para);
    } else {        //(商家申请注册,新店注册)修改 数据
      infoFilling.BDregister_modify_info(para);
    }
  }


  /*********************注册进度显示及相关验证***********************/
  /*****************基本信息*********************/

  var $basic_list = $("#basicInfo input,#basicInfo select");

  for (var i = 0; i < $basic_list.length; i++) {
    $($basic_list[i]).on("input propertyChange", function () {   //输入改变时

      $(this).removeClass("errorInput");

      if ($.trim($("#ext").val()) === "") {    //座机
        if ($.trim($("#store_tel").val()) === "" && $.trim($("#area_code").val()) === "") {
          $basic_list = $("#basicInfo input,#basicInfo select").not("#telNum input");
          $("#store_tel").removeClass("errorInput");
          $("#area_code").removeClass("errorInput");
          $("#ext").removeClass("errorInput");
          $("#telError").css("display", "none");
        } else {
          $basic_list = $("#basicInfo input,#basicInfo select").not("#ext");
          $("#ext").removeClass("errorInput");
        }
      } else {
        $basic_list = $("#basicInfo input,#basicInfo select");
      }

      if ($(this).attr("id") === "phoneInput") {    //商家手机
        $("#phone_tips").css("display", "none");
      }

      if ($(this).hasClass("telstatic")) {   //座机
        $("#tel_tips").css("display", "none");
      }

    });
  }

  //基本信息:下一步
  $("#basicInfo_next").on("click", function () {
    if ($.trim($("#ext").val()) === "") {    //座机
      if ($.trim($("#store_tel").val()) === "" && $.trim($("#area_code").val()) === "") {
        $basic_list = $("#basicInfo input,#basicInfo select").not("#telNum input");
        $("#store_tel").removeClass("errorInput");
        $("#area_code").removeClass("errorInput");
        $("#ext").removeClass("errorInput");
        $("#telError").css("display", "none");
      } else {
        $basic_list = $("#basicInfo input,#basicInfo select").not("#ext");
        $("#ext").removeClass("errorInput");
      }
    } else {
      $basic_list = $("#basicInfo input,#basicInfo select");
    }
    register_verify.basic_verify($basic_list);

    if ($("#basicInfo .errorInput").length > 0) {   //填写有误
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#qualificationInfo").siblings().css("display", "none");
      $("#qualificationInfo").css("display", "");
      submit_data(para, 'VERIFYING', "BASE", 1);
    }
  });


//*************************资质信息***************************
  var $qua_list = $("#qualificationInfo input").not("input[type=radio]");

  for (var k = 0; k < $qua_list.length; k++) {
    $($qua_list[k]).on("input propertyChange", function () {    //输入改变时
      $(this).removeClass("errorInput");
      $(this).closest(".form-group").find("ol").css("display", "");
      $(this).closest(".form-group").find(".tmperror").css("display", "none");
      $(this).closest(".form-group").find(".errorTips").css("display", "none");
    });
  }
//日期选择验证
  $('.datepicker').on("dp.change", function (e) {
    $(this).removeClass("errorInput");
  });
  $("#longTime").click(function () {
    $("#datepicker").removeClass("errorInput");
  });

  //上一步
  $("#quaInfo_pre").on("click", function () {
    $("#basicInfo").siblings().css("display", "none");
    $("#basicInfo").css("display", "");
    common.circlesChange(-2);
  });

  //下一步
  $("#quaInfo_next").on("click", function () {
    register_verify.qualification_verify($qua_list);

    if ($("#qualificationInfo .errorInput").length > 0) {
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#settleAndIdentityInfo").siblings().css("display", "none");
      $("#settleAndIdentityInfo").css("display", "");
      submit_data(para, 'VERIFYING', "QUA", 2);
    }
  });


  /**************************   身份信息   *************************/
  var $id_list = $("#identityInfo input,#identityInfo select");
  for (var j = 0; j < $id_list.length; j++) {
    $($id_list[j]).on("input propertyChange", function () {    //输入改变时
      $(this).removeClass("errorInput");
      if ($(this).attr("id") === "identificationNumInput") {    //证件号码
        $("#idnum_tips").css("display", "none");
      }
    });
  }

  //身份信息选项卡
  $("input[name='LicenseJustify']").on("change", function () {
    if ($("#hasPerLicense").prop("checked")) {   //有身份信息
      $("#identityInfo").css("display", "");

    } else if ($("#noPerLicense").prop("checked")) {   //没有身份信息
      $("#identityInfo").css("display", "none");

      for (var b = 0; b < $id_list.length; b++) {
        $($id_list[b]).removeClass("errorInput");
      }

      $("#idnum_tips").css("display", "none");
      $(".tmperror").css("display", "none");
      $(".photo_tips").css("display", "");
    }
  });
//*******************结款信息***************************
  var $settle_list = $("#bankDetailsDiv input, #bankDetailsDiv select").not("#bankEdit");
  for (var m = 0; m < $settle_list.length; m++) {
    //输入改变时
    $($settle_list[m]).on("input propertyChange", function () {
      $(this).removeClass("errorInput");
      $(this).closest(".form-group").find(".errorTips").css("display", "none");
    });
  }

  //银行信息选项卡
  $("input[name='bankdiv']").on("change", function () {
    if ($("#hasBank").prop("checked")) {   //有银行信息
      $("#bankDetailsDiv").css("display", "");

    } else if ($("#noBank").prop("checked")) {  //没有银行信息
      $("#bankDetailsDiv").css("display", "none");

      for (var a = 0; a < $settle_list.length; a++) {
        $($settle_list[a]).removeClass("errorInput");
        $($settle_list[a]).closest(".form-group").find(".errorTips").css("display", "none");
      }
    }
  });

  //银行账户改变(个人户或公司户)
  $("#bankAccountInput").on("change", function () {
    $("#bankAccountInput option[value='']").remove();
  });

  //编辑开户行名称
  $("#bankEdit").on("click", function () {
    if ($(this).is(":checked")) {
      $("#accountBankNameInput").css("display", "none");
      $("#accountBankNameHand").css("display", "");
    } else {
      $("#accountBankNameInput").css("display", "");
      $("#accountBankNameHand").css("display", "none");
    }
  });

  //上一步
  $("#settleInfo_pre").on("click", function () {
    $("#qualificationInfo").siblings().css("display", "none");
    $("#qualificationInfo").css("display", "");
    common.circlesChange(-3);
  });


  //送审
  $("#sentBtn").on("click", function () {
    if ($("#hasBank").prop("checked")) {
      register_verify.settle_verify($settle_list);
    }

    if ($("#hasPerLicense").prop("checked")) {
      register_verify.identification_verify($id_list);
    }

    if ($("#settleAndIdentityInfo .errorInput").length > 0) {
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#accountInfo").siblings().css("display", "none");
      $("#accountInfo").css("display", "");
      submit_data(para, 'VERIFYING', "BANK", 3);
    }
  });


//点击储存并待处理按钮
  $("#pending").on("click", function () {
    if ($("#hasBank").prop("checked")) {
      register_verify.settle_verify($settle_list);
    }

    if ($("#hasPerLicense").prop("checked")) {
      register_verify.identification_verify($id_list);
    }

    if ($("#settleAndIdentityInfo .errorInput").length > 0) {
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#accountInfo").siblings().css("display", "none");
      $("#accountInfo").css("display", "");
      submit_data(para, 'HANDLING', "BANK", 3);
    }
  });

  // 返回商家注册俩表
  $("#suc").click(function () {
    window.open("../checkIndex.html#BDregister");
    self.close();
  });

});
