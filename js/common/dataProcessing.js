/*通用ajax请求*/
//option:url:请求地址;type:ajax请求类型;data:请求数据;async:是否异步;success_fun:成功处理函数；
// fail_fun:请求成功，报已定义错误；error_fun:请求失败或请求成功，报未定义错误
function errorReturn(error_info) {   //错误返回
  if (error_info == "logout") {
    top.window.location.href = "../../login.html";
  } else {
    alert(error_info);
    $(".modal").modal("hide");
  }
};

function ajax_request() {
  var option = arguments[0];
  var async;

  if (typeof (option.async) === "boolean") {
    async = option.async;   //同步刷新
  } else {
    async = true;    //异步刷新
  }

  $.ajax({
    url: option.url,
    type: option.type || "get",
    async: async,
    data: option.data || null,
    success: function (jsonDatas) {
      if (jsonDatas.success === true) {
        option.success_fun(jsonDatas.content);
      } else {
        //console.log(option.fail_fun);
        if (option.fail_fun) {
          option.fail_fun(jsonDatas.error_info);
        } else {
          errorReturn(jsonDatas.error_info);
        }
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("无法连接，请稍后再试！");
      if (option.error_fun) {
        option.error_fun();
      }
    }
  });
}


//锚点设置
function permsSetting(perms) {
  var anchor = '';//记录锚点
  //管理员账号 (具备附加权限:商家管理、系统设置)
  if (perms.bus_apply == 1 && perms.bus_register == 1 && perms.bus_verify == 1 &&
      perms.checkout_verify == 1 && perms.project_verify == 1 && perms.item_list == 1) {
    anchor = "#accountManagement";
  } else { //BD
    if (perms.bus_apply == 1 || perms.bus_register == 1) {
      if (perms.bus_apply == 1) {    //商家申请
        anchor = "#BDapply";
      } else if (perms.bus_register == 1) {   //商家注册和列表
        anchor = "#BDregister";
      }
    } else {// 总审核人员
      if (perms.bus_verify == 1 || perms.project_verify == 1 || perms.checkout_verify == 1) {
        if (perms.bus_verify == 1) {   //商店审核人员
          anchor = "#busVerify";
        } else if (perms.project_verify == 1) {    //项目审核人员
          anchor = "#projectVerify";
        } else if (perms.checkout_verify == 1) {   //结款审核人员
          anchor = "#settleVerify";
        }
      } else {//项目管理(项目列表)
        if (perms.item_list == 1) {
          anchor = "#projectList";
        }
      }
    }
  }
  return anchor;
}


//输入禁止设置
var input_limits = {
  //只能输入数字
  only_num: function (e) {
    var keys = e.which || e.keyCode;
    if (!((keys >= 48 && keys <= 57) || (keys >= 96 && keys <= 105) || ( keys == 8 ) || (keys == 46) || (keys == 37) || (keys == 39) || (keys == 13))) {
      if (document.all)
        e.returnValue = false;//ie
      else
        e.preventDefault();//ff
    }
  },
//只能输入数字或者小数
  only_numDot: function (e) {
    var keys = e.which || e.keyCode;

    if (!((keys >= 48 && keys <= 57) || (keys >= 96 && keys <= 105) || ( keys == 8 ) || (keys == 46) || (keys == 37) || (keys == 39) || (keys == 13) || (keys == 110) || (keys == 190))) {
      if (document.all)
        e.returnValue = false;//ie
      else
        e.preventDefault();//ff
    }
  },
//只能输入数字或英文
  only_numEN: function (e) {
    var keys = e.which || e.keyCode;
    if (!((keys >= 48 && keys <= 57) || (keys >= 96 && keys <= 105) || (keys >= 65 && keys <= 90)
        || ( keys == 8 ) || (keys == 46) || (keys == 37) || (keys == 39) || (keys == 13))) {
      if (document.all)
        e.returnValue = false;//ie
      else
        e.preventDefault();//ff
    }
  }
};


//下拉列表身份类型改变时
function idChange() {
  var opt = $("#IDType").find("option:selected").val();

  if (opt == "PASSPORT") {
    $(".exception").css("display", "");
    $(".normal").css("display", "none");
    $("#id_image_form").find(".img-upload").attr("src", "../../img/PNG/9.png");
  } else {
    $(".exception").css("display", "none");
    $(".normal").css("display", "");

    if (opt == "ID_CARD") {
      $("#idfront_image_form").find(".img-upload").attr("src", "../../img/PNG/3.png");
      $("#idback_image_form").find(".img-upload").attr("src", "../../img/PNG/4.png");
    } else if (opt == "HK_MACAO_CARD") {
      $("#idfront_image_form").find(".img-upload").attr('src', "../../img/PNG/5.png");
      $("#idback_image_form").find(".img-upload").attr('src', "../../img/PNG/6.png");
    } else {
      $("#idfront_image_form").find(".img-upload").attr("src", "../../img/PNG/7.png");
      $("#idback_image_form").find(".img-upload").attr("src", "../../img/PNG/8.png");
    }
  }
};


//通用
var common = {
  datepicker_initiate: function () {//日历初始化
    var current = new Date();
    $('.datepicker').datetimepicker({
      format: 'YYYY-MM-DD',
      locale: 'zh-CN',
      showClose: true,
      minDate: current,
      defaultDate: moment(current),
      showTodayButton: true,
      ignoreReadonly: true
    });
  },

  datepicker_Timerange_initiate: function () {
    $('.timeFrom').datetimepicker({
      format: 'HH:mm:ss',
      showClose: true,
      defaultDate: moment({hour: 1, minute: 0})
    });
    $('.timeTo').datetimepicker({
      format: 'HH:mm:ss',
      showClose: true,
      defaultDate: moment({hour: 23, minute: 0})
    });
  },

  datepicker_range_initiate: function (current) {
    $('.dateFrom').datetimepicker({
      format: 'YYYY年MM月DD日',
      locale: 'zh-CN',
      showClose: true,
      defaultDate: moment(current).subtract(1, 'M'),
      maxDate: current,
      showTodayButton: true,
      ignoreReadonly: true
    });
    $('.dateTo').datetimepicker({
      format: 'YYYY年MM月DD日',
      locale: 'zh-CN',
      showClose: true,
      defaultDate: current,
      minDate: moment(current).subtract(1, 'M'),
      showTodayButton: true,
      ignoreReadonly: true
    });
  },

  modal_Initiate: function () {   //模态框初始化
    $("#my_modal").modal({
      keyboard: false,
      show: false
      //backdrop:'static'
    });
  },

  //高亮显示
  selectShow: function (id, item) {
    $('tbody', id).on('click', item, function () {
      var $tr = $(this).closest("tr");
      $tr.addClass('selected');
      $tr.siblings("tr").removeClass("selected");
    });
  },

  //注册页面进程显示变化（圆圈）
  circlesChange: function (i) {
    if (i > 0) {
      $(".circles").find("div:nth-child(" + i + ")").removeClass("bigCircle").addClass("smallCircle");
      $(".circles").find("div:nth-child(" + (i + 1) + ")").removeClass("smallCircle").addClass("bigCircle");
    } else {
      $(".circles").find("div:nth-child(" + (-i) + ")").removeClass("bigCircle").addClass("smallCircle");
      $(".circles").find("div:nth-child(" + (-1 - i) + ")").removeClass("smallCircle").addClass("bigCircle");
    }

    $(".bigCircle").find("img").attr("src", "../../img/7.png");
    $(".smallCircle").find("img").attr("src", "../../img/8.png");
  },

  dataCompare: function (olddata, newdata, $pos) {    //商家审核旧数据和新数据比较
    if (olddata == newdata) {
      $pos.parent().css("display", "none");
    } else {
      if (olddata == "" || olddata == "null") {
        $pos.parent().css("display", "none");
      }
      $pos.html(olddata);
    }
  },

  //获取url参数
  getUrlParameters: function (url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = url.substr(1).match(reg);  //匹配目标参数
    //返回参数值
    if (r != null) return unescape(r[2]);
  }
};


var register = {
  /***********初始化省份下拉列表信息*********/
  initialize_provinces: function (recall) {
    ajax_request({
      url: PROVINCE_URL,
      type: PROVINCE_TYPE,
      async: false,
      success_fun: function (provinces) {
        for (var i = 0; i < provinces.length; i++) {
          $("#province").append('<option value="' + provinces[i].id + '">' + provinces[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据省份得到城市列表
  get_cities: function (province_id, recall) {
    ajax_request({
      url: CITY_URL,
      type: CITY_TYPE,
      data: {
        province_id: province_id
      },
      success_fun: function (cities) {
        for (var i = 0; i < cities.length; i++) {
          $("#city").append('<option value="' + cities[i].id + '">' + cities[i].name + '</option>');
        }

        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据城市得到区列表
  get_districts: function (city_id, recall) {
    ajax_request({
      url: DISTRICT_URL,
      type: DISTRICT_TYPE,
      data: {
        city_id: city_id
      },
      success_fun: function (districts) {
        for (var i = 0; i < districts.length; i++) {
          $("#district").append('<option value="' + districts[i].id + '">' + districts[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据区域得到商圈列表
  get_circles: function (districts, recall) {
    ajax_request({
      url: CITYNEAR_URL,
      type: CITYNEAR_TYPE,
      data: {
        district_id: districts
      },
      success_fun: function (circles) {
        for (var i = 0; i < circles.length; i++) {
          $("#circle").append('<option value="' + circles[i].id + '">' + circles[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },


  /************初始化一级分类*****************/
  initialize_lclass: function (recall) {
    ajax_request({
      url: CATEGORY_URL,
      type: CATEGORY_TYPE,
      async: false,
      success_fun: function (info) {
        for (var i = 0; i < info.length; i++) {
          $("#repast").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        }

        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据一级分类得到二级分类列表 ok
  get_mclass: function (lclass_id, recall) {
    ajax_request({
      url: LCLASS_URL,
      type: LCLASS_TYPE,
      data: {
        lclass_id: lclass_id
      },
      success_fun: function (info) {
        for (var i = 0; i < info.length; i++) {
          $("#category").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据二级分类得到三级分类列表
  get_sclass: function (mclass_id, recall) {
    ajax_request({
      url: SCLASS_URL,
      type: SCLASS_TYPE,
      data: {
        mclass_id: mclass_id
      },
      success_fun: function (info) {
        for (var i = 0; i < info.length; i++) {
          $("#small_category").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        }

        if (info.length === 0) {
          $("#small_category").css("display", "none");
        } else {
          $("#small_category").css("display", "");
        }

        if (!!recall) {
          recall();
        }
      }
    });
  },


  /************初始化银行省份下拉列表**********/
  initialize_bankProvinces: function (recall) {
    ajax_request({
      url: BANK_PROVINCES_URL,
      type: BANK_PROVINCES_TYPE,
      async: false,
      success_fun: function (provinces) {
        for (var i = 0; i < provinces.length; i++) {
          $("#accountBankSheng").append('<option value="' + provinces[i].id + '">' + provinces[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据银行省份得到城市列表
  get_bankCities: function (admiprovince_id, recall) {
    ajax_request({
      url: BANK_CITIES_URL,
      type: BANK_CITIES_TYPE,
      data: {
        admiprovince_id: admiprovince_id
      },
      success_fun: function (cities) {
        for (var i = 0; i < cities.length; i++) {
          $("#accountBankShi").append('<option value="' + cities[i].id + '">' + cities[i].name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据银行城市得到银行列表
  get_banks: function (recall) {
    ajax_request({
      url: BANKS_URL,
      type: BANKS_TYPE,
      success_fun: function (banks) {
        for (var i = 0; i < banks.length; i++) {
          $("#bankNameInput").append('<option value="' + banks[i].bank_id + '">' + banks[i].bank_name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },

  //根据银行得到支行列表 ok
  get_bankbranches: function (admicity_id, bank_id, recall) {
    ajax_request({
      url: SUBBANKS_URL,
      type: SUBBANKS_TYPE,
      data: {
        bank_id: bank_id,
        admicity_id: admicity_id
      },
      success_fun: function (banks) {
        for (var i = 0; i < banks.length; i++) {
          $("#accountBankNameInput").append('<option value="' + banks[i].subbank_id + '">' + banks[i].subbank_name + '</option>');
        }
        if (!!recall) {
          recall();
        }
      }
    });
  },


  //上传普通图片及验证
  upload_verifyImg: function (e) {
    var id = $(e.target).parents(".form-group").find("input[type=file]").attr("id");
    var file = document.getElementById(id);
    var filesize = file.files[0].size;

    var filepath = $(e.target).parents(".form-group").find("input[type=file]").val();
    var extStart = filepath.lastIndexOf(".");
    var ext = filepath.substring(extStart, filepath.length).toUpperCase();

    $('form').tooltip('destroy');

    if (ext != ".JPEG" && ext != ".JPG" && ext != ".PNG") {   //限制类型为png\jpg\jpeg

      $(e.target).parents(".form-group").find("ol").css("display", "none");
      $(e.target).parents(".form-group").find(".tmperror").css("display", "");

    } else {  //限制大小为2M

      if (filesize <= 2 * 1024 * 1024) {

        $(e.target).parents(".form-group").find("ol").css("display", "");
        $(e.target).parents(".form-group").find(".tmperror").css("display", "none");

        $(e.target).closest("form").ajaxForm({
          url: TEMP_PHOTOS_URL,
          type: TEMP_PHOTOS_TYPE,
          success: function (data) {
            var info = data.content.url;
            var img_path = "" + info;

            $(e.target).closest("form").find(".span_upload").text("");
            $(e.target).css("opacity", 0);
            $(e.target).parents(".div-upload").css("background", "white");

            $(e.target).parents(".div-upload").find(".tmp_img").css("display", "");
            $(e.target).parents(".div-upload").find(".tmp_img").attr("src", img_path);
            $(e.target).parents(".div-upload").find(".tmp_img").attr("data-path", info);

          },
          error: function (data) {
            if (data.error_info == "logout") {
              top.window.location.href = "../../login.html";
            } else {
              alert("上传失败，请重试~");
            }
          }
        }).submit();

      } else {

        $(e.target).parents(".form-group").find("ol").css("display", "none");
        $(e.target).parents(".form-group").find(".tmperror").css("display", "");
      }
    }
  },

  //获取图片并展示
  show_tmpimage: function (data, obj) {
    var card = data;
    var card_path = "" + card;

    $(obj).find(".span_upload").text("");
    $(obj).find(".photo-upload").css("opacity", 0);
    $(obj).find(".div-upload").css("background", "white");

    $(obj).find(".tmp_img").css("display", "");
    $(obj).find(".tmp_img").attr("src", card_path);
    $(obj).find(".tmp_img").attr("data-path", card);
  },

  //图片放大预览
  amplify_tmpImg: function ($image, $imgDiv) {
    var imgsrc = $image.attr("data-path");
    var theImage = new Image();
    var imgstr = "";

    if (!!imgsrc && imgsrc != "") {
      theImage.src = imgsrc;
      var imageWidth = theImage.width;
      var imageHeight = theImage.height;

      if ($image.css("width") == "140px" && $image.css("height") == $image.css("width")) {   //LOGO
        imgstr = "<img style='width:250px;height:250px' src='" + imgsrc + "'/>";
      } else {
        if (imageWidth >= imageHeight) {
          imgstr = "<img style='width:640px;height:480px' src='" + imgsrc + "'/>";
        } else if (imageWidth < imageHeight) {
          imgstr = "<img style='width:480px;height:640px' src='" + imgsrc + "'/>";
        }
      }

      $imgDiv.tooltip({
        html: true,
        selector: ".imgTooltip",
        placement: "right",
        trigger: "hover",
        template: "<div class='tooltip tooltip-top' role='tooltip'>" +
        "<div class='tooltip-inner'></div></div>",
        title: imgstr
      }).tooltip('show');
    }
  },

  //商家合约图片上传
  uploadConstract_verifyImg: function (e) {
    var id = $(e.target).parents(".form-group").find("input[type=file]").attr("id");
    var file = document.getElementById(id);
    var filesize = file.files[0].size;

    var filepath = $(e.target).parents(".form-group").find("input[type=file]").val();
    var extStart = filepath.lastIndexOf(".");
    var ext = filepath.substring(extStart, filepath.length).toUpperCase();

    //限制类型为png\jpg\jpeg\bmp\gif
    if (ext != ".JPEG" && ext != ".JPG" && ext != ".PNG" && ext != ".BMP" && ext != ".GIF") {
      $(e.target).closest(".form-group").find("small").css("color", "#ab0000");

    } else {  //限制大小为2M
      if (filesize <= 2 * 1024 * 1024) {

        $(e.target).closest("form").ajaxForm({
          url: TEMP_PHOTOS_URL,
          type: TEMP_PHOTOS_TYPE,
          success: function (data) {
            var info = data.content.url;
            var img_path = "" + info;

            $(e.target).closest(".form-group").find("small").css("color", "#393939");

            $("#constemp").css("display", "");
            $("<div class='img_wrap'><img src='" + img_path + "' class='tmp_img' data-path=" +
                info + "/><span class='fa fa-times-circle delete' onclick='delete_tmp(event);'>" +
                "</span></div>").appendTo("#constemp");
          },
          error: function (data) {
            /*console.log(result);*/
            if (data.error_info == "logout") {
              top.window.location.href = "../../login.html";
            } else {
              alert("上传失败，请重试~");
            }
          }
        }).submit();
      }
    }
  },

  //结款申请 上传
  excelFile_upload: function (e) {
    var filepath = $("#upload").val();
    var extStart = filepath.lastIndexOf(".");
    var ext = filepath.substring(extStart, filepath.length).toUpperCase();

    //限制类型为excel文件
    if (ext != ".XLS" && ext != ".XLSX" && ext != ".XLSB" && ext != ".XLSM" && ext != ".XLST") {
      alert("请上传excel文件！");
    } else {
      ajax_request({
        url: EXCEL_UPLOAD_URL,
        type: EXCEL_UPLOAD_TYPE,
        data: {
          daily_tasks: filepath
        },
        success_fun: function (data) {
          alert("上传成功!")
        }
      });
    }
  },

  //提交（新店注册）数据
  pack_BASEdata: function (para) {
    var data = {
      "step": "BASE",
      "applynum": para,
      "userinfo": {
        "name": $("#Name").val(),  //商家姓名,
        "phonenum": $("#phoneInput").val()   //商家手机
      },
      "businfo": {
        "busname": $("#store_name").val(),    //店铺名称,
        "province_id": $("#province").val(),//所在省
        "city_id": $("#city").val(),  //所在城市
        "district_id": $("#district").val(),  //所在区县
        "address_details": $("#address").val(),   //详细地址
        "address_point": $("#position").val(),   //百度地图坐标
        "city_near_id": $("#circle").val(), //所属商圈
        "lclass_id": $("#repast").val(),   //一级分类
        "mclass_id": $("#category").val(), // 二级分类
        "sclass_id": $("#small_category").val() //三级分类
      }
    };

    //座机
    if ($.trim($("#ext").val()) != "") {
      data.businfo.tel = $("#area_code").val() + "-" + $("#store_tel").val() + "-" + $("#ext").val();
    } else {
      if ($.trim($("#store_tel").val()) != "") {
        data.businfo.tel = $("#area_code").val() + "-" + $("#store_tel").val()
      } else {
        data.businfo.tel = "";
      }
    }

    return JSON.stringify(data);
  },

  pack_QUAdata: function (para) {
    var data = {
      step: "QUA",
      "applynum": para,
      busimages: {},
      blinfo: {},
      slinfo: {}
    };
    //LOGO、招牌、店内照片
    data.busimages.logo_url = $("#LOGO_tmp").find(".tmp_img").attr("src");
    data.busimages.brand_url = $("#signboard_tmp").find(".tmp_img").attr("src");
    data.busimages.indoor_url = $("#shopInner_tmp").find(".tmp_img").attr("src");

    //营业执照
    data.blinfo.bl_image_url = $("#blin_image").find(".tmp_img").attr("data-path");
    data.blinfo.bl_name = $("#licenceNameInput").val();   //执照名称
    data.blinfo.bl_account = $("#licenceApplyNumInput").val();   //执照注册号
    data.blinfo.bl_address = $("#licenceAddInput").val();   //执照注册地址

    //执照有效期.如果选择长期有效，则不传值
    if ($("#longTime").prop("checked")) {
      data.blinfo.bl_expire = "";
    }
    if ($("#TimeTo").prop("checked")) {
      data.blinfo.bl_expire = $("#datepicker").val();
    }

    //餐饮服务许可
    data.slinfo.sl_image_url = $("#slin_image").find(".tmp_img").attr("data-path");
    data.slinfo.sl_name = $("#catering_licenceNameInput").val();   //服务许可名称
    data.slinfo.sl_code = $("#catering_licenceApplyNumInput").val();   //服务许可注册号
    data.slinfo.sl_address = $("#catering_licenceAddInput").val();   //服务许可地址
    data.slinfo.sl_expire = $("#catering_datepicker").val();   //服务许可日期

    return JSON.stringify(data);
  },

  pack_BANKdata: function (para, flag, pass) {
    var data = {
      step: "BANK",
      "applynum": para,
      "type": flag,
      "bankinfo": {
        "account_type": "",
        "admiprovince_id": "",
        "admicity_id": "",
        "bank_id": "",
        "branch_id": "",
        "custom_branch": "",
        "person_or_company_name": "", //公司或者个人的名称
        "bank_account": "",      //银行卡号
        "billing_account_name": "",  //财务联系人
        "billing_account_tel": ""   //财务联系人号码
      },
      "userinfo": {
        "real_name": "",    //真实姓名
        "cert_type": "",  //证件类型
        "card_code": "",  //证件号
        "card_front_url": "",
        "card_back_url": ""
      }
    };

    if (pass.bank) {   //有银行信息
      data.bankinfo.account_type = $("#bankAccountInput").val();
      data.bankinfo.admiprovince_id = $("#accountBankSheng").val();//银行所属省
      data.bankinfo.admicity_id = $("#accountBankShi").val();//银行所属市
      data.bankinfo.bank_id = $("#bankNameInput").val();//银行名称
      data.bankinfo.person_or_company_name = $("#AccountNameInput").val();   //公司或者个人的名称
      data.bankinfo.bank_account = $("#bankTelInput").val();       //银行卡号
      data.bankinfo.billing_account_name = $("#billing_account_name").val();  //财务联系人
      data.bankinfo.billing_account_tel = $("#billing_account_tel").val();   //财务联系人号码

      //银行分支机构
      if ($("#bankEdit").prop("checked")) {   //自定义支行名称
        data.bankinfo.branch_id = "0";
        data.bankinfo.custom_branch = $("#accountBankNameHand").val();
      } else {
        data.bankinfo.branch_id = $("#accountBankNameInput").val();
        data.bankinfo.custom_branch = "";
      }
    }

    if (pass.person) {  //身份信息
      data.userinfo.real_name = $("#realName").val();    //真实姓名
      data.userinfo.cert_type = $("#IDType").val();  //证件类型
      data.userinfo.card_code = $("#identificationNumInput").val();  //证件号码

      if ($("#IDType").val() === "PASSPORT") {
        data.userinfo.card_front_url = $("#ps_image_form").find(".tmp_img").attr("src");
        data.userinfo.card_back_url = "";
      } else {
        data.userinfo.card_front_url = $("#idfront_image_form").find(".tmp_img").attr("src");
        data.userinfo.card_back_url = $("#idback_image_form").find(".tmp_img").attr("src");
      }
    }
    return JSON.stringify(data);
  },

  pack_ACCdata: function (para, is_verify) {
    var data = {
      "step": "ACC",
      "applynum": para,
      "type": is_verify,   //送审为"VERIFYING"，保存为"HANDLING"
      accountinfo: {}
    };
    //账户信息
    data.accountinfo.account = $("#accountInput").val();   //用户账号
    data.accountinfo.password = $("#passwordInput").val();    //用户密码

    return JSON.stringify(data);
  },

  //提交（分店注册）数据
  packB_BASEdata: function (para, account) {
    var data = {
      "step": "BASE",
      "applynum": para,
      "userinfo": {
        "name": $("#res_name").val(),  //商家姓名,
        "phonenum": $("#phoneInput").val(),   //商家手机
        "account": account
      },
      "businfo": {
        "tel": "",
        "busname": $("#store_name").val(),    //店铺名称,
        "province_id": $("#province").val(),//所在省
        "city_id": $("#city").val(),  //所在城市
        "district_id": $("#district").val(),  //所在区县
        "address_details": $("#address").val(),   //详细地址
        "address_point": $("#position").val(),   //百度地图坐标
        "city_near_id": $("#circle").val(), //所属商圈
        "lclass_id": $("#repast").val(),   //一级分类
        "mclass_id": $("#category").val(), // 二级分类
        "sclass_id": $("#small_category").val() //三级分类
      }
    };

    //座机
    if ($.trim($("#ext").val()) != "") {
      data.businfo.tel = $("#area_code").val() + "-" + $("#store_tel").val() + "-" + $("#ext").val();
    } else {
      if ($.trim($("#store_tel").val()) != "") {
        data.businfo.tel = $("#area_code").val() + "-" + $("#store_tel").val()
      } else {
        data.businfo.tel = "";
      }
    }

    return JSON.stringify(data);
  },

  packB_QUAdata: function (para) {
    var data = {
      "step": "QUA",
      "applynum": para,
      "busimages": {},
      "blinfo": {},
      "slinfo": {}
    };
    //LOGO、招牌、店内照片
    data.busimages.logo_url = $("#LOGO_tmp").find(".tmp_img").attr("src");
    data.busimages.brand_url = $("#signboard_tmp").find(".tmp_img").attr("src");
    data.busimages.indoor_url = $("#shopInner_tmp").find(".tmp_img").attr("src");

    //营业执照
    data.blinfo.bl_image_url = $("#blin_image").find(".tmp_img").attr("data-path");
    data.blinfo.bl_name = $("#licenceNameInput").val();   //执照名称
    data.blinfo.bl_account = $("#licenceApplyNumInput").val();   //执照注册号
    data.blinfo.bl_address = $("#licenceAddInput").val();   //执照注册地址

    //执照有效期.如果选择长期有效，则不传值
    if ($("#longTime").prop("checked")) {
      data.blinfo.bl_expire = "";
    }
    if ($("#TimeTo").prop("checked")) {
      data.blinfo.bl_expire = $("#datepicker").val();
    }

    //餐饮服务许可
    data.slinfo.sl_image_url = $("#slin_image").find(".tmp_img").attr("data-path");
    data.slinfo.sl_name = $("#catering_licenceNameInput").val();   //服务许可名称
    data.slinfo.sl_code = $("#catering_licenceApplyNumInput").val();   //服务许可注册号
    data.slinfo.sl_address = $("#catering_licenceAddInput").val();   //服务许可地址
    data.slinfo.sl_expire = $("#catering_datepicker").val();   //服务许可日期

    return JSON.stringify(data);
  }
};


//下拉框改变事件
var selectChange = {
  /*省市区下拉框改变事件*/
  province_change: function () {
    $("#province").change(function () {
      $(this).find("option[value='']").remove();

      $("#city").empty();
      $("#city").append('<option value="">--市--</option>');
      $("#district").empty();
      $("#district").append('  <option value="">--区/县--</option>');
      register.get_cities($(this).val());

    });

    $("#city").change(function () {
      $(this).find("option[value='']").remove();

      $("#district").empty();
      $("#district").append('  <option value="">--区/县--</option>');
      register.get_districts($(this).val());
      $("#circle").empty();
      $("#circle").append('  <option value="">--商圈--</option>');

    });
    $("#district").change(function () {
      $(this).find("option[value='']").remove();

      $("#circle").empty();
      $("#circle").append('<option value="">--商圈--</option>');
      register.get_circles($(this).val());
    });
    $("#circle").change(function () {
      $(this).find("option[value='']").remove();

    });
  },
  /*银行省市区下拉框改变事件*/
  bank_change: function () {
    $("#accountBankSheng").change(function () {
      $(this).find("option[value='']").remove();

      $("#accountBankShi").empty();
      $("#accountBankShi").append('<option value="">请选择市</option>');
      $("#bankNameInput").empty();
      $("#bankNameInput").append('<option value="">请选择</option>');
      $("#accountBankNameInput").empty();
      $("#accountBankNameInput").append('<option value="">请选择</option>');

      register.get_bankCities($(this).val());

    });

    $("#accountBankShi").change(function () {
      $(this).find("option[value='']").remove();

      $("#bankNameInput").empty();
      $("#bankNameInput").append('<option value="">请选择</option>');
      register.get_banks();
      $("#accountBankNameInput").empty();
      $("#accountBankNameInput").append('<option value="">请选择</option>');

    });
    $("#bankNameInput").change(function () {
      $(this).find("option[value='']").remove();

      $("#accountBankNameInput").empty();
      $("#accountBankNameInput").append('<option value="">-开户行名称-</option>');

      register.get_bankbranches($("#accountBankShi").val(), $(this).val());

    });
    $("#accountBankNameInput").change(function () {
      $(this).find("option[value='']").remove();
    });
  },
  /*商家分类下拉框改变事件*/
  shopType_change: function () {
    $("#repast").change(function () {

      $(this).find("option[value='']").remove();

      $("#category").empty();
      $("#category").append('<option value="">品类</option>');
      register.get_mclass($(this).val());
      $("#small_category").empty();
      $("#small_category").append('<option value="">子类别</option>');

    });
    $("#category").change(function () {
      $(this).find("option[value='']").remove();

      $("#small_category").empty();
      $("#small_category").append('<option value="">子类别</option>');
      register.get_sclass($(this).val());
    });
    $("#small_category").change(function () {
      $(this).find("option[value='']").remove();
    })
  },
  /*有无营业执照显示状况*/
  license_yesOrno: function () {

    $("#no_license").on("click", function () {
      $("#license_photo").css("display", "none");
    });
    $("#has_license").on("click", function () {
      $("#license_photo").css("display", "");
    });
  }
};

//审核
var checkVerify = {
  dateFestivals: null,
  shopsInfo: null,
  getFestivals: function () {  //节假日数据获取
    ajax_request({
      url: FESTIVALS_URL,
      type: FESTIVALS_TYPE,
      async: false,
      success_fun: function (data) {
        checkVerify.dateFestivals = data;
      }
    });
  }
};

// 表格操作
var table_operation = {
  //获取BD列表
  assignList: function (id) {
    ajax_request({
      url: BDAPPLY_LIST_URL,
      type: BDAPPLY_LIST_TYPE,
      success_fun: function (data) {
        $(data).each(function (index, element) {   //BD列表添加数据
          $(id).append("<option value=" + element.name + ">" + element.name + "</option>");
        });
      }
    });
  },

  //输入框搜索
  input_search: function (table, id, index) {
    $(id).on("keyup", function () {
      table.column(index).search(this.value).draw();
    });
  },

  //下拉列表搜索
  select_search: function (table, id, exp, index) {
    $(id).on("change", function () {
      if ($(id).val() === exp) {   //点击冻结
        table.column(index).search("").draw();
      } else {
        table.column(index).search(this.value).draw();
      }
    });
  },

  //筛选日期比较(自定义)
  date_compare: function (begin, end, res, time) {
    var result = [];
    var beginDate = new Date(begin.replace(/年|月/g, "/").replace(/日/g, ""));
    var endDate = new Date(end.replace(/年|月/g, "/").replace(/日/g, ""));

    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        var item = res[i];
        var submittime = null;
        if (!!item.submit_time) {
          submittime = item.submit_time;
        } else {
          submittime = item.create_datetime;
        }
        var time = (submittime.split(" "))[0];  //获取传输数据的年月日
        if (time.indexOf("-") > 0) {
          if (beginDate <= new Date(time.replace(/-/g, "/")) &&
              endDate >= new Date(time.replace(/-/g, "/"))) {
            result.push(item);
          }
        } else {
          if (beginDate <= new Date(time.replace(/年|月/g, "/").replace(/日/g, "")) &&
              endDate >= new Date(time.replace(/年|月/g, "/").replace(/日/g, ""))) {
            result.push(item);
          }
        }
      }
      return result;
    } else {
      return [];
    }
  },

  datepickerFrom_change: function (id, datas) {    // 开始日期改变触发搜索
    var res = null;
    res = table_operation.date_compare($(".dateFrom", id).val(), $(".dateTo", id).val(), datas);
    return res;
  },

  datepickerTo_change: function (id, datas) {    // 结束日期改变触发搜索
    var res = null;
    res = table_operation.date_compare($(".dateFrom", id).val(), $(".dateTo", id).val(), datas);
    return res;
  },

  datepicker_reset: function (current, id) {    // 日期重置
    $('.dateFrom', id).val(moment(current).subtract(1, 'M').format('YYYY年MM月DD日'));
    $('.dateTo', id).val(moment(current).format('YYYY年MM月DD日'));
  },

  //每页显示条数
  items_change: function (id, table) {
    $(".showPage", id).change(function () {
      table.page.len(parseInt($(this).val())).draw();
      $(this).closest(".divparent").find(".itemnum").html($(this).val());
    });
  },

  //页面跳转
  pageJump: function (table, previous, next, first, last, page) {
    $(next).on('click', function () {
      table.page('next').draw('page');
      $(page).html(table.page.info().page + 1);
    });
    $(previous).on('click', function () {
      table.page('previous').draw('page');
      $(page).html(table.page.info().page + 1);
    });
    $(first).on('click', function () {
      table.page('first').draw('page');
      $(page).html(1);
    });
    $(last).on('click', function () {
      table.page('last').draw('page');
      $(page).html(table.page.info().pages);
    });
  }
};


//在给url传参数和在url上添加参数
/*(function ($) {
 $.extend({
 Request: function (m) {    //获取参数
 var sValue = window.parent.location.href.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
 return sValue ? sValue[1] : sValue;
 },
 UrlUpdateParams: function (url, name, value) {    //添加参数
 var r = url;
 if (r != null && r != 'undefined' && r != "") {
 value = encodeURIComponent(value);
 var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
 var tmp = name + "=" + value;
 if (url.match(reg) != null) {
 r = url.replace(eval(reg), tmp);
 }
 else {
 if (url.match("[\?]")) {
 r = url + "&" + tmp;
 } else {
 r = url + "?" + tmp;
 }
 }
 }
 return r;
 }
 });
 })(jQuery);*/



