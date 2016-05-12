'use strict';

var bs = require('browser-sync');
var plugins = require('require-dir')(__dirname + '/plugins');

Object.keys(plugins).forEach(function(key) {
	plugins[key](bs);
});

module.exports = bs;
