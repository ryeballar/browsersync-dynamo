var bsUtil = require('browser-sync/lib/server/utils');

module.exports = function(bs) {

	var bsUtilGetServer = bsUtil.getServer;
	bsUtil.getServer = function(app, options) {

		var proxy = options.get('proxy');
		if(proxy && proxy.get('target')) {
			options.set('https', proxy.get('target').indexOf('https') === 0);
		}

		return bsUtilGetServer.call(bsUtil, app, options);

	};

};
