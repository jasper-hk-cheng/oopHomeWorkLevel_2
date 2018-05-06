
(function(root, initFunc){
    root.animationUtils = initFunc(root.jQuery);

}(this, function($){
    var exports = {};

    exports.impermanent = {};
    exports.impermanent.total = undefined;
    exports.impermanent.isValid = undefined;

    /*
        here we can't use animaitonend event because if the value is not valid, we will apply the animation infinite...
        so, take the setAllCharCallback as the argument...
    */
    exports.setAllChar = function(idNumber, setAllCharCallback){
        for(var i = 0; i < idNumber.length; i++){
            var eachChar = idNumber.charAt(i);
            var eachCharDiv = $('#basicCheck > div:eq('+ i +') > div');

            setTimeout(function(char, div, index){
                div.text(char).addClass('eachChar');

                //start validation after all the char was set
                if(index == idNumber.length - 1){
                    //for waiting the last char was set, delay some times(400ms) and than trigger the callback;
                    setTimeout(setAllCharCallback, 400, idNumber);
                }
            }, i * 100, eachChar, eachCharDiv, i);
        }
    }

    exports.showLeadingCharResult = function(isValid){
        var cssName = isValid ? 'isLegal' : 'isIllegal';
        $('#basicCheck > div:eq(0) > div').removeClass('eachChar').addClass(cssName);
        return isValid;
    }

    exports.showNumberResult = function(isValid){
        var cssName = isValid ? 'isLegal' : 'isIllegal';
        $('#basicCheck > div:gt(0) > div').removeClass('eachChar').addClass(cssName);
        return isValid;
    }

    exports.showNumberValueResult = function(isValid){
        exports.impermanent.isValid = isValid;

        var cssName = isValid ? 'isLegal' : 'isIllegal';
        return isValid;
    }

    exports.showNumberValueProcess = function(transferResult, multipleResult){

        for(var i = 0; i < transferResult.length; i++){
            setTimeout(function(transfer, multiple, index){
                var containerNumber = index < 10 ? '0' + index : index;
                var container = $('#transferChar' + containerNumber);

                container.children('.charToValid').text(transfer);
                container.children('.processDetail').show();
                container.children('.calculateResult').text(multiple);

                container.css('border-width', '1');

                //at the last lap, draw a "equivalent" line
                if(index == transferResult.length - 1){
                    $('#equivalentLine').addClass('drawSeparateLine');
                }

            }, i * 100, transferResult[i], multipleResult[i], i);
        }
    }

    //closure for animation callback
    exports.setTotalValue = function(total){
        exports.impermanent.total = total;
    }

    exports.showTotalValue = function(){
        var total = $('div.total');
        total.text('total : ' + exports.impermanent.total).show();

        var reportDefault = 'Summary: The ID No. is ';
        var summaryReport = $('div.summaryReport');

        if(exports.impermanent.isValid){
            summaryReport.text(reportDefault + 'correct !!');
            total.css('background', 'DarkOliveGreen');
        }else{
            summaryReport.text(reportDefault + 'not valid !!');
            total.css('background', 'Chocolate');
        }

        total.show();
        summaryReport.show();
    }

    return exports;
}));

