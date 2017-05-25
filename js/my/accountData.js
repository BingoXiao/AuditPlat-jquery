//账号管理
var accM = {
    accountTable: null,   //账户管理表格
    name: null,   //账户姓名
    accID: null,  //账户ID
    editpri: null,  // 权限记录
    selectArr: [],   //选中组（按钮）
    sArr: [],   //选中组（表格内）  sArr.length==1
    fArr: []   //冻结（表格内）
};

//刷新表格
function accrefresh() {
    (accM.accountTable).ajax.reload(null, false);   //表格数据重新加载
    $.each(accM.selectArr, function (index, element) {
        $("#" + element).addClass('selected');
        $("#" + element).find("td").eq(0).find(":checkbox").prop("checked", true).val("1");  //复选框选中
    });
}


$(function () {

//表格内部冻结和启用
    test = function (e) {
        var aa = [];
        aa.push($(e).closest("tr").attr("id"));

        if ($(e).val() == 1) {
            accountData.frozenFun(aa, 0, false);
        } else {
            accountData.frozenFun(aa, 1, true);
        }
    };


// 使用函数
    var accountData = {
        //高亮选中
        selectCheckbox: function ($tr) {
            if ($tr.hasClass('selected')) {    //表格行选中状态时
                $tr.find("td").eq(0).find(":checkbox").prop("checked", true).val("1");  //复选框选中

                if ((accM.selectArr).indexOf($tr.attr("id")) == -1) {   //selectArr不存在当前数据
                    (accM.selectArr).push($tr.attr("id"));
                }
            } else {   //表格行未选中
                $tr.find("td").eq(0).find(":checkbox").prop("checked", false).val("0");   //复选框去除选中

                (accM.selectArr) = $.grep((accM.selectArr), function (num, index) {   //从selectArr中过滤该id
                    return num == $tr.attr("id");
                }, true);
            }
        },

        //冻结（启用）
        frozenFun: function (ids, flag, tf) {
            ajax_request({
                url: ACCOUNTS_fROZEN_URL,
                type: ACCOUNTS_fROZEN_TYPE,
                async: false,
                data: {
                    ids: ids,    //id数组
                    flag: flag   //冻结为0，启用为1
                },
                success_fun: function (data) {
                    $.each(ids, function (index, element) {
                        var eid = "#" + element;

                        $(eid).find(".frozen").bootstrapSwitch('state', tf);   //设置按钮状态

                        if (flag == 0) {  //冻结
                            $(eid).find('.help').html("F");

                        } else {  //启用
                            $(eid).find('.help').html("T");
                        }
                    });
                    accrefresh();  //刷新表格数据
                },
                fail_fun: function () {
                    errorReturn(data.error_info);
                    accrefresh();  //刷新表格数据
                },
                error_fun: function () {
                    $.each(ids, function (index, element) {
                        var eid = "#" + element;
                        $(eid).find(".frozen").bootstrapSwitch('state', !tf);   //设置按钮状态
                        if (flag == 0) {  //冻结
                            $(eid).find('.help').html("T");
                        } else {  //启用
                            $(eid).find('.help').html("F");
                        }
                    });
                }
            });
        },

        //删除
        deleteFuc: function (ids) {
            ajax_request({
                url: ACCOUNTS_DELETE_URL,
                type: ACCOUNTS_DELETE_TYPE,
                data: {
                    ids: ids
                },
                async: false,
                success_fun: function (data) {
                    window.parent.set_modal({
                        path: "./modal/accM/deleteModal.html",
                        disappear: true
                    });
                    accM.sArr = [];  //清空

                    if (ids.length < 2) {   // 传递进来的数组所含元素<2,判断传递进来的是sArr还是selectArr
                        (accM.selectArr) = $.grep((accM.selectArr), function (num, index) {
                            return num == ids[0];
                        }, true);    //过滤掉sArr中的元素

                    } else {  //传递进来的数据元素>2,传递进来的为selectArr
                        accM.selectArr = [];
                    }
                    accrefresh();//刷新表格数据
                }
            });
        },

        //账户管理表格加载
        accountM_datatables: function () {
            var res = null;
            return $('#accoutManageTable').DataTable({
                ajax: {
                    url: ACCOUNTS_TABLE_URL,
                    type: ACCOUNTS_TABLE_TYPE,
                    async: false,
                    dataSrc: function (data) { //提交成功的回调函数
                        if (data.success) {
                            return res = data.content;// 对返回数据进行处理
                        }
                    }
                },
                "data": res,
                "dom": 't<"bottom info"i>',
                //"info":false,
                "ordering": false,
                "autoWidth": false,
                "lengthChange": false,
                "pageLength": 10,
                "rowId": "id",
                "language": {
                    "lengthMenu": "每页 _MENU_ 条记录",
                    "zeroRecords": "没有找到记录",
                    "infoEmpty": "无记录",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "info": "共有 _TOTAL_ 条, 每页显示：10条"
                },
                "columnDefs": [   //第一列默认复选框
                    {
                        "targets": 0,
                        "data": null,
                        "width": '10%',
                        "defaultContent": "<div class='checkbox'><input type='checkbox' value='0' " +
                        "class='isSeleced'/><label></label></div>"
                    },

                    {     //第二列姓名
                        "targets": 1,
                        "data": 'name',
                        "width": '15%'
                    },

                    {     //第三列账号
                        "targets": 2,
                        "data": 'account',
                        "width": '15%'
                    },

                    {    //第四列为权限设置
                        "targets": 3,
                        "data": null,
                        "width": '30%',
                        "className": 'SERVICE',
                        "render": function (data, type, full, meta) {
                            service = [];
                            var item3 = "";
                            if (data.bus_verify) {   //商家审核权限1
                                item3 += "<img class='sjsh' src='../img/11.png'/><span style='display:none'>1</span>";

                            }
                            if (data.project_verify) { //项目审核权限2
                                item3 += "<img class='xmsh' src='../img/12.png'/><span style='display:none'>2</span>";

                            }
                            if (data.checkout_verify) {//结款审核权限3
                                item3 += "<img class='jksh' src='../img/13.png'/><span style='display:none'>3</span>";

                            }
                            if (data.bus_apply) { //商家申请权限4
                                item3 += "<img class='sjsq' src='../img/14.png'/><span style='display:none'>4</span>";

                            }
                            if (data.bus_register) {//商家注册权限5
                                item3 += "<img class='sjzc' src='../img/15.png'/><span style='display:none'>5</span>";

                            }
                            if (data.item_list) {//商家注册权限5
                                item3 += "<img class='xmlb' src='../img/16.png'/><span style='display:none'>6</span>";
                            }
                            return item3;
                        }
                    },

                    {   //第五列为状态（冻结或启用）
                        "targets": 4,
                        "data": null,
                        "width": '15%',
                        "className": 'FrozenSTATE',
                        "render": function (cell, type, full, meta) {
                            //冻结状态toggle-switch
                            if (cell.is_active == false) {
                                return "<input onclick='test(this)' class='frozen frozen1' type='checkbox' " +
                                    "value='0' style='z-index:10;width:140px;height:20px;'/><span " +
                                    "class='help'>F</span>";
                            } else {
                                return "<input onclick='test(this)' class='frozen frozen2' type='checkbox' " +
                                    "value='1' style='z-index:10;width:140px;height:20px;'/><span " +
                                    "class='help'>T</span>";
                            }
                        }
                    },

                    {   //第六列 操作
                        "targets": -1,
                        "data": null,
                        "width": '15%',
                        className: "editIcon",
                        "defaultContent": "<a class='glyphicon glyphicon-pencil editInfo' title='编辑'>" +
                        "</a>&nbsp;<a class='fa fa-key fa-flip-horizontal editPassword' title='修改密码'>" +
                        "</a>&nbsp;<a class='glyphicon glyphicon-trash delete' title='删除'></a>"
                    }
                ],

                "drawCallback": function (settings, json) {
                    $(".frozen1").bootstrapSwitch({
                        animate: false,
                        size: "mini",
                        state: false,
                        onSwitchChange: function (event, state) {
                            if (state == true) {
                                $(this).closest("tr").find('.help').html("F");
                            } else {
                                $(this).closest("tr").find('.help').html("T");
                            }
                        }
                    });

                    $(".frozen2").bootstrapSwitch({
                        animate: false,
                        size: "mini",
                        state: true,
                        onSwitchChange: function (event, state) {
                            if (state == true) {
                                $(this).closest("tr").find('.help').html("F");
                            } else {
                                $(this).closest("tr").find('.help').html("T");
                            }
                        }
                    });


                    /************************修改用户资料  ***************************/
                    $(".editInfo").on("click", function () {

                        accM.name = $(this).closest("tr").children("td:nth-child(2)").html();
                        accM.accID = $(this).closest("tr").attr("id");
                        accM.editpri = $(this).closest("tr").find("td:nth-child(4)").text();

                        window.parent.set_modal({
                            path: "./modal/accM/editInfoModal.html",
                            para: accM.accID,
                            loadFun: function () {
                                var pri = accM.editpri;
                                $("#my_modal #idUser", window.top.document).val(accM.name);
                                if (pri.indexOf("1") >= 0) {
                                    $("#my_modal #pria", window.top.document).val("1").prop("checked", true);
                                }
                                if (pri.indexOf("2") >= 0) {
                                    $("#my_modal #prib", window.top.document).val("1").prop("checked", true);
                                }
                                if (pri.indexOf("3") >= 0) {
                                    $("#my_modal #pric", window.top.document).val("1").prop("checked", true);
                                }
                                if (pri.indexOf("4") >= 0) {
                                    $("#my_modal #prid", window.top.document).val("1").prop("checked", true);
                                }
                                if (pri.indexOf("5") >= 0) {
                                    $("#my_modal #prie", window.top.document).val("1").prop("checked", true);
                                }
                                if (pri.indexOf("6") >= 0) {
                                    $("#my_modal #prif", window.top.document).val("1").prop("checked", true);
                                }
                            }
                        });
                    });


                    /***********************修改密码***************************/
                    $(".editPassword").on("click", function () {
                        var account = $(this).closest("tr").children("td:nth-child(3)").html();
                        accM.accID = $(this).closest("tr").attr("id");
                        accM.name = $(this).closest("tr").children("td:nth-child(2)").html();

                        window.parent.set_modal({
                            path: "./modal/accM/editPasswordModal.html",
                            para: accM.accID,
                            loadFun: function () {
                                $("#fusername", window.top.document).val(accM.name);
                                $("#faccount", window.top.document).val(account);
                            }
                        });
                    });


                    /************************  删除  ***************************/
                    $(".delete").on("click",function () {
                        if ($(this).closest("tr").find(".help").html() === "T") {    //启用状态下禁用删除功能
                            window.parent.set_modal({
                                path: "./modal/accM/frozenModal.html",
                                disappear: true
                            });
                        } else if ($(this).closest("tr").find(".help").html() === "F") {    //冻结状态下可删除
                            sArr = [];
                            (accM.sArr).push($(this).closest("tr").attr("id"));
                            accountData.deleteFuc(accM.sArr);
                        }
                    });
                }
            });
        }
    };

    //表格复选框（选择权限）
    $("input[type='checkbox']").on("click", function () {
        if ($(this).prop("checked")) {
            $(this).attr("value", "1");
        } else {
            $(this).attr("value", "0");
        }
    });


//****************表格数据加载(初始化) OK**********************/
    accM.accountTable = accountData.accountM_datatables();

    /*************** 自定义搜索框 ***************/
    table_operation.input_search((accM.accountTable), "#userInput", 2);
    table_operation.select_search((accM.accountTable), "#stateList", 'ALL', -2);
    //页面跳转
    table_operation.pageJump((accM.accountTable), "#previous", "#next", "#first", "#last", "#pageIndex");


    /*********点击选中高亮 **************/
    $('#accoutManageTable tbody').on('click', 'td:not(".editIcon"):not(".FrozenSTATE")', function () {
        var $tr = $(this).closest("tr");

        $tr.toggleClass('selected');
        accountData.selectCheckbox($tr);
    });


    /*************表格的最后一列操作**************/
    $('#accoutManageTable tbody').on('click', '.editInfo,.editPassword,.delete,.frozen', function () {
        var $tr = $(this).closest("tr");

        $(this).closest("tr").addClass('selected');
        accountData.selectCheckbox($tr);
    });


//点击按钮（添加用户）
    $("#addUser").click(function () {
        window.parent.set_modal({
            path: "./modal/accM/addUsersModal.html"
        });
    });


//点击按钮（冰冻）
    $("#frozenBtn").click(function () {  //冻结
        if ((accM.selectArr).length > 0) {
            accountData.frozenFun((accM.selectArr), 0, false);
        }
    });

//点击按钮（启用）
    $("#enableBtn").click(function () {
        if ((accM.selectArr).length > 0) {
            accountData.frozenFun((accM.selectArr), 1, true);
        }
    });


//点击按钮（删除）
    $("#deleteBtn").click(function () {
        if ((accM.selectArr).length > 0) {
            for (var i = 0; i < (accM.selectArr).length; i++) {
                var id = "#" + (accM.selectArr)[i];

                if ($(id).find(".help").html() === "T") {   //启用状态禁用删除
                    window.parent.set_modal({
                        path: "./modal/accM/frozenModal.html",
                        disappear: true
                    });
                    return false;

                } else if ($(id).find(".help").html() === "F") {   //冻结状态时可删除
                    //是否遍历到selectArr的最后一个元素，且之前的所有状态都为冻结
                    if (i == (accM.selectArr).length - 1) {
                        accountData.deleteFuc(accM.selectArr);
                    }

                }
            }

        }
    });


});


