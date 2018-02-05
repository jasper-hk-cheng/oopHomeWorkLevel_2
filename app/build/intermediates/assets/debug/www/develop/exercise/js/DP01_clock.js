
//假設你有一個類別 Clock，每一秒鐘會執行 onTick 一次
//另外有一個類別 DigitalClock，他接收 Clock 所傳過來的時分秒，並顯示在螢幕上

$(window).on('load', function(){

    /*
        start counting
    */
    $('#startCounting').on('click', function(){
        if(subjectClock){
            subjectClock.start();
        }
    });

    /*
        stop counting
    */
    $('#stopCounting').on('click', function(){
        if(subjectClock){
            subjectClock.stop();
            subjectClock.setTime(0);
        }
        if(the1stObserverClock){
            the1stObserverClock.setTime(0);
        }
        if(the2ndObserverClock){
            the2ndObserverClock.setTime(0);
        }
    });

    /*
        subject clock
    */
    var subjectClock = $('#subjectClock').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false,
        callbacks : {
            interval : function(){
                var time = this.factory.getTime().time;
                subjectClock.onTick(time);
            }
        }
    });

    subjectClock.allTheObserver = [];

    subjectClock.registerObserver = function(observer){

        var theNewLength = this.allTheObserver.push(observer);
        observer.setSubject(this);
    }

    subjectClock.onTick = function(time){
        this.allTheObserver.forEach(function(element, index, thisArray){

            element.setTime(time);

        }, undefined);
    }

    /*
        the 1st observer clock
    */
    var the1stObserverClock = $('#the1stObserverClock').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the1stObserverClock.setSubject = setSubject;

    /*
        the 2nd observer clock
    */
    var the2ndObserverClock = $('#the2ndObserverClock').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the2ndObserverClock.setSubject = setSubject;

    function setSubject(subject){
        this.subject = subject;
    }

    /*
        register the two observer
    */
    subjectClock.registerObserver(the1stObserverClock);
    subjectClock.registerObserver(the2ndObserverClock);
});