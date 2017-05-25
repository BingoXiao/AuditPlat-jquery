$(function () {
//获取url的参数(注册号)
  var loc = decodeURIComponent(window.location.hash);
  var para = common.getUrlParameters(loc, 'num') || "";

  var current = new Date();
  var table = null;
  var register_verify = {
    applynum: null,
    account: null,
    content: null,
    basic_info: function (bus_id) {
      ajax_request({
        url: BUSLIST_BASIC_URL,
        type: BUSLIST_BASIC_TYPE,
        data: {
          bus_id: bus_id
        },
        success_fun: function (data) {
          var userinfo = data.userinfo;

          //商家负责人信息
          $("#res_name").val(userinfo.name);     //商家姓名
          $("#phoneInput").val(userinfo.phonenum);     //商家手机
        }
      });
    },

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

    qualification_verify: function ($qua_list) {    //资质信息验证
      for (var i = 0; i < $qua_list.length; i++) {
        if ($.trim($($qua_list[i]).val()) === "") {
          $($qua_list[i]).addClass("errorInput");

          if ($($qua_list[i]).hasClass("shop_img")) {

            if ($($qua_list[i]).closest("form").find("img").attr("src") == "") {
              $($qua_list[i]).closest(".form-group").find("ol").css("display", "none");
              $($qua_list[i]).closest(".form-group").find(".tmperror").css("display", "");
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

    branchList: function (para, boolean) {
      var res = null;
      if (boolean) {    //查询
        ajax_request({
          url: BDREGISTER_BRALIST_URL,
          type: BDREGISTER_BRALIST_TYPE,
          data: {
            account: para
          },
          async: false,
          success_fun: function (data) {
            res = data;// 对返回数据进行处理
          }
        });
      } else {   //修改获取
        ajax_request({
          url: BDREGISTER_BRAEDITFILLING_URL,
          type: BDREGISTER_BRAEDITFILLING_TYPE,
          data: {
            applynum: para
          },
          async: false,
          success_fun: function (data) {
            var a = [];
            a.push(data.parentbus);
            res = a;
            register_verify.content = data;
          }
        });
      }
      return $('#branchTable').DataTable({
        "data": res,
        "destroy": true,
        "autoWidth": false,
        "dom": 't<"bottom info"i><"tablePage"p>',
        "ordering": false,
        "lengthChange": false,
        "pageLength": 10,
        "pagingType": "full_numbers",
        "rowId": "bus_id",
        "language": {
          "lengthMenu": "每页 _MENU_ 条记录",
          "zeroRecords": "没有找到记录",
          "infoEmpty": "无记录",
          "infoFiltered": "(从 _MAX_ 条记录过滤)",
          "info": "共有 _TOTAL_ 条, 每页显示：10条",
          "paginate": {
            "first": "首页",
            "previous": "上一页",
            "next": "下一页",
            "last": "末页"
          }
        },
        //"rowId": applynum,
        "columnDefs": [   //第1列
          {
            "targets": 0,
            "data": null,
            "width": "6%",
            "defaultContent": "<div class='radio'><input type='radio' value='0' class='isSeleced'/><label></label></div>"
          },

          {     //第2列商家编号
            "targets": 1,
            "data": 'number',
            "width": "12%"
          },

          {     //第3列商家账号
            "targets": 2,
            "data": 'account',
            "className": 'ACC',
            "width": "12%"
          },

          {     //第4列商家名称
            "targets": 3,
            "data": 'busname',
            "width": "10%",
            "className": 'shops'
          },

          {     //第5列城市
            "targets": 4,
            "data": 'city',
            "width": "10%"
          },

          {     //第6列商圈
            "targets": 5,
            "data": 'city_near',
            "width": "10%"
          },

          {     //第7列商家分类
            "targets": 6,
            "data": 'class',
            "width": "20%"
          },

          {    //第8列为开通时间
            "targets": 7,
            "data": 'date_join',
            "width": "20%"
          }
        ],
        "drawCallback": function (settings) {
          if (res != "") {

            $("#branchTable tbody tr:first-child").addClass("selected");
            $(".selected").find("input[type=radio]").prop("checked", true).attr("value", "1");

          }
        }
      });
    }
  };


//提交(分店注册)数据
  function submit_data_branch(perm, is_verify, step, circleIndex) {
    if (step === "BASE") {                          //商家信息
      var data = register.packB_BASEdata(perm, register_verify.account);
    } else if (step === "QUA") {                    //资质信息
      var data = register.packB_QUAdata(perm);
    } else if (step === "LAST") {                    //账户信息
      var data = JSON.stringify({
        "step": step,
        "applynum": perm,
        "type": is_verify   //送审为"VERIFYING"，保存为"HANDLING"
      });
    }

    ajax_request({
      url: BDREGISTER_BRAREGISTER_URL,
      type: BDREGISTER_BRAREGISTER_TYPE,
      data: data,
      async: false,
      success_fun: function (data) {
        if (is_verify === 'VERIFYING') {   //送审
          if (!para) {
            window.location.hash += "num=" + data.applynum;
          }
          if (step != "LAST") {
            para = data.applynum;
          } else {
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
  }

  //日历初始化
  common.datepicker_initiate(current);

  //下拉框改变事件
  selectChange.province_change();
  selectChange.bank_change();
  selectChange.shopType_change();


  //选中高亮
  $('#branchTable tbody').on('click', 'td', function () {
    var $tr = $(this).closest("tr");
    $tr.addClass('selected');
    $tr.siblings("tr").removeClass("selected");

    $("#branchTable tbody").find("input[type=radio]").prop("checked", false).attr("value", "0");
    $tr.find("input[type=radio]").prop("checked", true).attr("value", "1");
  });


// 点击搜索
  $("#shopssearch").on("click", function () {
    $("#branchTable").css("display", "");
    table = register_verify.branchList($("#shopsInput").val(), true);
  });


//图片上传和展示
  $(".upload_key input").change(function (e) {   //图片上传和展示
    register.upload_verifyImg(e);
    $("form").tooltip("destroy");
  });
//图片放大
  $("form").on("mouseenter", function () {
    var $imgDiv = $(this);
    var $image = $(this).find("img.tmp_img");
    register.amplify_tmpImg($image, $imgDiv);
  });
  $("form").on("mouseleave", function () {
    $(this).tooltip("hide");
  });

  //初始化
  register.initialize_provinces();
  register.initialize_lclass();
  register.initialize_bankProvinces();
  var pp = null; // 地址坐标点
  /*********************信息填充***********************/
  if (para !== "") {         //修改 数据
    $("#branchTable").css("display", "");
    table = register_verify.branchList(para, false);
    pp = infoFilling.BDregister_branch_info(register_verify.content);
  }


// 点击去开店
  $("#openshop").on("click", function () {

    if ($("#branchTable").css("display") != "none" && $(".selected").length > 0) {
      register_verify.applynum = $("#branchTable tr.selected").attr("id");
      register_verify.account = $("#" + register_verify.applynum).find("td.ACC").html();

      $("#basicInfo").siblings().css("display", "none");
      $("#basicInfo").css("display", "");
      common.circlesChange(1);

      //信息填充
      busListInfo.settleInfo(register_verify.account);  // 银行信息
      busListInfo.IDInfo(register_verify.account);  // 身份信息

      register_verify.basic_info(register_verify.applynum); //基本信息
    }
    //获取地图位置
    if ($("#basicInfo").css("display") !== "none") {
      $.getScript("../../js/bmap.js", function () {
        if (pp) {
          showLocal(pp);     //确定地址坐标点
        }
      });
    }
  });


//*****************基本信息*********************

  var $basic_list = $("#basicInfo input,#basicInfo select");

  for (var i = 0; i < $basic_list.length; i++) {
    $($basic_list[i]).on("input propertyChange", function () {

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

  $("#basicInfo_pre").on("click", function () {
    $("#shopsearch").siblings().css("display", "none");
    $("#shopsearch").css("display", "");
    common.circlesChange(-2);
  });

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

    if ($("#basicInfo .errorInput").length > 0) {
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#qualificationInfo").siblings().css("display", "none");
      $("#qualificationInfo").css("display", "");
      submit_data_branch(para, 'VERIFYING', "BASE", 2);
    }
  });


//*************************资质信息***************************
  var $qua_list = $("#qualificationInfo input").not("input[type=radio]");

  for (var j = 0; j < $qua_list.length; j++) {

    $($qua_list[j]).on("input propertyChange", function () {

      $(this).removeClass("errorInput");
      $(this).parents(".form-group").find("ol").css("display", "");
      $(this).parents(".form-group").find(".tmperror").css("display", "none");

    });
  }

  //上一步
  $("#quaInfo_pre").on("click", function () {
    $("#basicInfo").siblings().css("display", "none");
    $("#basicInfo").css("display", "");
    common.circlesChange(-3);
  });

  //下一步
  //日期选择验证
  $('.datepicker').on("dp.change", function (e) {
    $(this).removeClass("errorInput");
  });
  $("#longTime").click(function () {
    $("#datepicker").removeClass("errorInput");
  });

  $("#quaInfo_next").on("click", function () {
    register_verify.qualification_verify($qua_list);

    if ($("#qualificationInfo .errorInput").length > 0) {
      $('html,body').animate({
        scrollTop: parseInt($(".errorInput:first-child").offset().top) - 100
      }, "fast");
    } else {
      $("#settleAndIdentityInfo").siblings().css("display", "none");
      $("#settleAndIdentityInfo").css("display", "");
      submit_data_branch(para, 'VERIFYING', "QUA", 3);
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
  }
//*******************结款信息***************************
  var $settle_list = $("#settleInfo input, #settleInfo select").not("#bankEdit").not("input[name='bankdiv'],input[name='LicenseJustify']");
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
    common.circlesChange(-4);
  });

  //送审
  $("#sentBtn").on("click", function () {
    submit_data_branch(para, 'VERIFYING', "LAST", 4);
  });

  //点击保存
  $("#pending").on("click", function () {
    submit_data_branch(para, 'HANDLING', "LAST", 4);
  });


// 返回商家注册列表
  $("#suc").click(function () {
    window.open("../checkIndex.html#BDregister");
    self.close();
  });

});
