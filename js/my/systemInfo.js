$(function (){

    var editor = CKEDITOR.instances.editor1;
    common.modal_Initiate();

    $("#send").click(function () {

        if($.trim($("#titleInput").val())=="" || editor.getData()==""){
            alert("请填写完整公告内容！");
        }else {

            var str=editor.getData();
            str=str.replace(/<br\s*\/?>/g,"\r\\n").replace(/\s/g, "\&nbsp;");

            ajax_request({
                url: SYSTEMINFO_SUBMIT_URL,
                type: SYSTEMINFO_SUBMIT_TYPE,
                data: {
                    title:$("#titleInput").val(),
                    content:str
                },
                success_fun: function (data) {
                    window.parent.set_modal({
                        path: "modal/noticeSuccessModal.html",
                        disappear: true
                    });
                    $("input").val("");
                    editor.setData("");
                }
            });
        }
    });


    // 顶部菜单栏
    $(".busL").find("li").click(function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
    });

});