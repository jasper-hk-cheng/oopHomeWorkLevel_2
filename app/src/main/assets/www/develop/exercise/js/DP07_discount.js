
$(window).on('load', function(){

    /*
        purchaser
    */
    var purchaser = function (){

        // having an order object
        this.order = [];
        this.addOrder = function(produce){
            this.order.push(produce);
        }

        // having a list of purchase strategy object, (they have the same interface "strategy")
        this.strategyMap = {};
        this.putStrategyMap = function(strategy){
            this.strategyMap[strategy.name] = strategy;
        }

        // having analysis method to start to calculate and than get the minimum value
        this.analysis = function(){

            if(this.order.length === 0){
                alert('at least choice one produce, please !!');
                return;
            }

            var results = {};

            for(var i in this.strategyMap){
                var eachStrategy = this.strategyMap[i];
                var result = eachStrategy.getResult(this.order);
                results[eachStrategy.name] = result;

                //log
                eachStrategy.log('計算結果為 ' + result+' 元');
            }

            var minimumKey = '';
            var minimumValue = Number.MAX_VALUE;

            for(var strategyName in results){
                var eachValue = results[strategyName];
                if(minimumValue > eachValue){
                    minimumValue = eachValue;
                    minimumKey = strategyName;
                }
            }
            this.strategyMap[minimumKey].showWinnerInfo();
        }
    }

    /*
        produce(use closure to simulate encapsulate)
    */
    var produce = function(name, price){
        this.name = name;
        this.price = price;
    }

    /*
        strategy interface
    */
    // having name property
    // having getResult(order) showWinnerInfo() function

    // 1.calculate each result respectively
    // 2.show the result information mark of the comparision
    var strategyInterface = function(name, label){
//        this.name = name;
//        this.label = label;
    }
    strategyInterface.prototype = {};

    strategyInterface.prototype.getResult = function(order){
        throw new ReferenceError('getResult need to be implemented !!');
    }

    strategyInterface.prototype.showWinnerInfo = function(){
        $('#' + this.name + 'Medal').css('animation-name', 'medal-fall').prop('src', '../../img/DP07/betterMedal.png');
    }

    strategyInterface.prototype.log = function(text){
        $('#' + this.name + 'Log').append(this.label + ': ' + text + '<br/>');
    }

    //rebateIn1000
    var rebateIn1000Strategy = function(name, label){
        rebateIn1000Strategy.superConstructor.call(this);

        this.name = name;
        this.label = label;
    }
    oopUtils.makeExtend(rebateIn1000Strategy, strategyInterface);

    rebateIn1000Strategy.prototype.getResult = function(order){
        var originPrice = 0;
        var finalPrice = 0;

        order.forEach(function(element, index, thisArr){
            originPrice += parseInt(element.price);
        }, undefined);

        discount(originPrice);

        function discount(remainPrice){
            if(remainPrice >= 1000){
                //arrive to 1000 some kind of currency
                remainPrice -= 1000;
                finalPrice += 1000;

                //discount 100 some kink of currency
                if(remainPrice >= 100){
                    remainPrice -= 100;

                    //recursive the function until the remainPrice become 0
                    discount(remainPrice);
                }else{
                    remainPrice = 0;
                    return;
                }
            }else{
                finalPrice += remainPrice;
                remainPrice = 0;
                return;
            }
        }
        return finalPrice;
    }

    //percent20
    var percent20Strategy = function(name, label){
        percent20Strategy.superConstructor.call(this);

        this.name = name;
        this.label = label;
    }
    oopUtils.makeExtend(percent20Strategy, strategyInterface);

    percent20Strategy.prototype.getResult = function(order){
        var finalPrice = 0;

        order.forEach(function(element, index, thisArr){
            finalPrice += parseInt(element.price);
        }, undefined);

        return finalPrice * 0.8;
    }

    /*
        select the produce to purchase
    */
    $('#produceTable').delegate('img', 'click', function(event){
        $(event.target).toggleClass('glow');
    });

    /*
        reset the selection
    */
    $('#resetSelection').on('click', function(){
        $('#produceTable .glow').removeClass('glow');

        $('img[id$="Medal"]').css('animation-name', '').prop('src', '');

        $('div[id$="Log"]').each(function(index, element){
            var alertDiv = $('<div class="alert alert-success">');

            var id = $(element).prop('id');
            if(id.startsWith('rebateIn1000')){
                alertDiv.html('滿千送百');

            }else if(id.startsWith('percent20')){
                alertDiv.html('全面八折');
            }
            $(element).html(alertDiv);
        });
    });

    /*
        start to calculate the total price
    */
    $('#calculatePrice').on('click', function(){

        //clear the previous analysis record at the first
        clearMedalAndLog();

        var jasper = new purchaser();

        $('#produceTable .glow').each(function(index, element){
            var produceName = $(element).prop('src').replace('../../img/DP07/', '').replace('.png', '');
            var productPrice = $(element).prop('title');

            var theProduceToBuy = new produce(produceName, productPrice);
            jasper.addOrder(theProduceToBuy);
        });

        //generate the two kind of strategy
        var rebateIn1000 = new rebateIn1000Strategy('rebateIn1000', '滿千送百');
        jasper.putStrategyMap(rebateIn1000);

        var percent20 = new percent20Strategy('percent20', '一律八折');
        jasper.putStrategyMap(percent20);

        jasper.analysis();
    });

    function clearMedalAndLog(){
        $('img[id$="Medal"]').css('animation-name', '').prop('src', '');
        $('div[id$="Log"]').html('');
    }
});