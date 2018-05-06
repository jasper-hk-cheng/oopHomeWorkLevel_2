
(function(root, initFunc){
    root.umlDrawUtils = initFunc(root.jQuery);

}(this, function($){
    var exports = {};

    exports.const = {};
    exports.const.UML_DRAW_TARGET = '#umlCanvas';
    exports.const.MIME_TYPE = 'text/xml';

    exports.drawWithFileName = function(umlLabel, fileName){

        // set the current uml label and file url in the header of the draw
        $('#umlLabel').text(umlLabel).data(globalConstUtils.DATA_PROP_FILE_NAME, fileName);

        exports.drawUmlWithPlantUml(fileName);
    }

    exports.drawUmlWithPlantUml = function(fileName){

        if(typeof(cordova) == 'undefined'){
            console.log('cordova object doesn\'t exists !!');
            return;
        }

        var param01 = {
            fileName : fileName
        }

        var paramArray = [];
        paramArray.push(param01);

        cordova.exec(function(result){
            /*
                draw success callback
            */
            var retMsg = result.retMsg;
            console.log(retMsg);

            var retCode = result.retCode;
            if(retCode == 'S01'){
                var retData = result.retData;
                var contentType = result.contentType;
                var src = 'data:' + contentType + ';base64,' + retData;

                $(exports.const.UML_DRAW_TARGET).prop('src', '').css('width', '').css('height', '').prop('src', src);

            }else if(retCode == 'E02'){

                var fileName = result.fileName;

                var retData = result.retData;
                var encodeUriComponentResult = encodeURIComponent(retData);
                var decodeUriComponentResult = decodeURIComponent(encodeUriComponentResult);

                var deflatedResult = deflate(decodeUriComponentResult, 9);

                exports.sendDeflatedContentText(deflatedResult, fileName)
            }
        }, function(result){
            /*
                draw error callback
            */
            console.log('plugin error occurring !!');
            console.log(result);

        }, 'umlDraw', 'drawTheUml', paramArray);
    }

    exports.sendDeflatedContentText = function(deflatedResult, fileName){

        if(!cordova){
            console.log('cordova object doesn\'t exists !!');
            return;
        }

        var param01 = {
            deflatedResult : deflatedResult,
            fileName : fileName
        };

        var paramArray = [];
        paramArray.push(param01);

        cordova.exec(function(result){

            var retCode = result.retCode;
            if(retCode == 'S01'){
                var retData = result.retData;
                var contentType = result.contentType;
                var src = 'data:' + contentType + ';base64,' + retData;

                //reset img
                $(exports.const.UML_DRAW_TARGET).prop('src', '').css('width', '').css('height', '').prop('src', src);
            }

        }, function(result){
            /*
                draw error callback
            */
            console.log('plugin error occurring !!');
            console.log(result);

        }, 'umlDraw', 'contentTextDeflated', paramArray);
    }

    return exports;
}));
