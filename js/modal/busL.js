

$(function () {

    function busInfoSubmit() {
        ajax_request({
            url: BUSLIST_SUBMIT_URL,
            type: BUSLIST_SUBMIT_TYPE,
            data: {
                bus_id: urlpera.id,
                status: urlpera.status,
                name: urlpera.name,
                phonenum: urlpera.phonenum
            },
            success_fun: function (data) {
                $(".close").trigger("click");
                set_modal({
                    path:"modal/busL/busListSuccessModal.html",
                    disappear:true
                });
                hidemode_func('busList.html');   //返回商家列表
            }
        });
    }


    //确认通过
    $("#submitbusL").on("click", function () {
        busInfoSubmit();
    });

});