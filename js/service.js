let app_code = "2e8a0c762e8a0c762ed34fdbfb2eb7b9e422e8a2e8a0c76763e1f0796c6a43177c7d812"; //insert your app code from vk.com
let api_version = "5.81";// vk api version
angular.module('webApp.service', [])

.factory('API', function($http, $q) {


	return {
		Getids: function(id) {
			var data = [];
			
			var deferred = $q.defer();
			$http.jsonp("https://api.vk.com/method/users.get", {
					params: {
						user_ids: id,
						callback: 'JSON_CALLBACK',
						access_token: app_code,
						v:api_version
					},
				})
				.success(function(res) {
					if (res.error) {
						
						return deferred.reject(res.error);
					}
					//console.log(res);
					res.response.forEach(function(ent) {
						//
						data.push(ent.id);
					});

					deferred.resolve(data);
				});

			return deferred.promise;
		},
		GetFrends: function(ids) {
			var data = [];
			var promises = [];
			ids.forEach(function(ent) {
				var deferred = $q.defer();
				$http.jsonp("https://api.vk.com/method/friends.get", {
						params: {
							user_id: ent,
							order: "name",
							fields: "city,sex,country,photo_100",
							callback: 'JSON_CALLBACK',
							access_token: app_code,
							v:api_version
						},
					})
					.success(function(res) {
						if (res.error) {
							return deferred.reject(res.error);
						}
						deferred.resolve(res.response);

					});
				promises.push(deferred.promise);
			});
			return $q.all(promises);

		},
		GetObszFriend: function(frie) {
			var deferred = $q.defer();
			switch (frie.length) {
				case 2:
					deferred.resolve(getF2(frie[0].items, frie[1].items));
					break;
				case 3:
					deferred.resolve(getF2(getF2(frie[0].items, frie[1].items), frie[2].items));
					break;
				case 4:
					deferred.resolve(getF2(getF2(frie[0].items, frie[1].items), getF2(frie[2].items, frie[3].items)));
					break;
			}
			return deferred.promise;

			function getF2(a, b) {
				
				var res = [];

				a.map(function(p) {
					b.map(function(p2) {
						if (p.id == p2.id && (p.deactivated == undefined && p2.deactivated == undefined))
						//console.log(men);
							res.push(p);
						else
							return;
					});
				});
				return res;
			}

		},
		GetCity: function(user) {
			var promise = [];
			user.forEach(function(ress) {
				var deferred = $q.defer();
				$http.jsonp("https://api.vk.com/method/database.getCitiesById", {
						params: {
							city_ids: ress.city,
							callback: 'JSON_CALLBACK',
							access_token: app_code,
							v:api_version
						},
					})
					.success(function(res) {
						if (res.error) {
							return deferred.reject(res.error);
						}
						console.log(res);
						if (res.response[0] === undefined) {
							res.response = "Город не указан";
							ress.city = res.response;
							deferred.resolve(res.response);
						} else {
							deferred.resolve(res.response[0].title);
							ress.city = res.response[0].title;
						}
					});
				promise.push(deferred.promise);
			});
			return $q.all(promise);


		},

		GetCountry: function(user) {
			var promise = [];
			user.forEach(function(ress) {
				var deferred = $q.defer();
				$http.jsonp("https://api.vk.com/method/database.getCountriesById", {
						params: {
							country_ids: ress.country,
							callback: 'JSON_CALLBACK',
							access_token: app_code,
							v:api_version
						},
					})
					.success(function(res) {
						if (res.error) {
							return deferred.reject(res.error);
						}
						if (res.response[0] === undefined) {
							res.response = "Страна не указана";
							ress.country = res.response;
							deferred.resolve(res.response);
						} else {
							deferred.resolve(res.response[0].title);
							ress.country = res.response[0].title;
						}
					});
				promise.push(deferred.promise);
			});
			return $q.all(promise);


		}

	};
});
