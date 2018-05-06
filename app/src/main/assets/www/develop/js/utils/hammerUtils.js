
(function(root, initFunc){
    root.hammerUtils = initFunc(root.jQuery);

    root.hammerUtils.bindUmlCanvasGesture();

}(this, function($){
    var exports = {};

    exports.permanentObj = {};
    exports.permanentObj.umlCanvasHammerManager = undefined;

    exports.bindUmlCanvasGesture = function(){
        exports.permanentObj.umlCanvasHammerManager = new Hammer.Manager($('#umlCanvas')[0], {});

        /*
            pinch
        */
        var pinchObj = new Hammer.Pinch({
           event : 'pinch',
           pointers : 2,
           threshold : 0
        });
        exports.permanentObj.umlCanvasHammerManager.add(pinchObj);
        exports.permanentObj.umlCanvasHammerManager.on('pinchin pinchout', function(event){
            var eventType = event.type;

            var img = $(event.target);
            var originWidth = img.width();
            var originHeight = img.height();

            //if the dialog fitted the screen width, disable the pinch action
            var screenWidth = screen.width;

            var tabContainer = img.closest('div.col-xs-12');
            var paddingR = parseFloat(tabContainer.css('padding-right'));
            var paddingL = parseFloat(tabContainer.css('padding-left'));

            if(eventType === 'pinchin' && originWidth + paddingR + paddingL <= screenWidth){
                return false;
            }

            var originDiagonalLine = Math.sqrt(Math.pow(originWidth, 2) + Math.pow(originHeight, 2));

            var distance = event.distance * 0.8; //adjust the speed of resize
            var newDiagonalLine = 0;

            if(eventType === 'pinchin'){
                newDiagonalLine = originDiagonalLine - distance;
            }else if(eventType === 'pinchout'){
                newDiagonalLine = originDiagonalLine + distance;
            }
            var selectRatio = newDiagonalLine / originDiagonalLine;
            var selectWidth = originWidth * selectRatio;
            var selectHeight = originHeight * selectRatio;

            img.width(selectWidth).height(selectHeight);
        });

        /*
            swipe
        */
        var swipeObj = new Hammer.Swipe({
            event : 'swipe',
            pointers : 1,
            threshold : 10,
            direction : Hammer.DIRECTION_VERTICAL,
            velocity : 0.3
        });
        swipeObj.set({
            direction: Hammer.DIRECTION_VERTICAL
        });
        exports.permanentObj.umlCanvasHammerManager.add(swipeObj);
        exports.permanentObj.umlCanvasHammerManager.on('swipeup swipedown', function(event){

            var umlList = $('#umlList');
            var umlListAmount = umlList.children('li.list-group-item').length;

            var currentUmlLabel = $('#umlLabel').text();
            var currentUmlListIndex = umlList.children('li:contains("'+ currentUmlLabel +'")').index();

            var nextIndex = undefined;
            var type = event.type;
            if(type == 'swipeup'){
                nextIndex = currentUmlListIndex - 1;
                if(nextIndex == -1){
                    nextIndex = umlListAmount - 1;
                }
            }else if(type == 'swipedown'){
                nextIndex = currentUmlListIndex + 1;
                if(nextIndex == umlListAmount){
                    nextIndex = 0;
                }
            }

            //if the final index is equal to the original index, do nothing...
            if(currentUmlListIndex === nextIndex){
                return;
            }

            var nextActiveLi = umlList.children('li.list-group-item:eq('+ nextIndex +')');
            var nextFileName = nextActiveLi.data(globalConstUtils.DATA_PROP_FILE_NAME);
            var nextUmlLabel = nextActiveLi.text();

            umlDrawUtils.drawWithFileName(nextUmlLabel, nextFileName);
        });
    }
    return exports;
}));