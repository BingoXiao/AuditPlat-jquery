

$(function () {
    var coupons = {
        //删除优惠券
        deleteCoupons: function (id) {
            ajax_request({
                url: EVENTS_CMDELETE_URL(id),
                type: EVENTS_CMDELETE_TYPE,
                success_fun: function (data) {
                    $(".close").trigger("click");
                    window.frames["iframe_account"].refreshCouponsTable();
                }
            });
        },
        //删除活动
        deleteEvents: function (id) {
            ajax_request({
                url: EVENTS_ELDELETE_URL(id),
                type: EVENTS_ELDELETE_TYPE,
                success_fun: function (data) {
                    $(".close").trigger("click");
                    window.frames["iframe_account"].refreshEventsTable();
                }
            });
        },
        //下线活动
        offlineEvents: function (id) {
            ajax_request({
                url: EVENTS_OFFLINEINFO_URL(id),
                type: EVENTS_OFFLINEINFO_TYPE,
                async: false,
                success_fun: function (data) {
                    $(".close").trigger("click");
                    window.frames["iframe_account"].refreshEventsTable();
                }
            });
        }
    };


    /*优惠券管理*/
    // 删除优惠券
    $("#deleteCoupons").on("click", function () {
        coupons.deleteCoupons(urlpera);
    });


    /*活动列表*/
    // 删除活动
    $("#deleteEvents").on("click", function () {
        coupons.deleteEvents(urlpera);
    });

    //下线
    $("#offlineEvents").on("click", function () {
        coupons.offlineEvents(urlpera);
    });



});