(function routeConfig() {

	module.exports = function() {

		var routeConfig = {

			route: {

				// application routes
				app: {

					// page routes
					view: {
						// page home
						pageHome: {
							id: 'page-home',
							name: 'home',
							url: '/index.html'
						}
					},

					// pwa
					pwa: {
						// offline
						pwaOffline: {
							id: 'pwa-offline',
							name: 'offline',
							url: '/pwa-offline.html'
						}
					}
				}

			}

		}

		console.log('route config loaded')
		return routeConfig
	}

})()
