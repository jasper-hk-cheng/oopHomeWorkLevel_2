
(function(root, initFunc){
    root.animationUtils = initFunc(root.jQuery);

})(this, function($){
    var exports = {};

    exports.shootSignal = function(direction, signalCallback){
        $('#message').text('');

        var allDots = $('.dotGroup > div');
        var allDotsAmount = allDots.length;

        allDots.each(function(index, element){

            setTimeout(function(){
                element.addEventListener('animationend', function(){
                    $(this).removeClass();

                    // if the signal transferring is accomplished, show the credit card certifying message...
                    if(index == allDotsAmount - 1){
                        signalCallback();
                    }
                });
                $(element).addClass(direction);
            }, index * 100);
        });
    }
    return exports;
});

$(window).on('load', function(){

    /*
        bank  interface
    */
    var bank = function(){};

    bank.prototype = {};

    bank.prototype.checkCreditCardNo = function(creditCard){
        throw new TypeError('checkCreditCardNo should be implemented !!');
    }

    /*
        four banks implemented...
    */
    var taiShinBank = function (){
        taiShinBank.superConstructor.call(this);
    };
    oopUtils.makeExtend(taiShinBank, bank);

    taiShinBank.prototype.checkCreditCardNo = function(creditCard){

        var bankName = creditCard.getBankName();
        var cardNo = creditCard.getCardNo();

        var message = '';
        if(bankName == 'tai shin' && cardNo){
            message = bankName + ' bank certified the credit card: ' + cardNo;
        }else{
            message = 'certified error because the wrong bank name';
        }
        animationUtils.shootSignal('rightTop', function(){
            $('#message').text(message);
        });
    }

    var cathayBank = function(){
        cathayBank.superConstructor.call(this);
    }
    oopUtils.makeExtend(cathayBank, bank);

    cathayBank.prototype.checkCreditCardNo = function(creditCard){

        var bankName = creditCard.getBankName();
        var cardNo = creditCard.getCardNo();

        var message = '';
        if(bankName == 'cathay' && cardNo){
            message = bankName + ' bank certified the credit card: ' + cardNo;
        }else{
            message = 'certified error because the wrong bank name';
        }
        animationUtils.shootSignal('leftTop', function(){
            $('#message').text(message);
        });
    }

    var ctbcBank = function(){
        ctbcBank.superConstructor.call(this);
    };
    oopUtils.makeExtend(ctbcBank, bank);

    ctbcBank.prototype.checkCreditCardNo = function(creditCard){

        var bankName = creditCard.getBankName();
        var cardNo = creditCard.getCardNo();

        var message = '';
        if(bankName == 'ctbc' && cardNo){
            message = bankName + ' bank certified the credit card: ' + cardNo;
        }else{
            message = 'certified error because the wrong bank name';
        }
        animationUtils.shootSignal('leftBottom', function(){
            $('#message').text(message);
        });
    }

    var ncccBank = function(){
        ncccBank.superConstructor.call(this);
    };
    oopUtils.makeExtend(ncccBank, bank);

    ncccBank.prototype.checkCreditCardNo = function(creditCard){

        var bankName = creditCard.getBankName();
        var cardNo = creditCard.getCardNo();

        var message = '';
        if(bankName == 'nccc' && cardNo){
            message = bankName + ' bank certified the credit card: ' + cardNo;
        }else{
            message = 'certified error because the wrong bank name';
        }
        animationUtils.shootSignal('rightBottom', function(){
            $('#message').text(message);
        });
    }

    /*
        credit card interface
    */
    var creditCard = function(cardNo){
        this.getCardNo = function(){
            return cardNo;
        }
    };

    creditCard.prototype = {};

    creditCard.prototype.getBankName = function(){
        throw new TypeError('getBankName needs to be implemented ...');
    };
    creditCard.prototype.getCardNo = function(){
        throw new TypeError('getCardNo needs to be implemented...');
    }

    /*
        credit card implemented...
    */
    var taiShinCreditCard = function(cardNo){
        taiShinCreditCard.superConstructor.call(this, cardNo)
    }
    oopUtils.makeExtend(taiShinCreditCard, creditCard);

    taiShinCreditCard.prototype.getBankName = function(){
        return 'tai shin';
    }

    var cathayCreditCard = function(cardNo){
        cathayCreditCard.superConstructor.call(this, cardNo);
    }
    oopUtils.makeExtend(cathayCreditCard, creditCard);

    cathayCreditCard.prototype.getBankName = function(){
        return 'cathay';
    }

    var ctbcCreditCard = function(cardNo){
        ctbcCreditCard.superConstructor.call(this, cardNo);
    }
    oopUtils.makeExtend(ctbcCreditCard, creditCard);

    ctbcCreditCard.prototype.getBankName = function(){
        return 'ctbc';
    }

    var ncccCreditCard = function(cardNo){
        ncccCreditCard.superConstructor.call(this, cardNo);
    }
    oopUtils.makeExtend(ncccCreditCard, creditCard);

    ncccCreditCard.prototype.getBankName = function(){
        return 'nccc';
    }

    /*
        bank factory
    */
    function bankFactory(){

        this.createBank = function(bankName){
            if(bankName == 'tai shin'){
                return new taiShinBank();
            }else if(bankName == 'cathay'){
                return new cathayBank();
            }else if(bankName == 'ctbc'){
                return new ctbcBank();
            }else if(bankName == 'nccc'){
                return new ncccBank();
            }
        }
    }

    /*
        bind the button event
    */
    $('#btnCathayBank').on('click', function(){
        var factory = new bankFactory();
        var cathayBank = factory.createBank('cathay');

        var cardNoToCheck = $('#creditCardNo').val();
        var creditCard = new cathayCreditCard(cardNoToCheck);
        cathayBank.checkCreditCardNo(creditCard);
    });

    $('#btnTaiShinBank').on('click', function(){
        var factory = new bankFactory();
        var taiShinBank = factory.createBank('tai shin');

        var cardNoToCheck = $('#creditCardNo').val();
        var creditCard = new taiShinCreditCard(cardNoToCheck);
        taiShinBank.checkCreditCardNo(creditCard);
    });

    $('#btnCtbcBank').on('click', function(){
        var factory = new bankFactory();
        var ctbcBank = factory.createBank('ctbc');

        var cardNoToCheck = $('#creditCardNo').val();
        var creditCard = new ctbcCreditCard(cardNoToCheck);
        ctbcBank.checkCreditCardNo(creditCard);
    });

    $('#btnNccc').on('click', function(){
        var factory = new bankFactory();
        var ncccBank = factory.createBank('nccc');

        var cardNoToCheck = $('#creditCardNo').val();
        var creditCard = new ncccCreditCard(cardNoToCheck);
        ncccBank.checkCreditCardNo(creditCard);
    });
});