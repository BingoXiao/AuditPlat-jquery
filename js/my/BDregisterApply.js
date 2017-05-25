

$(function(){
//获取url的参数(注册号)
    var loc = decodeURIComponent(window.location.hash);
    var para =common.getUrlParameters(loc,'num');

    //日历初始化
    common.datepicker_initiate();

    //是否有营业执照
    selectChange.license_yesOrno();

    //图片放大
    $(".disabledOverlay").on("mouseenter", function () {
        var $imgDiv = $(this);
        var $image = $(this).find("img.tmp_img");
        register.amplify_tmpImg($image,$imgDiv);
    });
    $(".disabledOverlay").on("mouseleave", function () {
        $(this).tooltip("hide");
    });


    // 返回商家注册
    $('#returnRegisterList').click(function () {
        window.open('../checkIndex.html');
    });



/***************************商家申请基本内容填充****************************/
//初始化
    register.initialize_provinces();
    register.initialize_lclass();
    infoFilling.BDRegister_apply_info(para,"disabled");

});