
//假設你有一個類別 Clock，每一秒鐘會執行 onTick 一次
//另外有一個類別 DigitalClock，他接收 Clock 所傳過來的時分秒，並顯示在螢幕上

//延續作業#1，加上主題的功能

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
        if(the1st5sSub){
            the1st5sSub.setTime(0);
        }
        if(the2nd5sSub){
            the2nd5sSub.setTime(0);
        }
        if(the1st2sSub){
            the1st2sSub.setTime(0);
        }
        if(the2nd2sSub){
            the2nd2sSub.setTime(0);
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

    //TODO set topicPer5s and topicPer2s to let subjectClock aggregate the two object

    subjectClock.onTick = function(time){
        if(topicPer5s){
            if(time > 0 && time % 5 == 0){
                topicPer5s.fire(time);
            }
        }
        if(topicPer2s){
            if(time > 0 && time % 2 == 0){
                topicPer2s.fire(time);
            }
        }
    };

    /*
        the1st5sSub
    */
    var the1st5sSub = $('#the1st5sSub').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the1st5sSub.updateTime = function(time){
        the1st5sSub.setTime(time);
    }

    /*
        the2nd5sSub
    */
    var the2nd5sSub = $('#the2nd5sSub').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the2nd5sSub.updateTime = function(time){
        the2nd5sSub.setTime(time);
    }

    /*
        the1st2sSub
    */
    var the1st2sSub = $('#the1st2sSub').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the1st2sSub.updateTime = function(time){
        the1st2sSub.setTime(time);
    }

    /*
        the2nd2sSub
    */
    var the2nd2sSub = $('#the2nd2sSub').FlipClock({
        clockFace : 'MinuteCounter',
        autoStart : false
    });
    the2nd2sSub.updateTime = function(time){
        the2nd2sSub.setTime(time);
    }

    /*
        create two topics and register two subscriber respectively......
    */
    var topicPer5s = $.Callbacks('unique').add(the1st5sSub.updateTime).add(the2nd5sSub.updateTime);
    var topicPer2s = $.Callbacks('unique').add(the1st2sSub.updateTime).add(the2nd2sSub.updateTime);
});
