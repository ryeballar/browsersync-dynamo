var httpolyglot = require('httpolyglot');
var bsUtil = require('browser-sync/lib/server/utils');
var connectUtils = require('browser-sync/lib/connect-utils');

module.exports = function(bs) {

	var bsUtilGetServer = bsUtil.getServer;
	bsUtil.getServer = function(app, options) {

		if(options.get('httpolyglot')) {
			return {
				server: httpolyglot.createServer(bsUtil.getKeyAndCert(options), app),
				app
			};
		}

		return bsUtilGetServer.call(bsUtil, app, options);

	};

	// var getConnectionUrl = connectUtils.getConnectionUrl;
	// connectUtils.getConnectionUrl = function(options) {
	// 	var result = getConnectionUrl.call(this, options);
    //
	// 	if(options.get('httpolyglot')) {
	// 		result = result.replace(/https/g, 'http');
	// 	}
    //
	// 	return result;
	// };

};
