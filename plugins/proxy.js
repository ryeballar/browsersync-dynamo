var fs = require('fs');
var _ = require('lodash');

var compiled = _.template(fs.readFileSync(__dirname + '/proxy.html'));
var id = 'bs-' + Math.random().toString(36).substr(2);

module.exports = function(bs) {

	var bsCreate = bs.create;

	bs.create = function() {

		var instance = bsCreate.apply(bs, arguments);
		var instanceInit = instance.init;

		var reload = function() {
			setTimeout(function() {
				instance.reload();
			}, 3000);
		};

		instance.init = function(config) {

			if(config.dynamicproxy) {

				if(['undefined', 'string'].indexOf(typeof config.proxy) >= 0) {
					config.proxy = {
						target: config.dynamicproxy.targets[0]
					};
				}

				config.proxy.middleware = function(req, res, next) {

					var url;

					if(req.url.indexOf(id) >= 0) {

						url = decodeURIComponent(req.url.split('=').pop());
						config.proxy.target = url;
						instance.exit();
						instance.init(config);

					} else {

						next();

					}


				};

				config.snippetOptions = {

					rule: {
						match: /<\/body>/i,
						fn: function (snippet, match) {
							var proxies = config.dynamicproxy.targets.filter(function(target) {
								return config.proxy.target.indexOf(target) < 0;
							});
							return snippet +
								compiled({
									proxies: proxies,
									id: id,
									event: _.assign({
										name: 'keydown',
										trigger: function(e) {
											return e.ctrlKey && e.keyCode === 222;
										}
									}, config.dynamicproxy.event)
								}) +
								match;
						}
					}

				};

			}

			if(config.proxy) {
				config.https = isHttps(
					typeof config.proxy === 'string'?
						config.proxy: config.proxy.target
				);
			}

			reload();

			return instanceInit.apply(instance, arguments);

		};

		return instance;


	};


};

function isHttps(target) {
	return target.indexOf('https') === 0;
}
