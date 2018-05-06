
$(window).on('load', function(){

    /*
        message enumeration
    */
    var messageEnum = {
        red : 'the sign is red now !!',
        yellow : 'the sign is yellow now !!',
        green : 'the sign is green now !!'
    }

    /*
        state interface
    */
    var signInterface = function(){

    }
    signInterface.prototype = {};

    signInterface.prototype.handle = function(){
        throw new ReferenceError('the handle method needs to be implements !!');
    }

    signInterface.prototype.getMessage = function(){
        throw new ReferenceError('the getMessage method needs to be implements !!');
    }

    // to avoid to construct duplicate sign instance...
    signInterface.prototype.setNextSign = function(signInterface){
        throw new ReferenceError('the setNextSign method needs to be implements !!');
    }

    /*
        abstract sign
    */
    var abstractSign = function(){
        abstractSign.superConstructor.call(this);
    }
    oopUtils.makeExtend(abstractSign, signInterface);

    abstractSign.prototype.setNextSign = function(signInterface){
        return this.nextSign = signInterface;
    }

    /*
        red sign
    */
    var redSign = function(){
        redSign.superConstructor.call(this);

        this.nextSign = undefined;
    }
    oopUtils.makeExtend(redSign, abstractSign);

    redSign.prototype.getMessage = function(){
        return messageEnum.red;
    }

    redSign.prototype.handle = function(){
        animationUtils.turnOverRed();
        return this.nextSign;
    }

    /*
        yellow sign
    */
    var yellowSign = function(){
        yellowSign.superConstructor.call(this);

        this.nextSign = undefined;
    }
    oopUtils.makeExtend(yellowSign, abstractSign);

    yellowSign.prototype.getMessage = function(){
        return messageEnum.yellow;
    }

    yellowSign.prototype.handle = function(){
        animationUtils.turnOverYellow();
        return this.nextSign;
    }

    /*
        green sign
    */
    var greenSign = function(){
        greenSign.superConstructor.call(this);

        this.nextSign = undefined;
    }
    oopUtils.makeExtend(greenSign, abstractSign);

    greenSign.prototype.getMessage = function(){
        return messageEnum.green;
    }

    greenSign.prototype.handle = function(){
        animationUtils.turnOverGreen();
        return this.nextSign;
    }

    /*
        controller (state context)
    */
    var signController = function(signInterface){
        this.state = signInterface;

        this.request = function(){

            //test
//            console.log('current state: ' + this.state.getMessage());

            this.state = this.state.handle();

            //test
//            console.log('next state: ' + this.state.getMessage());

            return this.state.getMessage();
        }
    }

    /*
        construct all the instance
    */
    var greenLight = new greenSign();
    var yellowLight = new yellowSign();
    var redLight = new redSign();

    // set the chain of state
    greenLight.setNextSign(yellowLight).setNextSign(redLight).setNextSign(greenLight);

    // new a controller instance and initialize the state as green sign
    var controller = new signController(greenLight);



    /*
        html element event
    */
    $('#turnOnSign').on('click', function(){
        if(!$(this).hasClass('btn-info')){
            return;
        }
        controller.request();

        $(this).removeClass('btn-info');
        $('#turnOffSign').addClass('btn-info');
    });

    $('#turnOffSign').on('click', function(){
        if(!$(this).hasClass('btn-info')){
            return;
        }
        $('div[id$="Light"]').removeClass();

        $(this).removeClass('btn-info');
        $('#turnOnSign').addClass('btn-info');
    });

    var clearSignAndTriggerNextOne = function(){
        $(this).removeClass();
        controller.request();
    }
    $('#redLight').on('animationend', clearSignAndTriggerNextOne);
    $('#yellowLight').on('animationend', clearSignAndTriggerNextOne);
    $('#greenLight').on('animationend', clearSignAndTriggerNextOne);

    /*
        animationUtils
    */
    (function(root, initFunc){
        root.animationUtils = initFunc(root.jQuery);

    })(this, function($){
        var exports = {};

        exports.turnOverRed = function(){
            $('#redLight').addClass('red');
            updateWalkSpeed(0, 0);
        }

        exports.turnOverYellow = function(){
            $('#yellowLight').addClass('yellow');
            updateWalkSpeed(10, 0.5);
        }

        exports.turnOverGreen = function(){
            $('#greenLight').addClass('green');
            updateWalkSpeed(5, 1);
        }

        return exports;
    });

    /*
        gravity api
    */
    var man = $('#walkingMan');

    var updateWalkSpeed = function(stepLength, animationDuration){
        walkSettings.stepLength = stepLength;
        man.css('animation-duration', animationDuration + 's');
    }

    var walkSettings = {
        stepLength: 5,
        walkDistance: 0,
        lengthUnit: 'vw',
        intervalId: undefined,

        goLeft: function(){
            man.removeClass().addClass('walkToLeft').addClass('walkingManLeft');

            clearInterval(this.intervalId);
            this.intervalId = setInterval(function(){
                walkSettings.walkDistance -= walkSettings.stepLength;
                walkSettings.walkDistance = walkSettings.walkDistance <= -60 ? 60 : walkSettings.walkDistance;
                man.css('transform', 'translateX('+ walkSettings.walkDistance + walkSettings.lengthUnit + ')');
            }, 500);
        },
        goRight: function(){
            man.removeClass().addClass('walkToRight').addClass('walkingManRight');

            clearInterval(this.intervalId);
            this.intervalId = setInterval(function(){
                walkSettings.walkDistance += walkSettings.stepLength;
                walkSettings.walkDistance = walkSettings.walkDistance >= 60 ? -60 : walkSettings.walkDistance;
                man.css('transform', 'translateX('+ walkSettings.walkDistance + walkSettings.lengthUnit + ')');
            }, 500);
        }
    };

    $('#btnGoLeft').on('click', function(){
        walkSettings.goLeft();
    });

    $('#btnStop').on('click', function(){
        man.removeClass('walkToLeft').removeClass('walkToRight');
        clearInterval(walkSettings.intervalId);
    });

    $('#btnGoRight').on('click', function(){
        walkSettings.goRight();
    });
});

