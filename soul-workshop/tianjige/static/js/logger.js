/**
 * 天机阁 · 轻量日志模块
 * 用法：Logger.log | Logger.warn | Logger.error | Logger.debug
 * debug 仅在 development 模式输出
 */
(function (global) {
  'use strict';

  var DEBUG = false;
  var PREFIX = '[天机阁]';

  function timestamp() {
    var d = new Date();
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function format(args) {
    /* eslint-disable no-console */
    return Array.prototype.map.call(args, function (a) {
      return typeof a === 'object' ? JSON.stringify(a) : String(a);
    }).join(' ');
  }

  var Logger = {
    log: function () {
      console.log(PREFIX + ' ' + timestamp(), format(arguments));
    },
    warn: function () {
      console.warn(PREFIX + ' ' + timestamp(), format(arguments));
    },
    error: function () {
      console.error(PREFIX + ' ' + timestamp(), format(arguments));
    },
    debug: function () {
      if (DEBUG) {
        console.debug(PREFIX + ' ' + timestamp(), format(arguments));
      }
    },
  };
  /* eslint-enable no-console */

  global.Tianjige = global.Tianjige || {};
  global.Tianjige.Logger = Logger;
})(typeof window !== 'undefined' ? window : global);
