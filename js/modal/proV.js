$(function () {

    //确认通过
    $(".confirmAgree").on("click", function () {
        window.frames["iframe_account"].operation(true, "");
    });


    //驳回验证
    $("#rejectInfo").validate({
        rules: {
            reasons: {
                required: true,
                rangelength: [1, 4]
            }
        },
        messages: {
            reasons: {
                required: "请选择驳回理由",
                rangelength: "请选择驳回理由"
            }
        },
        errorElement:"em",
        errorPlacement: function (error, element) {
            error.insertAfter(element).css("margin-top","50px");
        },
        highlight: function (element, errorClass, validClass) { // element出错时触发
            $("input[name='reasons']").css({"color": "#ab0000"});
        },
        unhighlight: function (element, errorClass) { // element通过验证时触发
            $(element).removeClass('errorInput');
            $("#errorTitle").css("color","#000000");
            $("input[name='reasons']").closest("div").css({"color": "#919191"});
        }
    });


    //验证通过后提交（驳回）
    $("#confirmReject").click(function () {
        var select = null;   //驳回原因（数组）

        if ($("#rejectInfo").valid()) {
            var reason = "";

            select = $("input[name='reasons']:checked");

            for (var i = 0; i < select.length; i++) {
                reason += $(select[i]).val() + " ";   //驳回原因
            }

            if ($.trim($("#otherReasons").val()) != "") {
                reason += reason + " " + $("#otherReasons").val();
            }

            window.frames["iframe_account"].operation(false, reason);
        }
    });


});