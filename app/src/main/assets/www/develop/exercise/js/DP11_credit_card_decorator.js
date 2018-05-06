
$(window).on('load', function(){

    /*
        price interface
    */
    var priceInterface = function(){

    }
    priceInterface.prototype = {};

    priceInterface.prototype.calculatePrice = function(originPrice){
        throw new ReferenceError('the calculatePrice method needs to be implemented !!');
    }

    /*
        decorator interface
    */
    var decoratorInterface = function(){

    }
    decoratorInterface.prototype = {};

    decoratorInterface.prototype.decorate = function(component){
        throw new ReferenceError('the decorate method needs to be implemented !!');
    }

    /*
        abstract decorator
    */
    var abstractDecorator = function(){
        abstractDecorator.superConstructor.call(this);

        this.presentOption = {
            getOneMoreForAnExtraBuck : '加一元多一件',
            coupon100 : '100元折價卷',
            reward100point : '紅利點數增加100點'
        }
    }
    oopUtils.makeExtend(abstractDecorator, priceInterface);

    abstractDecorator.prototype.calculatePrice = function(originPrice){
        throw new ReferenceError('the calculatePrice method still needs to be implemented in its sub class ~');
    }

    oopUtils.makeExtend(abstractDecorator, decoratorInterface);

    abstractDecorator.prototype.decorate = function(component){
        //should i return this or component to satisfy the fluent interface purpose ??
        return this.component = component;
    }

    /*
        origin price provider
    */
    var originPriceProvider = function(){
        originPriceProvider.superConstructor.call(this);
    }
    oopUtils.makeExtend(originPriceProvider, abstractDecorator);

    //it is the original price provider in all the credit card case, so, just return the origin price.
    originPriceProvider.prototype.calculatePrice = function(originPrice){
        return originPrice;
    }

    /*
        rebate decorator
    */
    var rebateDecorator = function(){
        rebateDecorator.superConstructor.call(this);
    }
    oopUtils.makeExtend(rebateDecorator, abstractDecorator);

    rebateDecorator.prototype.calculatePrice = function(originPrice){
        var componentResult = this.component.calculatePrice(originPrice);
        if(componentResult.price >= 1000){
            componentResult.price -= 100;
        }
        return componentResult;
    }

    /*
        discount decorator
    */
    var discountDecorator = function(){
        discountDecorator.superConstructor.call(this);
    }
    oopUtils.makeExtend(discountDecorator, abstractDecorator);

    discountDecorator.prototype.calculatePrice = function(originPrice){
        var componentResult = this.component.calculatePrice(originPrice);
        componentResult.price *= 0.8;
        return componentResult;
    }

    /*
        get one more decorator
    */
    var getOneMoreDecorator = function(){
        getOneMoreDecorator.superConstructor.call(this);
    }
    oopUtils.makeExtend(getOneMoreDecorator, abstractDecorator);

    getOneMoreDecorator.prototype.calculatePrice = function(originPrice){
        var componentResult = this.component.calculatePrice(originPrice);
        componentResult.present.push(this.presentOption.getOneMoreForAnExtraBuck);
        return componentResult;
    }

    /*
        coupon decorator
    */
    var couponDecorator = function(){
        couponDecorator.superConstructor.call(this);
    }
    oopUtils.makeExtend(couponDecorator, abstractDecorator);

    couponDecorator.prototype.calculatePrice = function(originPrice){
        var componentResult = this.component.calculatePrice(originPrice);
        componentResult.present.push(this.presentOption.coupon100);
        return componentResult;
    }

    /*
        reward decorator
    */
    var rewardDecorator = function(){
        rewardDecorator.superConstructor.call(this);
    }
    oopUtils.makeExtend(rewardDecorator, abstractDecorator);

    rewardDecorator.prototype.calculatePrice = function(originPrice){
        var componentResult = this.component.calculatePrice(originPrice);
        componentResult.present.push(this.presentOption.reward100point);
        return componentResult;
    }

    /*
        event binding ---------------------------------------------------------
    */

    $('#productTable').on('click', 'img', function(event){
        $(event.currentTarget).toggleClass('glow');
    });

    $('#btnReset').on('click', function(){
        $('#productTable img.glow').removeClass('glow');
        $('div.priceDesc div').text('').fadeOut('fast', 'linear');
    });

    $('#btnCalculate').on('click', function(){
        var productSelected = $('#productTable').find('img.glow');

        var originTotalPrice = 0;
        productSelected.each(function(index, element){
            var eachPrice = $(element).next('div.priceTag').text();
            originTotalPrice += parseInt(eachPrice);
        });
        //to avoid the field "component" being null, set the originPriceProvider as the base decorator...
        //the originPriceProvider can be the common one between all the credit card decorator combination...
        var opProvider = new originPriceProvider();

        //reduce all the present description to one line sentence
        var reducePresentDesc = function(descArray){
            var reduceResult = descArray.reduce(function(accumulation, currentValue, currentIndex, thisArr){
                var separator = currentIndex == descArray.length - 1 ? '' : ', ';
                return accumulation + currentValue + separator;
            }, '');
            return reduceResult;
        }

        /*
            ctbc
        */
        var ctbcRebate = new rebateDecorator();
        var ctbcDiscount = new discountDecorator();
        var ctbcCoupon = new couponDecorator();

        ctbcRebate.decorate(ctbcDiscount).decorate(ctbcCoupon).decorate(opProvider);
        var ctbcResultPrice = ctbcRebate.calculatePrice({
            price: originTotalPrice,
            present: []
        });
        ctbcResultPrice.present = reducePresentDesc(ctbcResultPrice.present);
        // set the calculated result into the hidden field so that the value which needs to be shown by the animation can be available...
        sessionStorage.setItem('ctbcResultPrice', JSON.stringify(ctbcResultPrice));

        /*
            taiShin
        */
        var taiShinDiscount = new discountDecorator();
        var taiShinGetOneMore = new getOneMoreDecorator();
        var taiShinCoupon = new couponDecorator();

        taiShinDiscount.decorate(taiShinGetOneMore).decorate(taiShinCoupon).decorate(opProvider);

        var taiShinResultPrice = taiShinDiscount.calculatePrice({
            price: originTotalPrice,
            present: []
        });
        taiShinResultPrice.present = reducePresentDesc(taiShinResultPrice.present);
        sessionStorage.setItem('taiShinResultPrice', JSON.stringify(taiShinResultPrice));

        /*
            citi
        */
        var citiRebate = new rebateDecorator();
        var citiReward = new rewardDecorator();
        var citiGetOneMore = new getOneMoreDecorator();

        citiRebate.decorate(citiReward).decorate(citiGetOneMore).decorate(opProvider);

        var citiResultPrice = citiRebate.calculatePrice({
            price: originTotalPrice,
            present: []
        });
        citiResultPrice.present = reducePresentDesc(citiResultPrice.present);
        sessionStorage.setItem('citiResultPrice', JSON.stringify(citiResultPrice));

        /*
            trigger the animation
        */
        animationUtils.triggerAnimation();
    });

    /*
        bind the animation utils on window root --------------------------------------------------------------- o
    */

    (function(root, initFunc){
        root.animationUtils = initFunc(root.jQuery);

    })(this, function($){
        var exports = {};

        exports.triggerAnimation = function(){

            //clear the price description div block
            $('div.priceDesc div').text('').fadeOut('fast', 'linear');

            var ctbcBank = new exports.bankObj('ctbc');
            var taiShinBank = new exports.bankObj('taiShin');
            var citiBank = new exports.bankObj('citi');

            ctbcBank.setNextBank(taiShinBank).setNextBank(citiBank);

            ctbcBank.setAnimationCallback(ctbcBank);
            taiShinBank.setAnimationCallback(taiShinBank);
            citiBank.setAnimationCallback(citiBank);

            $('#' + ctbcBank.bankName + 'Card').toggleClass('flipped');
        }

        //chain of responsibility - show the result of price and present
        exports.bankObj = function(bankName){
            this.bankName = bankName;

            this.nextBank = undefined;
            this.setNextBank = function(nextBankObj){
                return this.nextBank = nextBankObj;
            }

            this.setAnimationCallback = function(thisBank){

                var bankName = thisBank.bankName;
                var nextBank = thisBank.nextBank;

                var flipCardCallback = function(event){

                    //if the card's backend face to the screen, flip the card to the frontend
                    var thisCard = $('#' + bankName + 'Card');
                    if(thisCard.hasClass('flipped')){
                        thisCard.toggleClass('flipped');
                        return;
                    }

                    var resultPriceJsonString = sessionStorage.getItem(bankName + 'ResultPrice');
                    var resultPrice = JSON.parse(resultPriceJsonString);
                    $('#' + bankName + 'Payable').text('total price: ' + resultPrice.price);
                    $('#' + bankName + 'Comment').text(resultPrice.present);

                    $('#' + bankName + 'Payable').fadeIn('slow', 'linear', payableFadeInCallback);
                }

                var payableFadeInCallback = function(event){
                    $('#' + bankName + 'Comment').fadeIn('slow', 'linear', commentFadeInCallback);
                }

                var commentFadeInCallback = function(event){
                    if(!nextBank){
                        return;
                    }
                    $('#' + nextBank.bankName + 'Card').toggleClass('flipped');
                }

                $('div[id="'+ bankName +'Card"]').unbind('transitionend').on('transitionend', flipCardCallback);
            }
        }

        return exports;
    });
});