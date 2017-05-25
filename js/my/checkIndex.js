var perms = null;    //权限
var topName = null;    //账号
var accID = null;    //ID
var urlpera = null;//接受来自模态框的参数

/*************** 模态框 ***************/
//模态框加载内容
function set_modal() {
  var option = arguments[0];
  var dis = option.disappear || '';
  var path = option.path;

  urlpera = option.para || '';

  $modal = $("#my_modal");
  $modal.removeData("bs.modal");

  $modal.modal("show");
  /*load( url, [data], [callback])对jQuery.ajax()进行封装*/
  $("#modalcontent").load(path, '', function () {
    if (option.loadFun) {
      option.loadFun();
    }

    if (dis) {    //1秒后消失
      $modal.on('shown.bs.modal', function (e) {
        setTimeout(function () {
          $("#my_modal").modal("hide");
        }, 1000);
      });
    }
  });
}


//模态框隐藏后跳转页面
function hidemode_func(path) {
  $("#my_modal").on('hidden.bs.modal', function (e) {
    $("#left-navlist").css("display", "");
    $('#rightIframe').attr('src', path)
  });
}

//脉点预览(模态框)
function JMView(content) {
  $modal = $("#JMDot_modal");
  $ModalContent = $("#JMDotContent");
  $ModalContent.empty();
  $ModalContent.append(content);
  $modal.modal("show");
}

//自动登录
function logAuto() {
  ajax_request({
    url: AUTO_LOGIN_URL,
    type: AUTO_LOGIN_TYPE,
    async: false,
    success_fun: function (data) {
      perms = data.perms;
      topName = data.account;
      accID = data.id;

      $('#left-navlist').css({display: ""});
    },
    fail_fun: function (error_info) {
      console.log(error_info);
    }
  });
}

var anchor = null;    //记录锚点
var htm = null;    //记录页面名称
var initAnchor = (window.location.hash).split("?")[0];   //网站初始锚点
var initHtm = initAnchor.split("#")[1];
var pers = (window.location.hash).split("=")[1];


