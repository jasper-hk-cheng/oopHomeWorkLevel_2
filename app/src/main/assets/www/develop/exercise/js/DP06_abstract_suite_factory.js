
(function(root, initFunc){
    root.animationUtils = initFunc(root.jQuery);

    /*
        bind the animation end event
    */
    $('img[id^="pokemon"]:not([id$="Factory"])').each(function(index, element){
        root.animationUtils.bindAnimationEndEvent($(element).prop('id'));
    });
    $('img[id^="warCraft"]:not([id$="Factory"])').each(function(index, element){
        root.animationUtils.bindAnimationEndEvent($(element).prop('id'));
    });

})(this, function($){
    var exports = {};

    exports.suiteStorage = {};

    exports.shootCreateAnimation = function(suiteObject){

        var id = suiteObject.constructor.name;

//      register the suite object to animation event
        exports.suiteStorage[id] = suiteObject;

        //trigger the animation
        $('#' + id).prop('src', '../../img/DP06/'+ id +'.png').css('animation-name', suiteObject.animationName);
    }

    exports.bindAnimationEndEvent = function(id){

        $('#' + id).on('animationend', function(){

            var suiteObject = exports.suiteStorage[id];
            var descArray = suiteObject.createDesc();
            $.each(descArray, function(index, element){

                $('#' + suiteObject.animationName).append(element);

                // hide immediately
                element.css('display', 'none');

                // show later
                setTimeout(function(){
                    $(element).fadeIn(100, 'swing');
                }, index * 100);
            });
        });
    }

    return exports;
});


