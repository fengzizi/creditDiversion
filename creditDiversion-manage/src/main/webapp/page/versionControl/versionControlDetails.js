var oldpassWord,accountRole,personalData,resultData;
layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'code', 'laydate','upload'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : parent.layer,upload = layui.upload,
        laypage = layui.laypage,
        $ = layui.jquery;

    var id = getQueryString("id");//id为0时代表新增

    var type = getQueryString("type");
    if (type === "select") {
        $("input").attr("readonly", "readonly");
        $("select").attr("disabled", "disabled");
        $("textarea").attr("readonly", "readonly");
        $(".update").show();
        $("#submit_div").hide();
        $("#test10").hide();
    } else {
        $("#createTime").parent().parent().hide();
        $("#submit_div").show();

    };
    $("#createTime").attr("readonly", "readonly");
    if(id!=0){
        //加载数据
        $.get("/manage/tversionControl/selectOne", {id: id}, function (result) {
            if (result.code == 1) {
                if((result.data!=null&&localStorage.getItem("loginName")!="admin"&&result.data.loginName!=localStorage.getItem("loginName"))||type === "select"){//普通管理员不能修改其他管理员
                    $("input").attr("readonly", "readonly");
                    $("select").attr("disabled", "disabled");
                    $("#submit_div").hide();
                }else{
                    $("#submit_div").show();
                }
                form.val("formTest", result.data);
                form.render();
                resultData=result;
            }
        });
    }

    //立即提交
    form.on("submit(submit)", function (data) {
        data.field.id = id;
        var index = layer.open({
            type: 3
        });
        delete data.field["createdAt"];
        delete data.field["updatedAt"];
        delete data.field["updatedBy"];
        delete data.field["createdBy"];
        submit(data,index);
        return false;
    });

    function submit(data,index){
        var url="/manage/tversionControl/update";
        if(data.field.id==0){
            url="/manage/tversionControl/add";
        }
        $.ajax({
            url:url,
            data: data.field,
            type:"POST",
            success: function (result) {
                layer.close(index);
                if (result.code == 1) {
                    layer.msg("修改成功！");
                    layer.closeAll("iframe");
                    parent.updateHtml(result.data);
                }
            },error:function(x,m,e ){
                layer.close(index);
                layer.msg("系统异常！", {icon: 5, shift: 6});
            }
        });
    }
});