$(function () {
  var mainIframe = {
    //修改密码
    changepwd: function () {
      ajax_request({
        url: ACCOUNTS_PASSWORD_URL,
        type: ACCOUNTS_PASSWORD_TYPE,
        data: {
          id: accID,
          new_password: $("#newPW").val(),
          old_password: $("#oldPW").val()
        },
        success_fun: function (data) {
          $("#pwd_tips").css("display", "none");
          $('#rightIframe', window.top.document).attr('src', 'changePWSuccess.html');
        }
      });
    },

    //系统登出
    logout: function () {
      ajax_request({
        url: ACCOUNTS_LOGOUT_URL,
        type: ACCOUNTS_LOGOUT_TYPE,
        success_fun: function (data) {
          sessionStorage.clear();
          $.cookie("sessionid", null);
          $.cookie("REMEMBER", null);
          top.window.location.href = "../../login.html";
        },
        fail_fun: function (error_info) {
          top.window.location.href = "../../login.html";
        }
      });
    }
  };

  //模态框初始化
  common.modal_Initiate();
  //防止同一个浏览器下多个账号登录
  logAuto();
  //强制退出
  if (!topName) {
    $.cookie("sessionid", null);
    window.location.href = "../../login.html";
  }

  // 头部账号
  $("#usernameTop").html(topName);


  //模态框出现前清空模态框中的所有内容以及错误标志
  $("#my_modal").on('show.bs.modal', function () {
    $("input[type='text']", this).val("");
    $("input[type='password']", this).val("");
    $("textarea").val("");
    $("input[type='checkbox']", this).attr("value", "0").prop("checked", false);

    $("input[name='priority']", this).closest("div").css({"color": "#919191"});
    $("input[name='pri']", this).closest("div").css({"color": "#919191"});
    $("input", this).removeClass('errorInput');
    $(".error", this).closest("div").remove();
  });


  //复选框设置
  $("input[type='checkbox']").on("click", function () {
    if ($(this).prop("checked")) {
      $(this).attr("value", "1");
    } else {
      $(this).attr("value", "0");
    }
  });


  // 点击左选单进入对应详情页面
  $("#left-navlist").find(".panel-body").find("li").bind("click", function () {
    var $active = $(this).find("a");
    var $activeM = $(this).parents(".Listdiv").prev(".collapseParents");

    anchor = $active.attr("href");
    htm = anchor.split("#")[1];

    $(this).parents(".Listdiv").css("display", "block");   //左选单展开
    $activeM.find("a").attr("href", anchor);
    if ($active.parents(".Listdiv").css("display") == "none") {
      $activeM.children("span").removeClass("fa-rotate-90");
    } else {
      $activeM.children("span").addClass("fa-rotate-90");
    }

    $(".panel-body").find(".active").removeClass("active");  //添加选中样式
    $active.addClass("active");

    if (!!pers && $active.attr("id") == "EMaddEvents_a") {//载入页面
      $("#rightIframe").attr("src", htm + ".html" + "?id=" + pers);
    } else {
      $("#rightIframe").attr("src", htm + ".html");
      pers = null;
    }

    $("a", this)[0].click();   //触发a标签点击事件（添加锚点）
  });

  $(".collapseParents").on('click', function () {    //折叠菜单
    var $next = $(this).next(".Listdiv");
    var $nextSiblings = $(this).siblings().next(".Listdiv");
    var $icon = $(this).children("span");

    $(this).find("a").attr("href", anchor);
    $nextSiblings.slideUp("normal", function () {
      $(".collapseParents").children("span").removeClass("fa-rotate-90");
    });
    $next.slideToggle("normal", function () {  //左选单三角形状态改变
      if ($next.css("display") == "none") {
        $icon.removeClass("fa-rotate-90");
      } else {
        $icon.addClass("fa-rotate-90");
      }
    });
  });


  //点击公司icon返回首页
  $("#jmicon").click(function () {
    $('#left-navlist').css("display", "");

    $("#left-navlist").find("li").find("a").removeClass('active');
    $(anchor + "_a").addClass("active"); //添加样式

    $(anchor).trigger("click");   //触发li标签点击事件（添加锚点）
    $('#rightIframe').attr('src', htm + '.html');  //加载页面
  });


  (function () {    //根据权限显示左选单
    //BD
    if (perms.bus_apply == 1 || perms.bus_register == 1) {
      $("#BDTitle").css("display", "");

      if (perms.bus_apply == 1) {    //商家申请
        $("#BDapply").css("display", "");
      }
      if (perms.bus_register == 1) {   //商家注册和列表
        $("#BDregister").css("display", "");
        $("#busList").css("display", "");
      }
    }
    //总审核人员
    if (perms.bus_verify == 1 || perms.project_verify == 1 || perms.checkout_verify == 1) {
      $("#verifyTitle").css("display", "");

      if (perms.bus_verify == 1) {   //商店审核人员
        $("#busVerify").css("display", "");
      }
      if (perms.project_verify == 1) {    //项目审核人员
        $("#projectVerify").css("display", "");
      }
      if (perms.checkout_verify == 1) {   //结款审核人员
        $("#settleVerify").css("display", "");
      }
    }
    //项目管理(项目列表)
    if (perms.item_list == 1) {
      $("#proManagement").css("display", "");
      $("#projectList").css("display", "");
    }
    //管理员账号 (具备附加权限:商家管理、系统设置)
    if (perms.bus_apply == 1 && perms.bus_register == 1 && perms.bus_verify == 1 &&
        perms.checkout_verify == 1 && perms.project_verify == 1 && perms.item_list == 1) {
      $("#BusManagement").css("display", "");   //商家管理
      $("#BusManagementList .panel-body").css("display", "");   //系统公告

      $("#EventManagement").css("display", "");   //活动管理
      $("#EventManagementList .panel-body").css("display", "");  //活动列表

      $("#systemSetting").css("display", "");   //系统设置
      $("#systemSettingList .panel-body").css("display", "");  //账户管理
    }

    if (typeof initHtm == "undefined") {    //初次登入
      $(permsSetting(perms)).trigger("click");
    } else {     //刷新页面
      $("#" + initHtm).trigger("click");   //触发li标签点击事件（添加锚点）
    }
  })();


  //点击顶部下拉列表（修改密码、登出）
  $("#load_point").on("click", function () {
    $("#TopRList").toggle();
  });
//****************************修改个人密码 ********************************/
  //进入修改密码页面
  $(document).on("click", "#editPWTOP", function () {
    $('#rightIframe', window.top.document).attr('src', 'changePWD.html');
    $('#left-navlist').css("display", "none");
    $("#TopRList").hide();
  });

  $("#staticName").html(topName);   //自动填充账号
  $("#oldPW").val("").focus();

//密码格式验证
  $("#editPasswordForm").validate({
    rules: {
      old_password: {
        required: true
      },
      new_password: {
        required: true,
        isPassword: ""
      },
      conPW: {
        required: true,
        equalTo: "#newPW"
      }
    },
    messages: {
      old_password: {
        required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请输入原密码"
      },
      new_password: {
        required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请输入新密码"
      },
      conPW: {
        required: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;请再次确认密码",
        equalTo: "<i class='glyphicon glyphicon-remove-sign'></i>&nbsp;密码输入不一致"
      }
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    highlight: function (element, errorClass, validClass) {// element出错时触发
      $(element).addClass('errorInput');
    },
    unhighlight: function (element, errorClass) { // element通过验证时触发
      $(element).removeClass('errorInput');
    }
  });

  $("#conPW").bind("input propertyChange", function () {
    $("#pwd_tips").css("display", "none");
  });

// 提交密码
  $("#pwdConfirm").click(function () {

    if ($("#editPasswordForm").valid()) {   //验证成功

      if ($("#newPW").val() === $("#oldPW").val()) {
        $("#pwd_tips").css("display", "");

      } else {
        mainIframe.changepwd();
      }
    }
  });


  /***************退出系统 ***********************/
  $(document).on("click", "#logOut", function () {
    $("#TopRList").hide();
    mainIframe.logout();
  });


});

