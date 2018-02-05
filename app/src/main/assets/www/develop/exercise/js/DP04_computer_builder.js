
(function(root, initFunc){
    root.animationUtils = initFunc(root.jQuery);

    root.animationUtils.fallPosMapping = [];
    root.animationUtils.fallPosMapping[1] = 'bottomLeft';
    root.animationUtils.fallPosMapping[2] = 'bottomRight';
    root.animationUtils.fallPosMapping[3] = 'topLeft';
    root.animationUtils.fallPosMapping[4] = 'topRight';

}(this, function($){
    var exports = {};

    /*
        prepare and let the device fall
    */
    exports.prepareDevice = function(id, animationClazz){

        var device = $('#' + id);

        // move the element at first and then set the src to show the diagram
        device.addClass(animationClazz);

        var src = '../../img/DP04/' + id + '.png';
        device.prop('src', src);
    }

    /*
        explode the device to build the computer
    */
    exports.explodeDevice = function (id){

        function buildCallback(){
            $(this).css('display', '');
        }
        $('#' + id).hide('explode', {pieces : 16}, 1000, buildCallback).prop('src', '').removeClass();
    }

    exports.getComputer = function (id){

        function getComputerCallback(){
            setTimeout(function(){
                $('#' + id).hide('slide', {}, 3000, function(){
                    $('#' + id).prop('src', '');
                });
            }, 2000);
        }
        $('#' + id).prop('src', '../../img/DP04/'+ id +'.png').show('explode', {pieces : 16}, 1000, getComputerCallback);
    }

    return exports;
}));

$(window).on('load', function(){
    /*
        builder interface
    */
    var builder = function(computerId){
        this.computerId = computerId;

        this.buildList = {};
        this.appearOrder = 1;
    }
    builder.prototype = {};

    builder.prototype.makeMonitor = function(monitorId){
        throw new TypeError('makeMonitor needs to be implemented');
    }
    builder.prototype.makeMouse = function(mouseId){
        throw new TypeError('makeMouse needs to be implemented');
    }
    builder.prototype.makeDesktop = function(desktopId){
        throw new TypeError('makeDesktop needs to be implemented');
    }
    builder.prototype.makeKeyboard = function(keyboardId){
        throw new TypeError('makeKeyboard needs to be implemented');
    }
    builder.prototype.getComputer = function(){
        throw new TypeError('getComputer needs to be implemented');
    }

    /*
        director
    */
    var director = function(builder){
        this.builder = builder;

        this.construct = function(monitorId, mouseId, desktopId, keyboardId){
            this.builder
            .makeMonitor(monitorId)
            .makeMouse(mouseId)
            .makeDesktop(desktopId)
            .makeKeyboard(keyboardId)
            .getComputer();
        }
    }

    /*
        implement and run
    */

    //builder01
    var builder01 = function(computerId){
        builder01.superConstructor.call(this, computerId);

        this.computerId = computerId;
        this.buildList = {};
        this.appearOrder = 1;
    }
    oopUtils.makeExtend(builder01, builder);

    builder01.prototype.makeMonitor = function(monitorId){
        this.buildList['monitorId'] = monitorId;
        return this;
    }
    builder01.prototype.makeMouse = function(mouseId){
        this.buildList['mouseId'] = mouseId;
        return this;
    }
    builder01.prototype.makeDesktop = function(desktopId){
        this.buildList['desktopId'] = desktopId;
        return this;
    }
    builder01.prototype.makeKeyboard = function(keyboardId){
        this.buildList['keyboardId'] = keyboardId;
        return this;
    }
    builder01.prototype.getComputer = function(){
        for(var key in this.buildList){
            var id = this.buildList[key];
            var fallPos = animationUtils.fallPosMapping[this.appearOrder];

            setTimeout(animationUtils.prepareDevice, this.appearOrder * 1000, id, fallPos);
            setTimeout(animationUtils.explodeDevice, (this.appearOrder + 4) * 1000, id);

            this.appearOrder++;

            //reset buildList
            delete this.buildList[key];
        }
        setTimeout(animationUtils.getComputer, (this.appearOrder + 5) * 1000, this.computerId);

        //reset appearOrder
        this.appearOrder = 1;
        return this;
    }

    //builder02
    var builder02 = function(computerId){
        builder02.superConstructor.call(this, computerId);

        this.computerId = computerId;
        this.buildList = {};
        this.appearOrder = 1;
    }
    oopUtils.makeExtend(builder02, builder);

    builder02.prototype.makeMonitor = function(monitorId){
        this.buildList['monitorId'] = monitorId;
        return this;
    }
    builder02.prototype.makeMouse = function(mouseId){
        this.buildList['mouseId'] = mouseId;
        return this;
    }
    builder02.prototype.makeDesktop = function(desktopId){
        this.buildList['desktopId'] = desktopId;
        return this;
    }
    builder02.prototype.makeKeyboard = function(keyboardId){
        this.buildList['keyboardId'] = keyboardId;
        return this;
    }
    builder02.prototype.getComputer = function(){
        for(var key in this.buildList){
            var id = this.buildList[key];
            var fallPos = animationUtils.fallPosMapping[this.appearOrder];

            setTimeout(animationUtils.prepareDevice, this.appearOrder * 1000, id, fallPos);
            setTimeout(animationUtils.explodeDevice, (this.appearOrder + 4) * 1000, id);

            this.appearOrder++;

            //reset buildList
            delete this.buildList[key];
        }
        setTimeout(animationUtils.getComputer, (this.appearOrder + 5) * 1000, this.computerId);

        //reset appearOrder
        this.appearOrder = 1;
        return this;
    }

    $('#buildComputer01').on('click', function(){
        var builder = new builder01('computer01');
        var dir = new director(builder);
        dir.construct('monitor01', 'mouse01', 'desktop01', 'keyboard01');
    });

    $('#buildComputer02').on('click', function(){
        var builder = new builder02('computer02');
        var dir = new director(builder);
        dir.construct('monitor02', 'mouse02', 'desktop02', 'keyboard02');
    });
});
