
$(window).on('load', function(){

    /*
        interface iPrice
    */
    var iPrice = function(){

    }
    iPrice.prototype = {};

    iPrice.prototype.getPrice = function(){
        throw new ReferenceError('the getPrice method needs to be implements !!');
    }

    /*
        mac book pro
    */
    var macBookPro = function(){
        macBookPro.superConstructor.call(this);

        this.originPrice = 60000;
    }
    oopUtils.makeExtend(macBookPro, iPrice);

    macBookPro.prototype.getPrice = function(){
        return this.originPrice;
    }

    /*
        iPad air
    */
    var iParAir = function(){
        iParAir.superConstructor.call(this);

        this.originPrice = 10000;
    }
    oopUtils.makeExtend(iParAir, iPrice);

    iParAir.prototype.getPrice = function(){
        return this.originPrice;
    }

    /*
        apple watch
    */
    var appleWatch = function(){
        appleWatch.superConstructor.call(this);

        this.originPrice = 10000;
    }
    oopUtils.makeExtend(appleWatch, iPrice);

    appleWatch.prototype.getPrice = function(){
        return this.originPrice;
    }

    /*
        nintendo switch
    */
    var nintendoSwitch = function(){
        nintendoSwitch.superConstructor.call(this);

        this.originPrice = 10000;
    }
    oopUtils.makeExtend(nintendoSwitch, iPrice);

    nintendoSwitch.prototype.getPrice = function(){
        return this.originPrice;
    }

    /*
        zelda
    */
    var zelda = function(){
        zelda.superConstructor.call(this);

        this.originPrice = 2000;
    }
    oopUtils.makeExtend(zelda, iPrice);

    zelda.prototype.getPrice = function(){
        return this.originPrice;
    }

    /*
        apple series production
    */
    var appleSeriesProduction = function(){
        appleSeriesProduction.superConstructor.call(this);
    }
    oopUtils.makeExtend(appleSeriesProduction, iPrice);

    appleSeriesProduction.prototype.getPrice = function(){

        var discountPercentage = 0.9;

        var productList = [];
        productList.push(new macBookPro());
        productList.push(new iParAir());
        productList.push(new appleWatch());

        var totalPrice = productList.reduce(function(accumulator, currentValue, currentIndex, thisArrObj){
            return accumulator + currentValue.getPrice();
        }, 0);
        return discountPercentage * totalPrice;
    }

    /*
        nintendo series production
    */
    var nintendoSeriesProduction = function(){
        nintendoSeriesProduction.superConstructor.call(this);
    }
    oopUtils.makeExtend(nintendoSeriesProduction, iPrice);

    nintendoSeriesProduction.prototype.getPrice = function(){

        var discountPercentage = 0.9;

        var productList = [];
        productList.push(new nintendoSwitch());
        productList.push(new zelda());

        var totalPrice = productList.reduce(function(accumulator, currentValue, currentIndex, thisArrObj){
            return accumulator + currentValue.getPrice();
        }, 0);
        return discountPercentage * totalPrice;
    }

    /*
        apple x switch series production
    */
    var appleNintendoSeriesProduction = function(){
        appleNintendoSeriesProduction.superConstructor.call(this);
    }
    oopUtils.makeExtend(appleNintendoSeriesProduction, iPrice);

    appleNintendoSeriesProduction.prototype.getPrice = function(){

        var discountValue = 1000;

        var productList = [];
        productList.push(new appleSeriesProduction());
        productList.push(new nintendoSeriesProduction());

        var totalPrice = productList.reduce(function(accumulator, currentValue, currentIndex, thisArrObj){
            return accumulator + currentValue.getPrice();
        }, 0);
        return totalPrice - discountValue;
    }

    //----------------------------------------------------------------

    /*
        scan region locking for drag and drop effect
    */
    var sr = $('#scanRegion');
    var srOffset = sr.offset();
    var srWidth = sr.width();
    var srHeight = sr.height();

    var isInScanRegion = function(event){

        var clientX = event.clientX;
        var clientY = event.clientY;
        //test
//        console.log('clientX = '+clientX+' clientY = '+clientY);

        var isXMatchSr = clientX >= srOffset.left && clientX <= srOffset.left + srWidth;
        var isYMatchSr = clientY >= srOffset.top && clientY <= srOffset.top + srHeight;
        //test
//        console.log('isXMatchSr = '+isXMatchSr+' isYMatchSr = '+isYMatchSr);

        return isXMatchSr && isYMatchSr;
    }

    //jquery ui draggable

    $('div.productGroup, img').draggable({
        create: function(event, ui){
//            console.log(event.type + ' happened !!');
        },
        start: function(event, ui){
//            console.log(event.type + ' happened !!');
        },
        drag: function(event, ui){

            switch(ui.helper[0].id){
                case 'appleNintendoSeriesProduction':
                    $('#productTable img').addClass('glow');
                break;

                case 'appleSeriesProduction':
                    $('#macBookPro, #iParAir, #appleWatch').addClass('glow');
                break;

                case 'nintendoSeriesProduction':
                    $('#nintendoSwitch, #zelda').addClass('glow');
                break;

                default:

            }

            if(isInScanRegion(event)){
                sr.addClass('onScan');
                calculatePrice(ui.helper);
            }else{
                sr.removeClass('onScan');
            }
        },
        stop: function(event, ui){
            sr.removeClass('onScan');
            $('#productTable .glow').removeClass('glow');
        },
        revert: true
    });

    /*
        make the production instance be singleton...
    */
    var productSet = {

        appleNintendoSeriesProduction: new appleNintendoSeriesProduction(),
        appleSeriesProduction: new appleSeriesProduction(),
        nintendoSeriesProduction: new nintendoSeriesProduction(),

        macBookPro: new macBookPro(),
        iParAir: new iParAir(),
        appleWatch: new appleWatch(),
        nintendoSwitch: new nintendoSwitch(),
        zelda: new zelda()
    }

    var calculatePrice = function(thisObj){
        var production = productSet[thisObj[0].id];
        var price = production.getPrice();
        $('#scanMsg').text('total price: $' + price);

        //clear the message at 3 second later...
        setTimeout(function(){
            $('#scanMsg').text('drag the product to the scanning area !!');
        }, 7000);
    }
});