$(window).on('load', function(){

    /*
        abstract factory
    */
    var abstractFactory = function(){

        this.getFactory = function(clazzName){

            var theFactory = null;
            try{
                switch(clazzName){

                case 'pokemonFactory':

                    //test window['pokemonFactory'].call(this);

                    theFactory = new pokemonFactory();
                    break;

                case 'warCraftFactory':
                    theFactory = new warCraftFactory();
                    break;

                default:
                    throw new TypeError('factory name error!!');
                }

            }catch(err){
                alert('error occurred when get abstract factory - ' + err.name + ' - ' + err.message);
            }
            return theFactory;
        }
    }
    abstractFactory.prototype = {};

    abstractFactory.prototype.createHat = function(name, defense){
        throw new ReferenceError('createHat need to be implemented !!');
    }
    abstractFactory.prototype.createHelmet = function(name, defence){
        throw new ReferenceError('createHelmet need to be implemented !!');
    }
    abstractFactory.prototype.createArmor = function(name, thick, defence){
        throw new ReferenceError('createArmor need to be implemented !!');
    }
    abstractFactory.prototype.createBoot = function(name, speed){
        throw new ReferenceError('createBoot need to be implemented !!');
    }
    abstractFactory.prototype.createWeapon = function(name, speed, attack, defence){
        throw new ReferenceError('createWeapon need to be implemented !!');
    }

    /*
        pokemon factory
    */
    var pokemonFactory = function (){
        pokemonFactory.superConstructor.call(this);
    }
    oopUtils.makeExtend(pokemonFactory, abstractFactory);

    pokemonFactory.prototype.createHat = function(name, defense){
        var hat = new pokemonHat(name, defense);
        animationUtils.shootCreateAnimation(hat);
        return hat;
    }
    pokemonFactory.prototype.createHelmet = function(name, defense){
        var helmet = new pokemonHelmet(name, defense);
        animationUtils.shootCreateAnimation(helmet);
        return helmet;
    }
    pokemonFactory.prototype.createArmor = function(name, thick, defense){
        var armor = new pokemonArmor(name, thick, defense);
        animationUtils.shootCreateAnimation(armor);
        return armor;
    }
    pokemonFactory.prototype.createBoot = function(name, speed){
        var boot = new pokemonBoot(name, speed);
        animationUtils.shootCreateAnimation(boot);
        return boot;
    }
    pokemonFactory.prototype.createWeapon = function(name, speed, attack, defense){
        var weapon = new pokemonWeapon(name, speed, attack, defense);
        animationUtils.shootCreateAnimation(weapon);
        return weapon;
    }

    /*
        warCraft factory
    */
    var warCraftFactory = function(){
        warCraftFactory.superConstructor.call(this);
    }
    oopUtils.makeExtend(warCraftFactory, abstractFactory);

    warCraftFactory.prototype.createHat = function(name, defense){
        var hat = new warCraftHat(name, defense);
        animationUtils.shootCreateAnimation(hat);
        return hat;
    }
    warCraftFactory.prototype.createHelmet = function(name, defense){
        var helmet = new warCraftHelmet(name, defense);
        animationUtils.shootCreateAnimation(helmet);
        return helmet;
    }
    warCraftFactory.prototype.createArmor = function(name, thick, defense){
        var armor = new warCraftArmor(name, thick, defense);
        animationUtils.shootCreateAnimation(armor);
        return armor;
    }
    warCraftFactory.prototype.createBoot = function(name, speed){
        var boot = new warCraftBoot(name, speed);
        animationUtils.shootCreateAnimation(boot);
        return boot;
    }
    warCraftFactory.prototype.createWeapon = function(name, speed, attack, defense){
        var weapon = new warCraftWeapon(name, speed, attack, defense);
        animationUtils.shootCreateAnimation(weapon);
        return weapon;
    }

    /*
        abstract suite
    */
    var abstractSuite = function(name){
        this.name = name;
    }
    abstractSuite.prototype = {};

    abstractSuite.prototype.createDesc = function(){
        throw new ReferenceError('createDesc need to be implemented !!');
    }

    /*
        pokemon serial suite
    */

    var pokemonHat = function(name, defense){
        pokemonHat.superConstructor.call(this, name);

        this.name = name;
        this.defense = defense;

        this.animationName = 'toTopLeft';
    }
    oopUtils.makeExtend(pokemonHat, abstractSuite);

    pokemonHat.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var defenseLabel =  $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var pokemonHelmet = function(name, defense){
        pokemonHelmet.superConstructor.call(this, name);

        this.name = name;
        this.defense = defense;

        this.animationName = 'toTopRight';
    }
    oopUtils.makeExtend(pokemonHelmet, abstractSuite);

    pokemonHelmet.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var pokemonArmor = function(name, thick, defense){
        pokemonArmor.superConstructor.call(this, name);

        this.name = name;
        this.thick = thick;
        this.defense = defense;

        this.animationName = 'toBottomLeft';
    }
    oopUtils.makeExtend(pokemonArmor, abstractSuite);

    pokemonArmor.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var thickLabel = $('<div class="suiteSpec">').text('thick : ' + this.thick);
        labelArray.push(thickLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var pokemonBoot = function(name, speed){
        pokemonBoot.superConstructor.call(this, name);

        this.name = name;
        this.speed = speed;

        this.animationName = 'toBottomMiddle';
    }
    oopUtils.makeExtend(pokemonBoot, abstractSuite);

    pokemonBoot.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var speedLabel = $('<div class="suiteSpec">').text('speed : ' + this.speed);
        labelArray.push(speedLabel);

        return labelArray;
    }

    var pokemonWeapon = function(name, speed, attack, defense){
        pokemonWeapon.superConstructor.call(this, name);

        this.name = name;
        this.speed = speed;
        this.attack = attack;
        this.defense = defense;

        this.animationName = 'toBottomRight';
    }
    oopUtils.makeExtend(pokemonWeapon, abstractSuite);

    pokemonWeapon.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var speedLabel = $('<div class="suiteSpec">').text('speed : ' + this.speed);
        labelArray.push(speedLabel);

        var attackLabel = $('<div class="suiteSpec">').text('attack : ' + this.attack);
        labelArray.push(attackLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    /*
        warCraft serial suite
    */

    var warCraftHat = function(name, defense){
        warCraftHat.superConstructor.call(this, name);

        this.name = name;
        this.defense = defense;

        this.animationName = 'toTopLeft';
    }
    oopUtils.makeExtend(warCraftHat, abstractSuite);

    warCraftHat.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(''+this.name);
        labelArray.push(nameLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var warCraftHelmet = function(name, defense){
        warCraftHelmet.superConstructor.call(this, name);

        this.name = name;
        this.defense = defense;

        this.animationName = 'toTopRight';
    }
    oopUtils.makeExtend(warCraftHelmet, abstractSuite);

    warCraftHelmet.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var warCraftArmor = function(name, thick, defense){
        warCraftArmor.superConstructor.call(this, name);

        this.name = name;
        this.thick = thick;
        this.defense = defense;

        this.animationName = 'toBottomLeft';
    }
    oopUtils.makeExtend(warCraftArmor, abstractSuite);

    warCraftArmor.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var thickLabel = $('<div class="suiteSpec">').text('thick : ' + this.thick);
        labelArray.push(thickLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    var warCraftBoot = function(name, speed){
        warCraftBoot.superConstructor.call(this, name);

        this.name = name;
        this.speed = speed;

        this.animationName = 'toBottomMiddle';
    }
    oopUtils.makeExtend(warCraftBoot, abstractSuite);

    warCraftBoot.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var speedLabel = $('<div class="suiteSpec">').text('speed : ' + this.speed);
        labelArray.push(speedLabel);

        return labelArray;
    }

    var warCraftWeapon = function(name, speed, attack, defense){
        warCraftWeapon.superConstructor.call(this, name);

        this.name = name;
        this.speed = speed;
        this.attack = attack;
        this.defense = defense;

        this.animationName = 'toBottomRight';
    }
    oopUtils.makeExtend(warCraftWeapon, abstractSuite);

    warCraftWeapon.prototype.createDesc = function(){
        var labelArray = [];

        var nameLabel = $('<div class="suiteName">').text(this.name);
        labelArray.push(nameLabel);

        var speedLabel = $('<div class="suiteSpec">').text('speed : ' + this.speed);
        labelArray.push(speedLabel);

        var attackLabel = $('<div class="suiteSpec">').text('attack : ' + this.attack);
        labelArray.push(attackLabel);

        var defenseLabel = $('<div class="suiteSpec">').text('defense : ' + this.defense);
        labelArray.push(defenseLabel);

        return labelArray;
    }

    /*
        testing code snippet is here, and all the factory class and production class was defined below...
    */
    var absFactory = new abstractFactory();
    var pFactory = absFactory.getFactory('pokemonFactory');
    var wFactory = absFactory.getFactory('warCraftFactory');

    $('#startPokemon').on('click', function(event){

        cleanAllProduction();

        setTimeout(pFactory.createHat, 0, 'pokeHat', '+15');
        setTimeout(pFactory.createHelmet, 200, 'pokeHelmet', '+20');
        setTimeout(pFactory.createArmor, 400, 'pokeArmor', 15, '+30');
        setTimeout(pFactory.createBoot, 600, 'pokeBoot', '+60');
        setTimeout(pFactory.createWeapon, 800, 'pokeWeapon', '+10', '+50', '-10');
    });

    $('#startWarCraft').on('click', function(event){

        cleanAllProduction();

        setTimeout(wFactory.createHat, 0, 'warHat', '+30');
        setTimeout(wFactory.createHelmet, 200, 'warHelmet', '+45');
        setTimeout(wFactory.createArmor, 400, 'warArmor', 20, '+50');
        setTimeout(wFactory.createBoot, 600, 'warBoot', '+80');
        setTimeout(wFactory.createWeapon, 800, 'warWeapon', '+15', '+60', '-15');
    });

    function cleanAllProduction(){
        $('img[id^="pokemon"]:not([id$="Factory"])').prop('src', '').css('animation-name', '');
        $('img[id^="warCraft"]:not([id$="Factory"])').prop('src', '').css('animation-name', '');
        $('div[id^="toTop"]').empty();
        $('div[id^="toBottom"]').empty();
    }
});