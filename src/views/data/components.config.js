(function componentsConfig() {

	module.exports = function() {

		var componentsConfig = {

			component: {

				// test
				test: {
					assets: {
						css: [
							'test1',
							'test2'
						],
						js: [
							'test1'
						]
					},
					class: {
						css: 'test',
						js: 'jsTest'
					},
					data: {
						foo: 'bar',
						test: 'testy'
					},
					name: 'test',
					partial: 'components/test',
					variants: {
						test2: {
							class: {
								css: 'test2'
							},
							data: {
								sam: 'test'
							},
							name: 'test2',
							test2: true,
							variant: true
						}
					}
				}

			}

		}

		console.log('components config loaded')
		return componentsConfig

	}

})()
