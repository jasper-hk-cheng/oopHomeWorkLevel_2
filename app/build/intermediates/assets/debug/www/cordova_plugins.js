cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.borismus.webintent.WebIntent",
    "file": "plugins/com.borismus.webintent/www/webintent.js",
    "pluginId": "com.borismus.webintent",
    "clobbers": [
      "WebIntent"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.borismus.webintent": "1.0.0",
  "cordova-plugin-splashscreen": "5.0.1",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});