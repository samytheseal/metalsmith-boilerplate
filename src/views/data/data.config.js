(function dataConfig() {

	// data dependencies
	const faker = require('faker');
	faker.locale = 'en_AU';

	module.exports = function() {

		var dataConfig = {

			data: {

				// application data
				app: {

					// global data
					global: {
						meta: {
							title: 'Castle Hill Homemaker Centre',
							description: 'Castle Hill Homemaker Centre.'
						}
					},

					// page data
					view: {
						// components page
						pageComponents: {
							conent: {
								title: 'h1 title test'
							},
							meta: {
								title: 'components page title',
								description: 'components page description'
							},
							pageComponents: true
						},
						// home page
						pageHome: {
							conent: {
								title: 'h1 title test'
							},
							meta: {
								title: 'home page title',
								description: 'home page description'
							},
							pageHome: true
						}
					},

					pwa: {
						// pwa offline
						pwaOffline: {
							conent: {
								title: 'pwa offline title'
							},
							meta: {
								title: 'Offline page title',
								description: 'Offline page description.'
							},
							pwaOffline: true
						}
					}

				},

				// component data
				component: {
				},

				// dummy data
				dummy: {
					commerce: {
						price: faker.commerce.price()
					},
					image: {
						abstract: faker.image.abstract()
					},
					lorem: {
						paragraph: faker.lorem.paragraph(),
						paragraphs: faker.lorem.paragraphs(),
						sentence: faker.lorem.sentence(),
						sentences: faker.lorem.sentences(),
						word: faker.lorem.word(),
						words: faker.lorem.words()
					},
					random: {
						number: faker.random.number()
					}
				},

			}

		};

		console.log('data config loaded');
		return dataConfig

	};

}());
