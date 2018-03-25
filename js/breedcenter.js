/*
 * @author t@tabalt.net
 */
$(function(){
    BreedCenter.myBreedPetList(1);

    var autoRefreshTaskId = "";

    var pageNo = 1;

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

            initAutoTask();
        }
    });

    $("#refresh").attr("disabled", true).click(function() {
        $(this).html("刷新购买（" + pageNo + "页）");

        BreedCenter.breedCenterList(pageNo);

        pageNo ++;
    });

    $("#refreshMyBreedCenterList").click(function() {
        BreedCenter.myBreedPetList(1);

        Alert.Success("刷新成功！", 2);
    });

	$("#breedVerifyImage").click(function() {
		Captcha.gen("#breedVerifySeed", "#breedVerifyImage", "#breedVerifyCode", "#breedVerifyTime");
	}).on("mouseover", function() {
		$(this).css("cursor","pointer");
	}).on("mouseout", "tr", function() {
		$(this).css("cursor","defualt");
	});;

    $("tbody").on("click", "input[name='taPetDetailBtn']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        BreedCenter.choose(pet.petId, pet.amount, function() {
            Center.getPetById({
                petId : pet.petId, 
                detailSelector : "#taPetDetail", 
                petIdSelector : "#taPetId", 
                amountSelector : "#breedAmount",
                callback : function() {
                    getBreedExtInfo();

                    Captcha.gen("#breedVerifySeed", "#breedVerifyImage", "#breedVerifyCode", "#breedVerifyTime");
                }
            });
        });
    });

    $("tbody").on("click", "input[name='myPetDetailBtn']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        Center.getPetById({
            petId : pet.petId, 
            detailSelector : "#myPetDetail", 
            petIdSelector : "#myPetId",
            callback : function() {
                getBreedExtInfo();

                Captcha.gen("#breedVerifySeed", "#breedVerifyImage", "#breedVerifyCode", "#breedVerifyTime");
            }
        });
    });

    $("tbody").on("click", "input[name='choose']", function(e) {
        e.stopPropagation();
    });

    $("#breedBtn").click(function() {
        
        var taPetId = $("#taPetId").val();
        var myPetId = $("#myPetId").val();
        var amount = $("#breedAmount").html();
        var code = $("#breedVerifyCode").val();
        var seed = $("#breedVerifySeed").val();

        if (code != null && code != "" && code != "undefined" && code.length == 4) {
            BreedCenter.createBreed(taPetId, myPetId, amount, code, seed, function(){

            });
        } else {
            Alert.Error("请输入验证码，验证码必须包含4位字符！！", 2);
        }
        
    });

    function getBreedExtInfo() {
        var taPetId = $("#taPetId").val();
        var myPetId = $("#myPetId").val();
        var amount = $("#breedAmount").html();

        if (taPetId != null && taPetId != "" && taPetId != "undefined" && myPetId != null && myPetId != "" && myPetId != "undefined") {
            BreedCenter.getBreedExtInfo(taPetId, myPetId, amount, "#breedTime");
        }
    }

    function initAutoTask() {
        if (autoRefreshTaskId != '' && autoRefreshTaskId != null && autoRefreshTaskId != 'undefined') {
	        clearInterval(autoRefreshTaskId);
	    }

        autoRefreshTaskId = setInterval(function(){
            BreedCenter.breedCenterList(1);
        }, 2000);

	    $("#refreshType").attr("disabled", false);

		Captcha.gen("#breedVerifySeed", "#breedVerifyImage", "#breedVerifyCode", "#breedVerifyTime");
    }

    initAutoTask();
});