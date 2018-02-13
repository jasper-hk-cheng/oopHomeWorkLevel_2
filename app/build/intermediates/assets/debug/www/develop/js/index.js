
$(window).on('load', function(){

    if(window.navigator.userAgent.indexOf('Android') != -1){
        var cordovaScriptTag = $('<script>').prop('type', 'text/javascript').prop('src', '../cordova.js');
        $('html').append(cordovaScriptTag);

        document.addEventListener('deviceready', cordovaDeviceReady, false);
    }

//    cordovaDeviceReady();

    /*
        device ready callback setting...
    */
    function cordovaDeviceReady(){
        /*
            when the lesson list was clicked
        */
        $('#lessonList').delegate('li.list-group-item', 'click', function(event){

            //get the lesson object to get all the data about the current lesson

//            var lessonId = $(event.target).closest('li.list-group-item').find('input[name="lessonId"]:hidden').val();

            var lessonId = $(event.currentTarget).find('input[name="lessonId"]:hidden').val();
            var lessonObj = lessonUtils.content[lessonId];

            // set the iframe's url
            $('#exercise').prop('src', lessonObj.hkUrl);

            // load the uml list (clear the list container at the first)
            var umlList = $('#umlList');
            if(!umlList.is(':empty')){
                umlList.empty();
            }
            lessonObj.umlList.forEach(function(element, index){
                var newLi = umlList.append($('<li class="list-group-item">')).children('li:last');
                newLi.text(element.label).data(globalConstUtils.DATA_PROP_FILE_URL, element.fileName);
            });

            // switch to the sub (second) page and pre-select the first tab
            $('#lessonListBlock').hide();
            $('#lessonContentBlock').show({
                effect : 'fade',
                easing : 'swing',
                duration : 300,
                complete : function(){
                    //after the lessonContent showed, let the example tab be visible by trigger a click event
                    $('#tabContainer > li:first').trigger('click');
                }
            });
        });

        /*
            go back to lesson list block
        */
        $('#backToLessonList').on('click', function(){
            $('#lessonContentBlock').hide();
            $('#lessonListBlock').show({
                effect : 'drop',
                easing : 'swing',
                duration : 350,
                complete : function(){

                }
            });
        });

        /*
            when the tab was clicked
        */
        $('#tabContainer').delegate('li', 'click', function(event){

            // clear the previous status
            $(event.target).closest('ul#tabContainer').find('.active').removeClass('active');
            $(event.target).closest('ul#tabContainer').find('li > a').each(function(index, element){
                var hash = $(element).prop('hash');
                if($(hash).is(':visible')){
                    $(hash).hide();
                }
            });

            // set the newly status

//            $(event.target).closest('li').addClass('active');
//            var hash = $(event.target).closest('li').children('a').prop('hash');

            var theClickedLi = $(event.currentTarget);
            theClickedLi.addClass('active');
            var hash = theClickedLi.children('a').prop('hash');
            $(hash).show();
        });

        /*
            when the uml list was clicked
        */
        $('#umlList').delegate('li.list-group-item', 'click', function(event){

            //draw the uml on the specified canvas

//            var theClickedLi = $(event.target).closest('li.list-group-item');

            var theClickedLi = $(event.currentTarget);
            var umlLabel = theClickedLi.text();
            var fileUrl = theClickedLi.data(globalConstUtils.DATA_PROP_FILE_URL);

            umlDrawUtils.drawWithFileUrl(umlLabel, fileUrl);

            //jump to the canvas tab, regardless the canvas had been drawn completed or not...
            $('#tabContainer').find('a[href="#umlCanvasBlock"]').trigger('click');
        });
    }
});

