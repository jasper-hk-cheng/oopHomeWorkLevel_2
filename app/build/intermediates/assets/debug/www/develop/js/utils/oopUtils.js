
(function(root, initFunc){
    root.oopUtils = initFunc(root.jQuery)

})(this, function($){
    var exports = {};

    exports.makeExtend = function(subClazz, superClazz){

        function prototypeContainer(){};
        prototypeContainer.prototype = superClazz.prototype;
        subClazz.prototype = new prototypeContainer();

        subClazz.prototype.constructor = subClazz;
        subClazz.superConstructor = superClazz;
        subClazz.superClazz = superClazz.prototype;
    }

    return exports;
});