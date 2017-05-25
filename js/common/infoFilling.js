var infoFilling = {
  //商家注册****************
  BDRegister_apply_info: function (para, info) {    //商家申请注册（查看）
    ajax_request({
      url: BDREGISTER_APPLFILLING_URL,
      type: BDREGISTER_APPLFILLING_TYPE,
      data: {
        applynum: para
      },
      success_fun: function (data) {
        $("input[type='text']").val("");   //清空所有内容
        $("input[type='password']").val("");

        var userinfo = data.userinfo;
        var businfo = data.businfo;
        var blinfo = data.blinfo;
        var slinfo = data.slinfo;
        var strs = null;

        $("#Name").val(userinfo.name);
        $("#phoneInput").val(userinfo.phonenum);

        $("#store_name").val(businfo.busname);

        //商家座机
        strs = businfo.tel.split("-"); //字符分割
        $("#area_code").val(strs[0]);
        $("#store_tel").val(strs[1]);
        $("#ext").val(strs[2]);

        $("#address").val(businfo.address_details);

        $("#position").val(businfo.address_point);

        $("#buy_info").val(businfo.group_buying_info);    //团购信息


        //省市区
        $("#province").val(businfo.province_id);
        $("#city").empty();
        register.get_cities(businfo.province_id, function () {
          $("#city").val(businfo.city_id);
          $("#district").empty();

          register.get_districts(businfo.city_id, function () {
            $("#district").val(businfo.district_id);
            $("#circle").empty();

            register.get_circles(businfo.district_id, function () {
              $("#circle").val(businfo.city_near_id);
            });
          });
        });

        //商家分类数据导入
        $("#repast").val(businfo.lclass_id);
        $("#category").empty();
        register.get_mclass(businfo.lclass_id, function () {
          $("#category").val(businfo.mclass_id);
          $("#small_category").empty();

          register.get_sclass(businfo.mclass_id, function () {
            if (!!businfo.mclass_id) {
              $("#small_category").val(businfo.sclass_id);
            }
          });
        });


        $("#averageInput").val(businfo.cost_per_person);
        $("#averageMonth").val(businfo.sale_per_month);


        //营业执照
        if (!!blinfo.bl_image_url) {   //店内照片
          $("#blinInfoapp").css("display","");
          register.show_tmpimage(blinfo.bl_image_url, "#blin_image");
        }
        $("#licenceNameInput").val(blinfo.bl_name);
        $("#licenceApplyNumInput").val(blinfo.bl_account);
        $("#licenceAddInput").val(blinfo.bl_address);

        //执照有效期.如果选择长期有效，则不传值
        if (!!blinfo.bl_expire) {
          $("#TimeTo").prop("checked", true);
          $("#datepicker").val(blinfo.bl_expire);
        } else {
          $("#longtime").prop("checked", true);
        }

        //餐饮许可证
        if (!!slinfo.sl_image_url) {   //店内照片
          $("#slinInfoapp").css("display","");
          register.show_tmpimage(slinfo.sl_image_url, "#slin_image");
        }
        $("#catering_licenceNameInput").val(slinfo.sl_name);
        $("#catering_licenceApplyNumInput").val(slinfo.sl_code);
        $("#catering_licenceAddInput").val(slinfo.sl_address);
        $("#catering_datepicker").val(slinfo.sl_expire);

        showLocal(businfo.address_point);//确定地址坐标点
        //所有信息不可修改
        if (info === "disabled") {
          $("#registerFrom").find("input,select,textarea").not("input[type=file]").attr("disabled", true);
        } else {
          $("#mapOver").remove();
        }
      }
    });
  },

  BDregister_modify_info: function (para, info) {
    ajax_request({
      url: BDREGISTER_EDITFILLING_URL,
      type: BDREGISTER_EDITFILLING_TYPE,
      data: {
        applynum: para
      },
      success_fun: function (data) {
        var userinfo = data.userinfo;
        var businfo = data.businfo;
        var blinfo = data.blinfo;
        var slinfo = data.slinfo;
        var bankinfo = data.bankinfo;

        $("#shopName").html(businfo.busname);
        $("#registerBD").html(data.applyinfo.bd);  //商务经理
        if (data.applyinfo.reject_reason) {
          $("#verifyState").append("<h4 class='VReject'>已驳回" +'&emsp;'+
              "<span style='color: #000000'>理由：" + data.applyinfo.reject_reason + "</span></h4>");
        } else {
          $("#verifyState").append("<h4 class='VPass'>已通过</h4>");
        }

        //基本信息
        //商家信息
        $("#Name").val(userinfo.name);  //商家姓名
        $("#phoneInput").val(userinfo.phonenum);   //商家手机

        //门店信息
        $("#store_name").val(businfo.busname);     //店铺名称

        var strs = businfo.tel.split("-"); //商家座机
        $("#area_code").val(strs[0]);
        $("#store_tel").val(strs[1]);
        $("#ext").val(strs[2]);

        $("#address").val(businfo.address_details);    //详细地址
        $("#position").val(businfo.address_point);    //百度地图坐标


        //资质信息
        if (!!businfo.logo_url) {   //门店LOGO
          register.show_tmpimage(businfo.logo_url, "#LOGO_tmp");
        }
        if (!!businfo.brand_url) {   //门店招牌
          register.show_tmpimage(businfo.brand_url, "#signboard_tmp");
        }
        if (!!businfo.indoor_url) {   //店内照片
          register.show_tmpimage(businfo.indoor_url, "#shopInner_tmp");
        }

        //营业执照
        if (!($.isEmptyObject(blinfo)) && !!blinfo.bl_image_url) {   //店内照片
          register.show_tmpimage(blinfo.bl_image_url, "#blin_image");
        }
        $("#licenceNameInput").val(blinfo.bl_name);
        $("#licenceApplyNumInput").val(blinfo.bl_account);
        $("#licenceAddInput").val(blinfo.bl_address);

        //执照有效期.如果选择长期有效，则不传值
        if (!!blinfo.bl_expire) {
          $("#TimeTo").prop("checked", true);
          $("#datepicker").val(blinfo.bl_expire);
        } else {
          $("#longtime").prop("checked", true);
        }

        //餐饮许可证
        if (!($.isEmptyObject(slinfo)) && !!slinfo.sl_image_url) {   //店内照片
          register.show_tmpimage(slinfo.sl_image_url, "#slin_image");
        }
        $("#catering_licenceNameInput").val(slinfo.sl_name);
        $("#catering_licenceApplyNumInput").val(slinfo.sl_code);
        $("#catering_licenceAddInput").val(slinfo.sl_address);
        $("#catering_datepicker").val(slinfo.sl_expire);


        //省市区
        $("#province option[value='']").remove();
        $("#province").val(businfo.province_id);
        $("#city").empty();
        register.get_cities(businfo.province_id, function () {
          $("#city").val(businfo.city_id);
          $("#district").empty();

          register.get_districts(businfo.city_id, function () {
            $("#circle").empty();
            $("#district").val(businfo.district_id);

            register.get_circles(businfo.district_id, function () {
              $("#circle").val(businfo.city_near_id);
            });
          });
        });


        $("#repast option[value='']").remove();
        //餐饮分类

        $("#repast").val(businfo.lclass_id);
        $("#category").empty();

        register.get_mclass(businfo.lclass_id, function () {
          $("#category").val(businfo.mclass_id);
          $("#small_category").empty();

          register.get_sclass(businfo.mclass_id, function () {
            if (!!businfo.sclass_id) {
              $("#small_category").val(businfo.sclass_id);
            }
          });
        });

        //结款信息
        //银行账户
        if (bankinfo.bank_account) {   //有银行信息
          $("#hasBank").trigger("click");

          $("#bankAccountInput option[value='']").remove();
          $("#bankAccountInput").val(bankinfo.account_type);  //账户类型
          $("#AccountNameInput").val(bankinfo.person_or_company_name);       //开户名
          $("#bankTelInput").val(bankinfo.bank_account);       //银行卡号

          //银行数据导入
          $("#bankAccountInput option[value='']").remove();
          $("#accountBankSheng option[value='']").remove();
          //银行省

          $("#accountBankSheng").val(bankinfo.admiprovince_id);
          $("#accountBankShi").empty();

          register.get_bankCities(bankinfo.admiprovince_id, function () {
            $("#accountBankShi").val(bankinfo.admicity_id);
            $("#bankNameInput").empty();

            register.get_banks(function () {
              $("#bankNameInput").val(bankinfo.bank_id);
              $("#accountBankNameInput").empty();

              register.get_bankbranches(bankinfo.admicity_id, bankinfo.bank_id, function () {
                if (bankinfo.branch_id == "0") {    //银行支行
                  $("#bankEdit").prop("checked", true);
                  $("#accountBankNameInput").css("display", "none");
                  $("#accountBankNameHand").css("display", "");
                  $("#accountBankNameHand").val(bankinfo.custom_branch);
                } else {
                  $("#bankEdit").prop("checked", false);
                  $("#accountBankNameInput").css("display", "");
                  $("#accountBankNameHand").css("display", "none");
                  $("#accountBankNameInput").val(bankinfo.branch_id);
                }
              });
            });
          });

          $("#billing_account_name").val(bankinfo.billing_account_name);//财务联系人
          $("#billing_account_tel").val(bankinfo.billing_account_tel);//财务联系人号码

        } else {
          $("#noBank").trigger("click");
          //银行省初始化（选择有）
          $("#accountBankSheng").empty();
          $("#accountBankSheng").append('<option value="">请选择省</option>');
          register.initialize_bankProvinces();
        }

        if (userinfo.real_name) {//有身份信息
          $("#hasPerLicense").trigger("click");

          $("#realName").val(userinfo.real_name);
          $("#identificationNumInput").val(userinfo.card_code);

          $("#IDType option[value='']").remove();
          $("#IDType").val(userinfo.cert_type);

          if (userinfo.cert_type === "PASSPORT") {
            $(".exception").css("display", "");
            $(".normal").css("display", "none");
            $("#id_image_form").find(".img-upload").attr("src", "../../img/PNG/9.png");

            if (userinfo.card_front_url) {
              register.show_tmpimage(userinfo.card_front_url, "#ps_image_form");
            }
          } else {
            $(".normal").css("display", "");
            $(".exception").css("display", "none");

            if (userinfo.cert_type === "ID_CARD") {   //身份证
              $("#idfront_image_form").find(".img-upload").attr("src", "../../img/PNG/3.png");
              $("#idback_image_form").find(".img-upload").attr("src", "../../img/PNG/4.png");

            } else if (userinfo.cert_type === "TAIWAN_CARD") {  //台胞证
              $("#idfront_image_form").find(".img-upload").attr("src", "../../img/PNG/7.png");
              $("#idback_image_form").find(".img-upload").attr("src", "../../img/PNG/8.png");

            } else if (userinfo.cert_type === "HK_MACAO_CARD") {  //港澳通行证
              $("#idfront_image_form").find(".img-upload").attr("src", "../../img/PNG/5.png");
              $("#idback_image_form").find(".img-upload").attr("src", "../../img/PNG/6.png");
            }

            if (userinfo.card_front_url) {//证件照片前面
              register.show_tmpimage(userinfo.card_front_url, "#idfront_image_form");
              register.show_tmpimage(userinfo.card_back_url, "#idback_image_form");
            }
          }
        } else {
          $("#noPerLicense").trigger("click");
        }

        showLocal(businfo.address_point);//确定地址坐标点

        if (info === "disabled") {
          //所有信息不可修改
          $("#SverifyFrom").find("input,select,textarea").not("form input").attr("disabled", true);
        } else {
          $("#mapOver").remove();
        }
      }
    });
  },

  BDregister_branch_info: function (data) {

    var userinfo = data.userinfo;
    var businfo = data.businfo;
    var blinfo = data.blinfo;
    var slinfo = data.slinfo;

    $("#res_name").val(userinfo.name);
    $("#phoneInput").val(userinfo.phonenum);
    $("#store_name").val(businfo.busname);

    //商家座机
    var strs = []; //定义一数组
    strs = businfo.tel.split("-"); //字符分割
    $("#area_code").val(strs[0]);
    $("#store_tel").val(strs[1]);
    $("#ext").val(strs[2]);

    $("#address").val(businfo.address_details);
    $("#position").val(businfo.address_point);

    //省市区数据导入
    //省下拉列表初始化
    $("#province option[value='']").remove();

    $("#province").val(businfo.province_id);
    $("#city").empty();

    register.get_cities(businfo.province_id, function () {
      $("#city").val(businfo.city_id);
      $("#district").empty();

      register.get_districts(businfo.city_id, function () {
        $("#district").val(businfo.district_id);
        $("#circle").empty();

        register.get_circles(businfo.district_id, function () {
          $("#circle").val(businfo.city_near_id);
        });
      });
    });


    //商家分类数据导入
    $("#repast option[value='']").remove();
    $("#repast").val(businfo.lclass_id);
    $("#category").empty();

    register.get_mclass(businfo.lclass_id, function () {
      $("#category").val(businfo.mclass_id);
      $("#small_category").empty();

      register.get_sclass(businfo.mclass_id, function () {
        $("#small_category").val(businfo.sclass_id);
      });
    });


    //资质信息
    if (!($.isEmptyObject(blinfo)) && !!blinfo.bl_name) {
      if (!!businfo.logo_url) {   //门店LOGO
        register.show_tmpimage(businfo.logo_url, "#LOGO_tmp");
      }
      if (!!businfo.brand_url) {   //门店招牌
        register.show_tmpimage(businfo.brand_url, "#signboard_tmp");
      }
      if (!!businfo.indoor_url) {   //店内照片
        register.show_tmpimage(businfo.indoor_url, "#shopInner_tmp");
      }

      //营业执照
      if (!!blinfo.bl_image_url) {   //店内照片
        register.show_tmpimage(blinfo.bl_image_url, "#blin_image");
      }
      $("#licenceNameInput").val(blinfo.bl_name);
      $("#licenceApplyNumInput").val(blinfo.bl_account);
      $("#licenceAddInput").val(blinfo.bl_address);

      //执照有效期.如果选择长期有效，则不传值
      if (!!blinfo.bl_expire) {
        $("#TimeTo").prop("checked", true);
        $("#datepicker").val(blinfo.bl_expire);
      } else {
        $("#longtime").prop("checked", true);
      }
    }

    //餐饮许可证
    if (!($.isEmptyObject(slinfo)) && !!slinfo.sl_name) {
      if (!!slinfo.sl_image_url) {   //店内照片
        register.show_tmpimage(slinfo.sl_image_url, "#slin_image");
      }
      $("#catering_licenceNameInput").val(slinfo.sl_name);
      $("#catering_licenceApplyNumInput").val(slinfo.sl_code);
      $("#catering_licenceAddInput").val(slinfo.sl_address);
      $("#catering_datepicker").val(slinfo.sl_expire);
    }

    return businfo.address_point;
  },

//商家审核信息修改填充
  busVerifyedit_info: function (item_id) {   //商家审核信息修改
    ajax_request({
      url: BDVERIFY_FILLING_URL,
      type: BDVERIFY_FILLING_TYPE,
      data: {
        item_id: item_id
      },
      success_fun: function (data) {
        var res = data.data;
        var resOld = data.old_data;
        var userinfo = data.userinfo;

        $("#busNameTop").html(userinfo.account);

        if(data.iteminfo.reject_reason){
          $("#verifyState").append("<h4 class='VReject'>已驳回" +'&emsp;'+
              "<span style='color: #000000'>理由："+data.iteminfo.reject_reason+"</span></h4>");
        }else {
          $("#verifyState").append("<h4 class='VPass'>已通过</h4>");
        }

        //合作信息
        $("#shopName").html(userinfo.name)
        $("#res_name").val(userinfo.name);     //门店名称
        $("#res_phone").val(userinfo.phonenum);     //门店名称

        //门店信息*****************
        $(".store_name").val(res.name);     //门店名称
        common.dataCompare(resOld.name, res.name, $("#old_store_name"));

        $("#address").val(res.address);    //详细地址

        common.dataCompare(resOld.address, res.address, $("#old_address"));

        showLocal(res.address_point);

        $(".province").val(res.province_name);//省市区数据导入
        $(".city").val(res.city_name);
        $(".district").val(res.district_name);
        $(".circle").val(res.circle_name);

        //门店座机
        for (var j = 0; j < 5; j++) {
          var telNum = "tel_" + (j + 1);
          var telType = telNum + "_type";

          if (!res[telNum]) {   //电话为空
            break;
          } else {
            if (j > 0) {   //电话有多条
              $(".shopInfo").find(".telMore").css("display", "");   //更多

              if (res[telType] === "TP") {
                var telstrs = res[telNum].split("-");

                $(".shopInfo").find(".telTP").eq(0).clone(true).appendTo(".telModule").css("display", "");

                $(".telModule").find(".area_code").last().val(telstrs[0]);
                $(".telModule").find(".store_tel").last().val(telstrs[1]);
                $(".telModule").find(".ext").last().val(telstrs[2]);

                common.dataCompare(resOld[telNum], res[telNum], $(".old_tphone").last());
              } else {
                $(".shopInfo").find(".telMp").eq(0).clone(true).appendTo(".telModule").css("display", "");
                $(".telModule").find(".mphone").last().val(res[telNum]);
                common.dataCompare(resOld[telNum], res[telNum], $(".old_mphone").last());
              }
            } else {
              common.dataCompare(resOld[telNum], res[telNum], $("#old_phone"));
              if (res[telType] === "TP") {
                var telstrs = res[telNum].split("-");
                $(".shopInfo").find(".mainTP").css("display", "");
                $(".shopInfo").find(".mainMP").css("display", "none");

                $(".shopInfo").find(".area_code").eq(j).val(telstrs[0]);
                $(".shopInfo").find(".store_tel").eq(j).val(telstrs[1]);
                $(".shopInfo").find(".ext").eq(j).val(telstrs[2]);
              } else {
                $(".shopInfo").find(".mainMP").css("display", "");
                $(".shopInfo").find(".mainTP").css("display", "none");
                $(".shopInfo").find(".mphone").eq(j).val(res[telNum]);
              }
            }
          }
        }

        //$("#repast").html("美食");   //默认
        $("#category").val(res.category_parent_name);   //一级分类
        if (!!res.category_name) {
          $("#small_category").val(res.category_name);   //二级分类
        }

        if (resOld.category_parent_name == res.category_parent_name && resOld.category_name == res.category_name) {
          $("#old_category").parent().css("display", "none");
        } else {
          $("#old_category").parent().css("display", "");
          if (!resOld.category_name) {
            $("#old_category").html("美食>" + resOld.category_parent_name + ">" + resOld.category_name);
          } else {
            $("#old_category").html("美食>" + resOld.category_parent_name);
          }

        }

        //营业时间
        var opening = res.open_hours;
        var oldopening = resOld.open_hours;
        var num = ["一", "二", "三", "四", "五"];

        //原始数据的显示
        var time = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

        if (opening.length === oldopening.length && (opening[0].week).toString() == (oldopening[0].week).toString()) {
          $("table.dataTips").css("display", "none");

        } else {
          if (oldopening.length == 0) {   //原始数据为空时不显示
            $("table.dataTips").css("display", "none");
          }

          for (var i = 0; i < oldopening.length; i++) {
            var str = "";
            var oldweeks = oldopening[i].week.split("");
            var oldday = [];
            for (var k = 0; k < oldweeks.length; k++) {
              if (oldweeks[k] == "1") {
                oldday.push(k);
              }
            }

            if (i > 0) {
              $(".addOpening").eq(0).clone(true).appendTo("table.dataTips tbody");
              $(".addOpening").last().find("td").html("");
            }

            $.each(oldday, function (index, element) {
              str += time[element] + "、";
              $(".addOpening").eq(i).find("td:nth-child(2)").html(str);
            });

            $(".addOpening").eq(i).find("td:nth-child(3)").html(oldopening[i].begin + "~" + oldopening[i].end);
          }
        }


        //最新数据的显示
        for (var a = 0; a < opening.length; a++) {
          var weeks = opening[a].week.split("");
          var day = [];

          for (var z = 0; z < weeks.length; z++) {
            if (weeks[z] == "1") {
              day.push(z + 1);
            }
          }

          if (a > 0) {
            $(".openTimeShow").eq(0).clone(true).appendTo("#OpeningHours");
            $(".openTimeShow").last().find(".weekTitle").html(num[a]);
            $(".openweek").eq(a).find("input:checkbox").prop("checked", false);
          } else {
            if (day.length == 7) {
              $(".openweek").eq(0).find("input[value='0']").prop("checked", true);
            } else {
              $(".openweek").eq(0).find("input[value='0']").prop("checked", false);
            }
          }

          $.each(day, function (index, element) {
            $(".openweek").eq(a).find("input[value='" + element + "']").prop("checked", true);
          });


          if (opening[a].begin == "00:00:00" && opening[a].end == "23:59:59") {
            $(".openTimeShow").eq(a).find("input[value='24h']").prop("checked", true);
          } else {
            $(".openTimeShow").eq(a).find("input[value='24h']").prop("checked", false);
          }
          $(".timeFrom").eq(a).val(opening[a].begin);
          $(".timeTo").eq(a).val(opening[a].end);
        }


        //营业状态
        var state = {
          RO: "营业中",
          RC: "已关闭",
          RE: "筹备中",
          RP: "暂停营业"
        };

        $("#openingStateList").val(state[res.running_status]);
        common.dataCompare(state[resOld.running_status], state[res.running_status], $("#old_openingState"));

        $("#averageInput").val(res.capita_consumption);
        common.dataCompare(resOld.capita_consumption, res.capita_consumption, $("#old_numDots"));

        //所有信息不可修改
        $("#shopListFrom").find("input,select,textarea").attr("disabled", true);
      }
    });
  },

//项目审核信息填充
  projectVerify_info: function (item_id) {
    var dateFestivals = checkVerify.dateFestivals;

    ajax_request({
      url: PROVERIFY_FILLING_URL,
      type: PROVERIFY_FILLING_TYPE,
      data: {
        item_id: item_id
      },
      success_fun: function (result) {
        var res = result.data;
        var rules = result.data.rules;
        var pictures = result.data.photos;   //照片
        checkVerify.shopsInfo = res.shops;

        //结算时间
        $("#rate").val(res.commission);
        $("#takeTime").val(res.manual_billing_cycle);
        $("#LossCutTime").val(res.auto_billing_cycle);

        //门店信息*****************
        for (var i = 0; i < res.shops.length; i++) {
          var tel = "";
          var shop = res.shops[i];

          for (var j = 0; j < 5; j++) {
            var telNum = "tel_" + (j + 1);

            if (!shop[telNum]) {   //电话为空
              break;
            } else {
              tel += "<div>" + shop[telNum] + "</div>";
            }
          }

          if (i <= 5) {
            $("<tr><td>" + shop.name + "</td><td><img width='80px' height='80px' src="
                + shop.logo + "></td><td>" + shop.address + "</td><td>" + tel + "</td></tr>")
                .appendTo("#projectDetailTable tbody");
          } else {
            $("#more").css("display", "");
          }
        }

        //项目信息*********************
        //商家分类数据导入
        //$("#repast").html("美食");   //默认
        $("#category").val(res.category_parent_name);   //一级分类
        if (!!res.category_name) {
          $("#small_category").val(res.category_name);   //二级分类
        } else {
          $("#small_categoryDiv").css("display", "none");
        }


        // 图片
        for (var k = 0; k < pictures.length; k++) {
          $(".pp").eq(0).clone(true).appendTo("#projectPic").css("display", "");
          $(".pp").last().find("img").attr("src", pictures[k])
        }

        $("#PNameInput").val(res.name);   //项目名称
        $("#peopleInput").val(res.recommend_use_people_number);   //用餐人数

        $("#originalPriceInput").val(res.total + "元");   //原价
        $("#preferentialPriceInput").val(res.price + "元"); //优惠价
        $("#settlementPriceInput").val(res.jm_price + "元");   //结算价

        //菜单组合
        for (var a = 0; a < res.foods.length; a++) {
          var items = res.foods[a].items;

          var con = "<tr class='mainOrder'><td><span class='food'>" + res.foods[a].name
              + "</span><span class='fillIn'>" + res.foods[a].choose + "</span>";
          if (res.foods[a].choose !== "全部可用" && res.foods[a].can_repeat) {
            con += "<span class='can_repeat'>&nbsp;(可重复选)</span></td></tr>";
          }

          con += "<tr class='orderItems'><td>";

          for (var b = 0; b < items.length; b++) {   //具体点餐详情
            con += "<div class='addRow'><span class='col-xs-6 name'>" + items[b].name +
                "</span><span class='col-xs-5 price'>" + "￥ " + items[b].price + "/" + items[b].unit_name +
                "</span><span class='col-xs-1 count'>" + items[b].count + "</span></div>";
          }
          con += "</td></tr>";
          $("#orderContent").append(con);
        }

        //购买须知*************
        //项目有效期
        if (rules.expire_date.index == "0") {
          $("#expire_date0_info").val(rules.expire_date.info_0.number);
          $("#expire_date0").prop("checked", true);
        } else if (rules.expire_date.index == "1") {
          $("#expire_date1_info").val(rules.expire_date.info_1.number);
          $("#expire_date1").prop("checked", true);
        } else {
          $("#expire_date2_info").val(rules.expire_date.info_2.end_date);
          $("#expire_date2").prop("checked", true);
        }


        //所有日期都可用
        if (rules.exclude_use_date.index == "0") {
          $("#exclude_use_date0").prop("checked", true);
        } else {//不可用日期
          var week = rules.exclude_use_date.info_1.week.split("");
          var dates = rules.exclude_use_date.info_1.dates;

          $("#exclude_use_date1").prop("checked", true);
          $("#exclude_use_date_info").css("display", "");

          for (var c = 0; c < week.length; c++) {
            if (week[c] == "1") {
              $("#week").find("input[value='" + c + "']").prop("checked", true);
            } else {
              $("#week").find("input[value='" + c + "']").prop("checked", false);
            }
          }

          for (var d = 0; d < dates.length; d++) {
            if (d > 0) {
              $(".disabledDate").eq(0).clone(true).appendTo("#useDate");
            }

            $(".disabledDate").eq(d).find("input").eq(0).val(rules.exclude_use_date.info_1.dates[d].begin);
            $(".disabledDate").eq(d).find("input").eq(1).val(rules.exclude_use_date.info_1.dates[d].end);

            $.each(dateFestivals, function (index, value) {
              if (rules.exclude_use_date.info_1.dates[d].begin == value.begin_date_ex &&
                  rules.exclude_use_date.info_1.dates[d].end == value.end_date_ex) {
                $(".disabledDate").eq(d).find(".festival").html("(" + value.name + ")");
              }
            });
          }
        }


        //是否支持自动延长团购券有效期
        if (rules.expire_date_auto_extend.index == "0") {
          $("#expire_date_auto_extend0").prop("checked", true);
        } else {
          $("#expire_date_auto_extend1").prop("checked", true);
        }

        //消费时间
        //使用时间
        if (rules.use_time.index == "0") {
          $("#use_time0").prop("checked", true);
        } else {
          $("#use_time1").prop("checked", true);
          $("#use_time_info").css("display", "");

          for (var x = 0; x < rules.use_time.info_1.dates.length; x++) {
            if (x > 0) {
              $(".useTime").eq(0).clone(true).appendTo("#useTime");
            }

            $(".useTime").eq(x).find("input").eq(0).val(rules.use_time.info_1.dates[x].begin_hour);
            $(".useTime").eq(x).find("input").eq(1).val(rules.use_time.info_1.dates[x].begin_minute);
            $(".useTime").eq(x).find("input").eq(2).val(rules.use_time.info_1.dates[x].end_hour);
            $(".useTime").eq(x).find("input").eq(3).val(rules.use_time.info_1.dates[x].end_minute);
          }

          $("#note").val(rules.use_time.info_1.note);
        }

        //是否预约
        if (rules.reservation.index == "0") {
          $("#reservation0").prop("checked", true);
        } else if (rules.reservation.index == "1") {
          $("#reservation1").prop("checked", true);
          $("#reservation1_info").val(rules.reservation.info_1.day);
        } else {
          $("#reservation2").prop("checked", true);
          $("#reservation2_info").val(rules.reservation.info_2.hour);
        }

        //推荐用餐时段
        for (var y = 0; y < rules.recommend_use_date.indexs.length; y++) {
          $("#recommend_use_date").find("input[value='" + rules.recommend_use_date.indexs[y] + "']").prop("checked", true);
        }

        //团购约定
        //是否限购团购券
        if (rules.buy_limit_number.index == "0") {
          $("#buy_limit_number0").prop("checked", true);
        } else {
          $("#buy_limit_number1_info").val(rules.buy_limit_number.info_1.number);
          $("#buy_limit_number1").prop("checked", true);
        }

        //是否限用团购券
        if (rules.use_limit.index == "0") {
          $("#use_limit0").prop("checked", true);
        } else if (rules.use_limit.index == "1") {
          $("#use_limit1_info").val(rules.use_limit.info_1.number);
          $("#use_limit1").prop("checked", true);
        } else {
          $("#use_limit2_info").val(rules.use_limit.info_2.number);
          $("#use_limit2").prop("checked", true);
        }

        //是否限制使用人数
        if (rules.use_limit_people_number.index == "0") {
          $("#use_limit_people_number0").prop("checked", true);
        } else if (rules.use_limit_people_number.index == "1") {
          $("#use_limit_people_number1_info0").val(rules.use_limit_people_number.info_1.people);
          $("#use_limit_people_number1_info1").val(rules.use_limit_people_number.info_1.height);
          $("#use_limit_people_number1").prop("checked", true);
        } else {
          $("#use_limit_people_number2_info").val(rules.use_limit_people_number.info_2.people);
          $("#use_limit_people_number2").prop("checked", true);
        }

        //品类特有限定*************
        //打包信息
        if (rules.packing_info.index == "0") {
          $("#packing_info0").prop("checked", true);
        } else if (rules.packing_info.index == "1") {
          $("#packing_info1_info").val(rules.packing_info.info_1.price);
          $("#packing_info1").prop("checked", true);
        } else if (rules.packing_info.index == "2") {
          $("#packing_info2_info").val(rules.packing_info.info_2.price);
          $("#packing_info2").prop("checked", true);
        } else if (rules.packing_info.index == "3") {
          $("#packing_info3_info").val(rules.packing_info.info_3.price);
          $("#packing_info3").prop("checked", true);
        } else {
          $("#packing_info4").prop("checked", true);
        }

        //堂食外带约定
        if (rules.packing_limit.index == "0") {
          $("#packing_limit0").prop("checked", true);
        } else {
          $("#packing_limit1").prop("checked", true);
        }

        //餐巾纸
        if (rules.serviette_info.index == "0") {
          $("#serviette_info0").prop("checked", true);
        } else if (rules.serviette_info.index == "1") {
          $("#serviette_info1").prop("checked", true);
        } else {
          $("#serviette_info2").prop("checked", true);
          $("#serviette_info2_info").val(rules.serviette_info.info_2.price);
        }

        //其它补充条款
        $("#other_info_info").val(rules.other_info.info.info);

        //所有信息不可修改
        $("#registerFrom").find("input,select,textarea").attr("disabled", true);
      }
    });
  },

//结款审核信息填充
  settleVbusbank_info: function (item_id) {    //银行账户修改（查看）
    ajax_request({
      url: CHECKVERIFY_FILLING_URL,
      type: CHECKVERIFY_FILLING_TYPE,
      data: {
        item_id: item_id
      },
      success_fun: function (data) {
        var dd = data.bankinfo;
        var names = data.items_name;
        $("#bus_account").html(data.account);   //商家账号

        $("#item_names1").html(names[0]);
        for (var i = 1; i < names.length; i++) {
          $("#projectName").append("<span class='form-control' style='margin-top:15px'>" +
              names[i] + "</span>");
        }

        $("#contactMan").html(dd.billing_account_name);   //财务联系人
        $("#contactPhone").html(dd.billing_account_tel);   //财务联系人电话
        $("#financeType").html(dd.bank_account_type);   //财务类型
        $("#financeName").html(dd.bank_account_name);   //开户名称

        $("#bankAccount").html(dd.bank_account_number);  //银行账号

        $("#bankCity").html(dd.province_name + dd.city_name);   //开户银行城市
        $("#accountBank").html(dd.bank_name);    //开户银行
        $("#bankName").html(dd.bank_branch_name);   //开户行名称

        //身份证
        if(dd.real_name){
          $("#IDInformation").css("display", "");

          $("#idType").val(dd.cert_type);
          $("#idName").html(dd.real_name);
          $("#idNumber").html(dd.card_code);
          if (dd.cert_type == "PASSPORT") {
            $("#IDFirst").css("display", "none");
            $("#IDSecond").css("display", "");
            $("#IDAll").attr("src", dd.card_front);
          } else {
            $("#IDFront").attr("src", dd.card_front);
            $("#IDBack").attr("src", dd.card_back);
          }
        }
        $("#idType").attr("disabled", true);
      }
    });
  }
};

