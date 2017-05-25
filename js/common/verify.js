/**
 * Created by ThinkPad on 2016/11/8.
 */
// 信息验证函数
var verify_function={
    phone_verify : function ($basic_list){
        var patten = /^1\d{10}$/;
        if (!patten.test($basic_list.val())) {
            $basic_list.addClass("errorInput");
            $("#phone_tips").css("display", "");
        }else{
            $("#phone_tips").css("display", "none");
        }
    },

    phoneS_verify : function ($basic_list){    //财务联系人号码
        var patten = /^1\d{10}$/;
        if (!patten.test($basic_list.val())) {
            $basic_list.addClass("errorInput");
            $("#billing_phone_tips").css("display", "");
        }else{
            $("#billing_phone_tipss").css("display", "none");
        }
    },

    tel_verify : function ($basic_list){
        var patten = new RegExp(/^\d{1,}$/);
        if (!patten.test($basic_list.val())) {
            $("#tel_tips").css("display", "");
            $basic_list.addClass("errorInput");
        }else{
            $("#tel_tips").css("display", "none");
        }
    },

    idnum_verify : function ($id_list) {
        var patten = /^[a-zA-Z\d]{1,}$/;
        if (!patten.test($id_list.val())) {
            $("#idnum_tips").css("display","");
            $id_list.addClass("errorInput");
        }else{
            $("#idnum_tips").css("display","none");
        }
    },

    licname_verify : function ($qua_list) {
        var patten = /^[a-zA-Z\u4e00-\u9fa5\d\(\)]{1,}$/;
        if (!patten.test($qua_list.val())) {
            $qua_list.addClass("errorInput");
            $qua_list.closest(".form-group").find(".errorTips").css("display", "");
        }else{
            $qua_list.closest(".form-group").find(".errorTips").css("display", "none");
        }
    },

    licnum_verify : function ($qua_list) {
        var patten = /^[a-zA-Z\d]{1,}$/;
        if (!patten.test($qua_list.val())) {
            $qua_list.addClass("errorInput");
            $qua_list.closest(".form-group").find(".errorTips").css("display", "");
        }else{
            $qua_list.closest(".form-group").find(".errorTips").css("display", "none");
        }
    },

    licadd_verify : function ($qua_list) {
        var patten = /^[a-zA-Z\u4e00-\u9fa5\d]{1,}$/;
        if (!patten.test($qua_list.val())) {
            $qua_list.addClass("errorInput");
            $qua_list.closest(".form-group").find(".errorTips").css("display", "");
        }else{
            $qua_list.closest(".form-group").find(".errorTips").css("display", "none");
        }
    },

    bankcard_verify : function ($settle_list) {
        var patten = new RegExp(/^\d{1,}$/);
        if (!patten.test($settle_list.val())) {
            $settle_list.addClass("errorInput");
            $settle_list.closest(".form-group").find(".errorTips").css("display", "");
        }else{
            $settle_list.closest(".form-group").find(".errorTips").css("display", "none");
        }
    },

    account_verify : function ($acc_list) {
        var patten = /^[\u4e00-\u9fa5\d\w\.\_\-]{2,30}$/;
        if (!patten.test($acc_list.val())) {
            $acc_list.addClass("errorInput");
            $("#acc_tips").css("display", "");
        }else{
            $("#acc_tips").css("display", "none");
        }


    },

    password_verify : function($acc_list){
        var patten = /^[\x21-\x7e]{6,16}$/;
        if (!patten.test($acc_list.val())) {
            $acc_list.addClass("errorInput");
            $("#pwd_tips").css("display", "");
        }else{
            $("#pwd_tips").css("display", "none");
        }
    },

    commission_verify : function($pro_list){
        var patten = /^\d{1}$|^(\d{1})\.(\d{1,2})$/;
        if (!patten.test($pro_list.val())) {
            $pro_list.addClass("errorInput");
        }
    },

    billing_verify : function($pro_list){
        var patten = /^\d{1,}$/;
        if (!patten.test($pro_list.val())) {
            $pro_list.addClass("errorInput");
            $("#pwd_tips").css("display", "");
        }else{
            $("#pwd_tips").css("display", "none");
        }
    }
};