
var busR = {
    //删除新店
    deleteNew: function (id) {
        ajax_request({
            url: BDREGISTER_DELETE_URL(id),
            type: BDREGISTER_DELETE_TYPE,
            success_fun: function (data) {
                $(".close").trigger("click");
                window.frames["iframe_account"].refreshTable();
            }
        });
    }
};

$(function () {

   $("#deleteRegister").on("click", function () {
      busR.deleteNew(urlpera);
   });

});
