
$(window).on('load', function(){

    var jsonData = [];
    var templateOpt = {append : true};
    var iconPrefix = 'glyphicon glyphicon-';

    $.getJSON('../../json/singleton.json', undefined, function(data, status, xhr){
        if(status == 'success'){

            data.forEach(function(element, index, thisArray){
                /*
                    save all the subject to jsonData
                */
                jsonData[element.id] = element;

                /*
                    load subject no
                */
                $('#subNoList').loadTemplate($('#subNoTemplate'), element, templateOpt);
            }, undefined);
        }
    });

    $('#subNoList').delegate('button', 'click', function(event){
        var button = $(event.target);
        if(!button.is(':button')){
            button = button.closest(':button');
        }
        var id = button.prop('id');

        // set subject title
        var subTitle = jsonData[id].subTitle;
        $('#subTitleContent').html(subTitle).data('sub-no-id', id);

        /*
            set subject description and answer
        */
        $('#subDescList, #answerList').empty();

        jsonData[id].subDesc.forEach(function(element, index, thisArray){

            //add hash property
            element.hash = '#subDesc' + element.id;
            // subject description list
            $('#subDescList').loadTemplate($('#subDescTemplate'), element, templateOpt);

            //add paneId
            element.paneId = 'subDesc' + element.id;
            //add iconClazz
            if(element.answer === 'Y'){
                element.iconClazz = iconPrefix + 'ok iconO';
            }else if(element.answer === 'N'){
                element.iconClazz = iconPrefix + 'remove iconX';
            }
            // answer list
            $('#answerList').loadTemplate($('#answerTemplate'), element, templateOpt);

        }, undefined);
    });

    /*
        when subject title content was clicked...
    */
    $('#subTitleContent').on('click', function(event){
        var subNoId = $(this).data('sub-no-id');

        var umlDialogUrl = jsonData[subNoId].umlDialogUrl;
        if(!umlDialogUrl){
            return;
        }

        var umlModal = $('#umlDiagramModal');
        umlModal.find('#umlDialog').prop('src', umlDialogUrl);
        umlModal.modal('show');
    });

    /*
        when subject description list was clicked
    */
    $('#subDescList').delegate('a', 'click', function(event){
        var a = $(event.target);

        a.closest('#subDescList').find('.active').removeClass('active');
        a.tab('show');
        a.addClass('active');
    });

    /*
        uml modal
    */
    $('#umlDiagramModal').on('shown.dt.modal', function(){

    }).on('hidden.dt.modal', function(){
        $(this).find('#umlDialog').prop('src', '');
    });

});