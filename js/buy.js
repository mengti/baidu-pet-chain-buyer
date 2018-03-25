/*
 * @author t@tabalt.net
 */
$(function(){
    var autoRefreshTaskId = "";

    var pageNo = 1;

    // 购买窗口初使化
    Buyer.InitBuyModal();

    // 购买任务
    setInterval(function(){
        Buyer.TryBuyPets();
    }, 100);

    $("#refreshType").attr("disabled", "disabled").click(function() {
        if ("手动刷新" == $(this).html()) {
            // 切换为手动刷新
            $(this).html("自动刷新"); // 按钮文字显示为自动刷新
            $("#refresh").html("刷新购买").attr("disabled", false);

            Alert.Success("切换为手动刷新，自动刷新停止！！", 2);

            clearInterval(autoRefreshTaskId);

            pageNo = 1;
        } else {
            $(this).html("手动刷新");
            $("#refresh").html("刷新购买").attr("disabled", true);

            Alert.Success("开始自动刷新！！", 2);

            initAutoBuy();
        }
    });

    $("#refresh").attr("disabled", true).click(function() {
        $(this).html("刷新购买（" + pageNo + "页）");

        Buyer.ShowPetsOnSale(pageNo);

        pageNo ++;
    });

    $("tbody").on("click", "input[name='detailBtn']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        Center.getPetById({
            petId : pet.petId, 
            detailSelector : "#petDetail .modal-body", 
            callback : function() {
                $('#petDetail').modal('show');
            }
        });
    });

    $("tbody").on("click", "input[name='buy']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        var degree = Buyer.DegreeConf[pet.rareDegree] || {desc:'未知',buyAmount:'5.00'};

        var captcha = Configurator.consumeLogCaptcha();

        Buyer.displayBuyModal(degree, pet, captcha);
    });

    function initAutoBuy() {
        if (autoRefreshTaskId != '' && autoRefreshTaskId != null && autoRefreshTaskId != 'undefined') {
	    clearInterval(autoRefreshTaskId);
	}

	autoRefreshTaskId = setInterval(function(){
	    Buyer.ShowPetsOnSale(1);
	}, 2000);

	$("#refreshType").attr("disabled", false);
    }

    initAutoBuy();
});