
$(window).on('load', function(){

    /*
        get the canvas object and set the canvas size(width and height)
    */
    var canvasContainer = $('#myDaubCanvas').closest('div.row');
    var canvasHeight = canvasContainer.height();
    var canvasWidth = canvasContainer.width();
    $('#myDaubCanvas').height(canvasHeight).width(canvasWidth);

    var myDaubCanvas = document.getElementById('myDaubCanvas');
    myDaubCanvas.width = canvasWidth;
    myDaubCanvas.height = canvasHeight;

    /*
        initial all the radio element
    */
    $(':radio').iCheck({
        radioClass : 'iradio_minimal-green'
    });

    /*
        class declaration
    */

    // abstract class shape
    var shape = function(drawLib){
        this.drawLib = drawLib;
    }
    shape.prototype = {};

    shape.prototype.drawCircle = function(x, y, radius){
        this.drawLib.drawCircle(x, y, radius);
    }
    shape.prototype.drawLine = function(x1, y1, x2, y2){
        this.drawLib.drawLine(x1, y1, x2, y2);
    }
    shape.prototype.display = function(){
        throw new ReferenceError('display needs to be implemented !!');
    }

    //circle
    var circle = function(drawLib, x, y, radius){
        circle.superConstructor.call(this, drawLib);

        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    oopUtils.makeExtend(circle, shape);

    circle.prototype.display = function(){
        circle.superClazz.drawCircle.call(this, this.x, this.y, this.radius);
    }

    circle.prototype.multiDisplay = function(){
        var printAmount = parseInt($('#printAmount').val()) || 1;
        var printOffset = parseInt($('#printOffset').val()) || 2;

        for(var i = 0; i < printAmount; i++){
            this.display();
            this.x += printOffset;
            this.y += printOffset;
        }
    }

    //rectangle
    var rectangle = function(drawLib, x1, y1, x2, y2){
        rectangle.superConstructor.call(this, drawLib);

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    oopUtils.makeExtend(rectangle, shape);

    rectangle.prototype.display = function(){
        rectangle.superClazz.drawLine.call(this, this.x1, this.y1, this.x2, this.y1);
        rectangle.superClazz.drawLine.call(this, this.x2, this.y1, this.x2, this.y2);
        rectangle.superClazz.drawLine.call(this, this.x2, this.y2, this.x1, this.y2);
        rectangle.superClazz.drawLine.call(this, this.x1, this.y2, this.x1, this.y1);
    }

    rectangle.prototype.multiDisplay = function(){
        var printAmount = parseInt($('#printAmount').val()) || 1;
        var printOffset = parseInt($('#printOffset').val()) || 2;

        for(var i = 0; i < printAmount; i++){
            this.display();
            this.x1 += printOffset;
            this.y1 += printOffset;
            this.x2 += printOffset;
            this.y2 += printOffset;
        }
    }

    //line
    var line = function(drawLib, x1, y1, x2, y2){
        line.superConstructor.call(this, drawLib);

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    oopUtils.makeExtend(line, shape);

    line.prototype.display = function(){
        line.superClazz.drawLine.call(this, this.x1, this.y1, this.x2, this.y2);
    }

    line.prototype.multiDisplay = function(){
        var printAmount = parseInt($('#printAmount').val()) || 1;
        var printOffset = parseInt($('#printOffset').val()) || 2;

        for(var i = 0; i < printAmount; i++){
            this.display();
            this.x1 += printOffset;
            this.y1 += printOffset;
            this.x2 += printOffset;
            this.y2 += printOffset;
        }
    }

    //shape factory
    var shapeFactory = function(param){
        switch(param.shapeToDraw){

            case 'circle':
                return new circle(param.drawLib, param.startX, param.startY, param.distance);

            case 'rectangle':
                return new rectangle(param.drawLib, param.startX, param.startY, param.endX, param.endY);

            case 'drawText':
                return new line(param.drawLib, param.startX, param.startY, param.endX, param.endY);

            default:
                console.log('in the shape factory, this shapeToDraw is not found !!');
        }
    }

    /*
        draw api
    */
    var cxt = myDaubCanvas.getContext('2d');

    var GDIPlus = {
        drawLine : function(x1, y1, x2, y2){
            cxt.beginPath();

            cxt.lineWidth = $('#fontWeight').val() || '1';
            cxt.strokeStyle = 'green';

            cxt.moveTo(x1, y1);
            cxt.lineTo(x2, y2);
            cxt.stroke();
        },
        drawCircle : function(x, y, radius){
            cxt.beginPath();

            cxt.lineWidth = $('#fontWeight').val() || '1';
            cxt.strokeStyle = 'green';

            cxt.arc(x, y, radius, 0, 2*Math.PI);
            cxt.stroke();
        }
    }
    var Win32API = {
        drawLine : function(x1, y1, x2, y2){
            cxt.beginPath();

            cxt.lineWidth = $('#fontWeight').val() || '1';
            cxt.strokeStyle = 'purple';

            cxt.moveTo(x1, y1);
            cxt.lineTo(x2, y2);
            cxt.stroke();
        },
        drawCircle : function(x, y, radius){
            cxt.beginPath();

            cxt.lineWidth = $('#fontWeight').val() || '1';
            cxt.strokeStyle = 'purple';

            cxt.arc(x, y, radius, 0, 2*Math.PI);
            cxt.stroke();
        }
    }

    //abstract draw library
    var drawLib = function(){

    }
    drawLib.prototype = {};

    drawLib.prototype.drawLine = function(x1, y1, x2, y2){
        throw new ReferenceError('drawLine needs to be implemented !!');
    }
    drawLib.prototype.drawCircle = function(x, y, radius){
        throw new ReferenceError('drawCircle needs to be implemented !!');
    }

    //draw lib 01
    var drawLibV1 = function(){
        drawLibV1.superConstructor.call(this);
    }
    oopUtils.makeExtend(drawLibV1, drawLib);

    drawLibV1.prototype.drawLine = function(x1, y1, x2, y2){
        GDIPlus.drawLine(x1, y1, x2, y2);
    }
    drawLibV1.prototype.drawCircle = function(x, y, radius){
        GDIPlus.drawCircle(x, y, radius);
    }

    //draw lib 02
    var drawLibV2 = function(){
        drawLibV2.superConstructor.call(this);
    }
    oopUtils.makeExtend(drawLibV2, drawLib);

    drawLibV2.prototype.drawLine = function(x1, y1, x2, y2){
        Win32API.drawLine(x1, y1, x2, y2);
    }
    drawLibV2.prototype.drawCircle = function(x, y, radius){
        Win32API.drawCircle(x, y, radius);
    }

    var drawLibFactory = function(type){
        switch(type){
            case 'gdiPlus':
                return new drawLibV1();
                break;
            case 'win32api':
                return new drawLibV2();
                break;
            default:
                console.log('this type of draw library is not found !!');
        }
    }

    /*
        bind the gesture on the canvas
        1.bind press event to get start position
        2.bind panmove event to get end position and accumulate the distance
    */
    var gesMgr = new Hammer.Manager(myDaubCanvas, {});

    var paramTemp = {};
    paramTemp.startX = 0;
    paramTemp.startY = 0;
    paramTemp.clearParamTemp = function(){
        this.startX = 0;
        this.startY = 0;
    }

    var paramFactory = function(shapeToDraw, paramTemp, endX, endY, drawLib, logMode){

        //adjust the ending coordination value
        var startX = paramTemp.startX;
        var startY = paramTemp.startY;
        var radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        //log mode
        if(logMode){
            console.log('paramFactory startX = ', startX, ' startY = ', startY, ' endX = ', endX, ' endY = ', endY, ' radius = ', radius);
        }

        var param = {};
        param.shapeToDraw = shapeToDraw;
        param.drawLib = drawLib;

        switch(shapeToDraw){

            case 'circle':
                param.startX = startX;
                param.startY = startY;
                param.distance = radius;

                paramTemp.clearParamTemp();
                break;

            case 'rectangle':
                param.startX = startX;
                param.startY = startY;
                param.endX = endX;
                param.endY = endY;

                paramTemp.clearParamTemp();
                break;

            case 'drawText':
                param.startX = startX;
                param.startY = startY;
                param.endX = endX;
                param.endY = endY;
                break;

            default:
                console.log('this shapeToDraw is not found !!');
        }
        return param;
    }

//    shape constructor api spec.
//    new circle(param.drawLib, param.startX, param.startY, param.distance);
//    new rectangle(param.drawLib, param.startX, param.startY, param.endX, param.endY);

    var pressObj = new Hammer.Press({
        event : 'press',
        points : 1,
        threshold : 1, //Minimal movement that is allowed while pressing.(official web site description)
        time: 1
    });
    gesMgr.add(pressObj);
    gesMgr.on('press', function (event){
        var center = event.center;
        paramTemp.startX = center.x;
        paramTemp.startY = center.y;

        //make a point sign at the start point
        var drawLibType = $('[name="drawLib"]:radio:checked').val();
        var drawLib = drawLibFactory(drawLibType);
        new circle(drawLib, center.x, center.y, 1).multiDisplay();
    });

    var panObj = new Hammer.Pan({
        event : 'panmove',
        points : 1,
        threshold : 10,
        direction : Hammer.DIRECTION_ALL
    });
    gesMgr.add(panObj);
    gesMgr.on('panmove', function (event){
        var center = event.center;

        //force to initialize the paramTemp to avoid letting both of the startX and startY being equal to zero;
        //by the hammer.js package, the event.isFirst is always false within the pan gesture...
        if(!paramTemp.startX && !paramTemp.startY){
            paramTemp.startX = center.x;
            paramTemp.startY = center.Y;
        }

        var drawLibType = $('[name="drawLib"]:radio:checked').val();
        var drawLib = drawLibFactory(drawLibType);

        var shapeToDraw = $('[name="shape"]:radio:checked').val();
        if(shapeToDraw === 'drawText'){
            var param = paramFactory(shapeToDraw, paramTemp, center.x, center.y, drawLib);
            shapeFactory(param).multiDisplay();

            if(event.isFinal){
                paramTemp.clearParamTemp();
            }else{
                paramTemp.startX = center.x;
                paramTemp.startY = center.y;
            }
        }else{
            /*
             shape of circle or rectangle
            */
            var endX = center.x;
            var endY = center.y;

            if(event.isFinal){
                var param = paramFactory(shapeToDraw, paramTemp, endX, endY, drawLib);
                shapeFactory(param).multiDisplay();

                // animation terminate
                disableAnimation();
            }else{
                showPreviewAnimation(shapeToDraw, paramTemp, endX, endY);
            }
        }
    });

    $('#clearCanvas').on('click', function(){
        cxt.clearRect(0, 0, myDaubCanvas.width, myDaubCanvas.height);
    });

    /*
        animation
    */
    var showPreviewAnimation = function (shapeToDraw, paramTemp, endX, endY, traceMode){
        var startX = paramTemp.startX;
        var startY = paramTemp.startY;

        var assistLine = $('#assistLine').css('border', '1px dashed black').css('position', 'fixed');

        switch(shapeToDraw){
            case 'circle':
                assistLine.css('border-radius', '50%')

                var radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                assistLine.width(radius * 2).height(radius * 2);

                //trace mode
                if(traceMode){
                    console.log('animation startX = ', startX, ' startY = ', startY, ' endX = ', endX, ' endY = ', endY, ' radius = ', radius);
                }

                var top = startY - radius;
                var left = startX - radius;
                assistLine.css('top', top).css('left', left);
            break;

            case 'rectangle':

                var recWidth = Math.abs(endX - startX);
                var recHeight = Math.abs(endY - startY);
                assistLine.width(recWidth).height(recHeight);

                var top = Math.min(startY, endY);
                var left = Math.min(startX, endX);
                assistLine.css('top', top).css('left', left);
            break;

            default:
                console.log('preview animation is not available because the shapeToDraw is undefined !!');
        }

        //tracing mode
        if(traceMode){
            var drawLibType = $('[name="drawLib"]:radio:checked').val();
            var drawLib = drawLibFactory(drawLibType);
            new circle(drawLib, endX, endY, 1).multiDisplay();
        }
    }

    var disableAnimation = function(){
        var assistLine = $('#assistLine');

        assistLine.css('border', '');
        assistLine.css('border-radius', '');
        assistLine.css('position', '');
        assistLine.css('top', '').css('left', '');
        assistLine.css('width', '').css('height', '');
    }
});

