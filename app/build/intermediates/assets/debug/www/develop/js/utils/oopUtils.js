
(function(root, initFunc){
    root.oopUtils = initFunc(root.jQuery)

})(this, function($){
    var exports = {};

    exports.makeExtend = function(subClazz, superClazz){

        function prototypeContainer(){};
        prototypeContainer.prototype = superClazz.prototype;
        subClazz.prototype = new prototypeContainer();
        //這裡模擬繼承可能失敗 實驗結果 prototype是不會再有prototype可以搜尋function ??

        subClazz.prototype.constructor = subClazz;
        subClazz.superConstructor = superClazz;
        subClazz.superClazz = superClazz.prototype;
    }

    return exports;
});