//商家列表*******************************
var busListInfo = {
  shop_id: null,

  basicInfo: function (bus_id) {    //基本信息
    ajax_request({
      url: BUSLIST_BASIC_URL,
      type: BUSLIST_BASIC_TYPE,
      data: {
        bus_id: bus_id
      },
      success_fun: function (data) {
        var userinfo = data.userinfo;
        var businfo = data.businfo;
        var opening = data.busopenhour;

        //商家负责人信息
        $("#res_name").val(userinfo.name);     //商家姓名
        $("#res_phone").val(userinfo.phonenum);     //商家手机

        //门店信息
        $("#store_name").val(businfo.busname);     //门店名称

        //门店座机
        var strs = businfo.tel.split("-");
        $("#area_code").val(strs[0]);
        $("#store_tel").val(strs[1]);
        $("#ext").val(strs[2]);

        $("#address").val(businfo.address_details);    //详细地址
        $("#position").val(businfo.address_point);    //百度地图坐标

        showLocal(businfo.address_point);//确定地址坐标点

        //门店图片
        $("#LOGO_tmp").find("img").attr("src", businfo.logo_url);
        $("#LOGO_tmp").find("img").attr("data-path", businfo.logo_url);
        $("#signboard_tmp").find("img").attr("src", businfo.brand_url);
        $("#signboard_tmp").find("img").attr("data-path", businfo.brand_url);
        $("#shopInner_tmp").find("img").attr("src", businfo.indoor_url);
        $("#shopInner_tmp").find("img").attr("data-path", businfo.indoor_url);

        //营业状态
        $("#openingStateList").val(businfo.status);

        //营业时间
        if (opening.length == 0) {
          $("#openingTime").css("display", "none");
        } else {
          for (var j = 0; j < opening.length; j++) {
            var day2 = opening[j].days.split("");

            if (j > 0) {
              $(".openTimeShow").eq(0).clone(true).appendTo("#OpeningHours");
              $(".openweek").eq(j).find("input:checkbox").prop("checked", false);
            }

            if (opening[j].days.length == 7) {
              $(".openweek").eq(j).find("input[value='0']").prop("checked", true);
            } else {
              $(".openweek").eq(j).find("input[value='0']").prop("checked", false);

              $.each(day2, function (index, element) {
                $(".openweek").eq(j).find("input[value='" + element + "']").prop("checked", true);
              });
            }

            if (opening[j].begin) {
              $(".openTimeShow").eq(j).find("input[value='24h']").prop("checked", false);
              $(".timeFrom").eq(j).empty().append("<option>" + opening[j].begin + "</option>");
              $(".timeTo").eq(j).empty().append("<option>" + opening[j].end + "</option>");
            } else {
              $(".openTimeShow").eq(j).find("input[value='24h']").prop("checked", true);
              $(".timeFrom").eq(j).empty();
              $(".timeTo").eq(j).empty();
            }
          }
        }


        //省市区数据导入
        $("#province option[value='']").remove();
        register.initialize_provinces(function () {
          $("#province").val(businfo.province_id);
          $("#city").empty();

          register.get_cities(businfo.province_id, function () {
            $("#city").val(businfo.city_id);
            $("#district").empty();

            register.get_districts(businfo.city_id, function () {
              $("#circle").empty();
              $("#district").val(businfo.district_id);

              register.get_circles(businfo.district_id, function () {
                $("#circle").val(businfo.city_near_id);
              });
            });
          });
        });


        //商家分类数据导入
        $("#repast option[value='']").remove();
        register.initialize_lclass(function () {
          $("#repast").val(businfo.lclass_id);
          $("#category").empty();

          register.get_mclass(businfo.lclass_id, function () {
            $("#category").val(businfo.mclass_id);
            $("#small_category").empty();

            register.get_sclass(businfo.mclass_id, function () {
              if (!!businfo.sclass_id) {
                $("#small_category").val(businfo.sclass_id);
              }
            });
          });
        });

        //所有信息不可修改
        $("#basicInfo").find("input,select,textarea").attr("disabled", true);
      }
    });
  },

  IDInfo: function (account) {   //身份证
    ajax_request({
      url: BUSLIST_ID_URL,
      type: BUSLIST_ID_TYPE,
      data: {
        account: account
      },
      success_fun: function (data) {
        var id = data;

        if (id.card_code) {//身份信息
          $("#hasPerLicense").trigger("click");

          $("#IDType").val(id.cert_type);
          $("#realName").val(id.real_name);
          $("#identificationNumInput").val(id.card_code);

          if (id.cert_type === "PASSPORT") {
            $("#id_label").html("上传清晰护照照片");
            $("#id_num").html("护照号码");

            $(".exception").css("display", "");
            $(".normal").css("display", "none");

            register.show_tmpimage(id.card_front_url, "#ps_image_form");

          } else {
            $(".normal").css("display", "");
            $(".exception").css("display", "none");

            if (id.cert_type === "ID_CARD") {   //身份证
              $("#id_label").html("上传清晰身份证照片");
              $("#id_num").html("身份证号码");
            } else if (id.cert_type === "TAIWAN_CARD") {  //台胞证
              $("#id_label").html("上传清晰台湾居民来往大陆通行证照片");
              $("#id_num").html("通行证号码");
            } else if (id.cert_type === "HK_MACAO_CARD") {  //港澳通行证
              $("#id_label").html("上传清晰港澳居民来往通行证照片");
              $("#id_num").html("通行证号码");
            }

            //证件照片前面
            register.show_tmpimage(id.card_front_url, "#idfront_image_form");
            //背面
            register.show_tmpimage(id.card_back_url, "#idback_image_form");
          }
        } else {   //没有身份信息
          $("#noPerLicense").trigger("click");
        }

        //所有信息不可修改(结款信息，身份信息)
        $("input[name='LicenseJustify']").attr("disabled",true);
        $("#identityInfo").find("input,select").not("form input").attr("disabled", true);
      }
    });
  },

  blicInfo: function (bus_id) {   //营业执照
    ajax_request({
      url: BUSLIST_BLIC_URL,
      type: BUSLIST_BLIC_TYPE,
      data: {
        bus_id: bus_id
      },
      success_fun: function (data) {
        var blinfo = data;

        $("#blin_image").find("img").attr("src", blinfo.bl_image_url);
        $("#blin_image").find("img").attr("data-path", blinfo.bl_image_url);

        $("#licenceNameInput").val(blinfo.bl_name);   //执照名称
        $("#licenceApplyNumInput").val(blinfo.bl_account);   //执照注册号
        $("#licenceAddInput").val(blinfo.bl_address);   //执照注册地址

        //执照有效期.如果选择长期有效，则不传值
        if (!!blinfo.bl_expire) {
          $("#TimeTo").prop("checked", true);
          $("#datepicker").val(blinfo.bl_expire);
        } else {
          $("#longtime").prop("checked", true);
        }

        //所有信息不可修改
        $("#blicInfo").find("input,select,textarea").attr("disabled", true);
      }
    });
  },

  slicInfo: function (bus_id) {   //餐饮许可证
    ajax_request({
      url: BUSLIST_SLIC_URL,
      type: BUSLIST_SLIC_TYPE,
      data: {
        bus_id: bus_id
      },
      success_fun: function (data) {
        var slinfo = data;

        $("#slin_image").find("img").attr("src", slinfo.sl_image_url);
        $("#slin_image").find("img").attr("data-path", slinfo.sl_image_url);

        $("#catering_licenceNameInput").val(slinfo.sl_name);   //执照名称
        $("#catering_licenceApplyNumInput").val(slinfo.sl_code);   //执照注册号
        $("#catering_licenceAddInput").val(slinfo.sl_address);   //执照注册地址
        $("#catering_datepicker").val(slinfo.sl_expire);

        //所有信息不可修改
        $("#slicInfo").find("input,select,textarea").attr("disabled", true);
      }
    });
  },

  settleInfo: function (account) {  //结算信息
    ajax_request({
      url: BUSLIST_SETTLER_URL,
      type: BUSLIST_SETTLER_TYPE,
      data: {
        account: account
      },
      success_fun: function (data) {
        var bankinfo = data;

        if (bankinfo.bank_account) {
          $("#hasBank").trigger("click");
          //银行账户
          $("#bankAccountInput").val(bankinfo.account_type);

          $("#AccountNameInput").val(bankinfo.person_or_company_name);       //开户名
          $("#bankTelInput").val(bankinfo.bank_account);       //银行卡号

          //银行省市区
          //银行省
          $("#accountBankSheng option[value='']").remove();

          register.initialize_bankProvinces(function () {
            $("#accountBankSheng").val(bankinfo.admiprovince_id);
            $("#accountBankShi").empty();
            register.get_bankCities(bankinfo.admiprovince_id, function () {
              $("#accountBankShi").val(bankinfo.admicity_id);
              $("#bankNameInput").empty();
              register.get_banks(function () {
                $("#accountBankNameInput").empty();
                $("#bankNameInput").val(bankinfo.bank_id);
                register.get_bankbranches(bankinfo.admicity_id, bankinfo.bank_id, function () {
                  if (bankinfo.branch_id == "0") {    //银行支行
                    $("#bankEdit").prop("checked", true);
                    $("#accountBankNameInput").css("display", "none");
                    $("#accountBankNameHand").css("display", "");
                    $("#accountBankNameHand").val(bankinfo.custom_branch);
                  } else {
                    $("#bankEdit").prop("checked", false);
                    $("#accountBankNameInput").css("display", "");
                    $("#accountBankNameHand").css("display", "none");
                    $("#accountBankNameInput").val(bankinfo.branch_id);
                  }
                });
              });
            });
          });

          $("#billing_account_name").val(bankinfo.billing_account_name);//财务联系人
          $("#billing_account_tel").val(bankinfo.billing_account_tel);//财务联系人号码
        } else {
          $("#noBank").trigger("click");
        }
        //所有信息不可修改(结款信息，身份信息)
        $("input[name='bankdiv']").attr("disabled",true);
        $("#bankDetailsDiv").find("input,select").attr("disabled", true);
      }
    });
  },

  constraInfo: function (account) {
    ajax_request({
      url: BUSLIST_CONSTRA_URL,
      type: BUSLIST_CONSTRA_TYPE,
      data: {
        account: account
      },
      success_fun: function (data) {
        if (!!data) {
          $("#constractDate").val(data.date);
          $("#contractTitle").val(data.name);

          for (var i = 1; i < 4; i++) {
            var tmp = "image" + i + "_url";
            var info = data[tmp] + "";
            if (!!data[tmp]) {
              $("#constemp").css("display", "");
              $("<div class='img_wrap'><img src='" + data[tmp] + "' class='tmp_img' data-path=" +
                  info + "/><span class='fa fa-times-circle delete' onclick='delete_tmp(event);'>" +
                  "</span></div>").appendTo("#constemp");
            }
          }
        }
      }
    });
  },

  branchList: function (bususer_id, account) {   //商家列表信息
    ajax_request({
      url: BUSLIST_BRANCH_URL,
      type: BUSLIST_BRANCH_TYPE,
      data: {
        bususer_id: bususer_id
      },
      async: false,
      success_fun: function (data) {
        var bra = data;
        $("#shopBranches").empty();

        for (var i = 0; i < bra.length; i++) {
          $("#shopBranches").append("<option value='" + bra[i].bus_id + "'>" + bra[i].busname + "</option>");
        }

        busListInfo.shop_id = $("#shopBranches").find("option:selected").val();
        busListInfo.basicInfo(busListInfo.shop_id);   //基本信息
        busListInfo.blicInfo(busListInfo.shop_id);  // 营业执照信息
        busListInfo.slicInfo(busListInfo.shop_id);  // 餐饮许可信息
        busListInfo.settleInfo(account);  // 结款信息
        busListInfo.IDInfo(account);  // 身份信息
        busListInfo.constraInfo(account);  //商家合约
      }
    });
  }
};