$(window).on('load', function(){

    /*
        ### the Taiwan id number validating rule ###

        http://120.105.184.250/peiyuli/lesson-40.htm

        字母	A	B	C	D	E	F	G	H	J	K	L	M	N
        數字	10	11	12	13	14	15	16	17	18	19	20	21	22
        字母	P	Q	R	S	T	U	V	X	Y	W	Z	I	O
        數字	23	24	25	26	27	28	29	30	31	32	33	34	35

        轉換後的身分證字號(共11位數字)每一位數均有固定的權重(Weight)，由左往右依序為 『1 9 8 7 6 5 4 3 2 1 1』
        各位數字與其相對應的權重相乘後再加總，加總後的結果若為10的倍數則身分證字號即屬正確。
    */
    // because the mapping rule doesn't follow the sort of value of unicode,
    // here we directly enumerate all the mapping value

    var leadingCharMapping = {
        A : 10,
        B : 11,
        C : 12,
        D : 13,
        E : 14,
        F : 15,
        G : 16,
        H : 17,
        J : 18,
        K : 19,
        L : 20,
        M : 21,
        N : 22,
        P : 23,
        Q : 24,
        R : 25,
        S : 26,
        T : 27,
        U : 28,
        V : 29,
        X : 30,
        Y : 31,
        W : 32,
        Z : 33,
        I : 34,
        O : 35
    }

    var weightMapping = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    /*
        interface
    */
    var checkerInterface = function(){

    }
    checkerInterface.prototype = {};

    checkerInterface.prototype.check = function(idNumber){
        throw new ReferenceError('the check method needs to be implemented !!');
    }
    checkerInterface.prototype.setNextChecker = function(checker){
        throw new ReferenceError('the setNextChecker method needs to be implemented !!');
    }

    /*
        abstract class
    */
    var abstractChecker = function(){
        abstractChecker.superConstructor.call(this);
    }
    oopUtils.makeExtend(abstractChecker, checkerInterface);

    abstractChecker.prototype.setNextChecker = function(checker){
        return this.nextChecker = checker;
    }

    /*
        leadingCharChecker class
    */
    var leadingCharChecker = function (){
        leadingCharChecker.superConstructor.call(this);

        this.nextChecker = undefined;
    }
    oopUtils.makeExtend(leadingCharChecker, abstractChecker);

    leadingCharChecker.prototype.check = function(idNumber){
        var leadingChar = idNumber.substring(0, 1);
        var charCode = leadingChar.charCodeAt(0);

        if(charCode < 65 || charCode > 90){
            return animationUtils.showLeadingCharResult(false);
        }

        if(!this.nextChecker){
            return animationUtils.showLeadingCharResult(true);
        }

        //the step of validation was passed
        animationUtils.showLeadingCharResult(true);

        return this.nextChecker.check(idNumber);
    }

    /*
        numberChecker
    */
    var numberChecker = function(){
        numberChecker.superConstructor.call(this);

        this.nextChecker = undefined;
    }
    oopUtils.makeExtend(numberChecker, abstractChecker);

    numberChecker.prototype.check = function(idNumber){
		var idNumericPart = idNumber.substring(1, idNumber.length);

		if(isNaN(idNumericPart) || idNumericPart.length !== 9){
		    return animationUtils.showNumberResult(false);
		}

        if(!this.nextChecker){
            return animationUtils.showNumberResult(true);
        }

        //the step of validation was passed
        animationUtils.showNumberResult(true);

        return this.nextChecker.check(idNumber);
    }

    /*
         number value checker
    */
    var numberValueChecker = function(){
        numberValueChecker.superConstructor.call(this);

        this.nextChecker = undefined;
    }
    oopUtils.makeExtend(numberValueChecker, abstractChecker);

    numberValueChecker.prototype.check = function(idNumber){
        var transferResult = new Array(11);

        for(var i = 0; i < idNumber.length; i++){
            var eachChar = idNumber.charAt(i);

            if(i == 0){
                var transferValue = leadingCharMapping[eachChar.toUpperCase()];
                var the1stNumber = transferValue / 10;
                var the2ndNumber = transferValue % 10;

                //note!! push the the1stNumber at the first and the counter sort is not permitted.
                transferResult[0] = the1stNumber;
                transferResult[1] = the2ndNumber;
            }else{
                transferResult[i + 1] = parseInt(eachChar);
            }
        }

        var multipleResult = new Array(11);

        for(var i = 0; i < 11; i++){
            multipleResult[i] = transferResult[i] * weightMapping[i];
        }

        //animation
        animationUtils.showNumberValueProcess(transferResult, multipleResult);

        var total = multipleResult.reduce(function(accumulator, currentValue, currentIndex, thisArray){
            return accumulator + currentValue;
        }, 0 /* initial value */);

        //animation
        animationUtils.setTotalValue(total);

        /*
            the result of validation is gotten, now use the guard clause to execute the checking
        */
        if(total % 10){
            return animationUtils.showNumberValueResult(false);
        }

        if(!this.nextChecker){
            return animationUtils.showNumberValueResult(true);
        }

        //the step of validation was passed
        animationUtils.showNumberValueResult(true);

        return nextChecker.check(idNumber);
    }

    $('#btnStartCheck').on('click', function(){
        //clear at the first
        clearAllTheField();

        var idNumber = $('#idNumber').val();

        //animation
        animationUtils.setAllChar(idNumber, startCheck);
    });

    var startCheck = function(idNumber){

        // leadingCharChecker
        var the1stChecker = new leadingCharChecker();
        //numberChecker
        var the2ndChecker = new numberChecker();
        //numberValueChecker
        var the3rdChecker = new numberValueChecker();

        //chain of responsibility
        the1stChecker.setNextChecker(the2ndChecker).setNextChecker(the3rdChecker);

        var isValid = the1stChecker.check(idNumber);

        //test
        console.log('isValid = ' + isValid);
    }

    $('#reset').on('click', function(){
        $('#idNumber').val('');
        clearAllTheField();
    });

    var clearAllTheField = function(){
        $('#basicCheck').find('.isLegal, .isIllegal, .eachChar')
            .removeClass('isLegal')
            .removeClass('isIllegal')
            .removeClass('eachChar');
        $('#basicCheck > div > div').text('');

        $('div.charToValid, div.calculateResult').text('');
        $('div.processDetail').hide();

        $('#equivalentLine').removeClass();
        $('div.total').text('').hide();
        $('div.summaryReport').text('').hide();
        $('div.process').css('border-width', '0px');

        $('div.summaryReport').text('');
    }

    /*
        bind animation end event
    */
    $('#equivalentLine').on('animationend', function(){
        animationUtils.showTotalValue();
    });
});