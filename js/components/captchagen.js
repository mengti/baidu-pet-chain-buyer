var Captcha = {
    ApiUrl: {
        CaptchaGen: 'https://pet-chain.baidu.com/data/captcha/gen'
    },

	gen: function(seedSelector, imgSelector, codeSelector, timeSelector) {
        var _display = function(seed, src, code, time) {
            $(seedSelector).val(seed);
            $(imgSelector).attr('src', src);
            $(codeSelector).val(code);
            $(timeSelector).val(time);
        }

        $.ajax({
            type: 'GET',
            url: Captcha.ApiUrl.CaptchaGen,
            contentType : 'application/json',
            data: {
                "requestId": new Date().getTime(),
                "appId":1,
                "tpl":""
            },
            success:function(res){
                var seed = res.data.seed;
                var src = 'data:image/jpeg;base64,'+res.data.img;
                var time = Configurator.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
                _display(seed, src, '', time);
            }
        });
    }
};