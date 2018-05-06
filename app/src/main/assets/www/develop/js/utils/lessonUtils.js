
(function(root, initFunc){
    root.lessonUtils = initFunc(root.jQuery);

    //init lessonUtils content property
    $.getJSON(root.lessonUtils.const.LESSON_JSON_URL, undefined, function(data, status, xhr){
        //status option: "success", "notmodified", "error", "timeout", "parsererror"

        if(status === 'success'){
            data.forEach(function(element, index, thisArray){

                //ensure that the index of the array is equal to the lessonId of the element
                var lessonId = element.lessonId;
                root.lessonUtils.content[lessonId] = element;

                // laod the main lesson list
                var viewAdapter = {};
                viewAdapter.diagramAmount = element.umlList.length;
                viewAdapter.comment = element.comment;
                viewAdapter.lessonId = element.lessonId;

                var strLessonId = element.lessonId < 10 ? '0' + element.lessonId : element.lessonId;
                viewAdapter.title = 'DP' + strLessonId + ' ' + element.title;

                $('#lessonList').loadTemplate($('#lessonListTemplate'), viewAdapter, {
                    append: true,
                    afterInsert: function($templateObj){
                        $templateObj.find('.imgStyle').prop('src', 'img/' + element.imgSrc);
                    }
                });

            }, undefined);
        }else{
            console.log('get lesson json object fail, msg: ' + status);
        }
    });

}(this, function($){
    var exports = {};

    exports.const = {};
    exports.const.LESSON_JSON_URL = 'json/lessonList.json';

    //refer to the outcome object of loading the lessonList.json file
    exports.content = [];

    return exports;
}));