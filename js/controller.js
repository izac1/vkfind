var app = angular.module('webApp', ['webApp.service']);
app.controller('MyCtr', function($scope, API, $q) {

	$scope.ids = [{
		id: ''
	}, {
		id: ''
	}];
	$scope.sexx = [{
		id: 0,
		name: 'все'
	}, {
		id: 2,
		name: 'мужчины'
	}, {
		id: 1,
		name: 'женщины'
	}];
	//$scope.citys = [];
	//$scope.countrys = [];
	$scope.panel = false;
	$scope.error = false;
	var date = [];
	var f = false;
	$scope.add = function() {
		//console.log($scope.ids);
		if ($scope.ids.length == 4)
			return false;
		$scope.ids.push({
			id: '',
		});
	};

	$scope.find = function() {
		waitingDialog.show();
		$scope.error = false;
		if ($scope.panel == true) $scope.panel = false;
		var id = [];
		$scope.citys = [];
		$scope.countrys = [];
		promises = [];

		$scope.ids.forEach(function(obj) {
			obj.id = obj.id.replace(/^(https?|http):\/\/vk.com\//,'');
			id.push(obj.id.toLowerCase());
		});
		if(id[0] === "" || id[1] === ""){
			checkError("Введите как минимум id 2х человек для сравнения");
			return false;
		}

		API.Getids(id.toString()).then(function(res) {
			API.GetFrends(res).then(function(res) {
				API.GetObszFriend(res).then(function(resd) {
					getselectcountry(resd);
					getselectcity(resd, showform);
				});
			}, function(error) {
				checkError(error);
				//console.log(error);
			});
		}, function(error) {
			checkError(error);
			//console.log(error);
		});
	};

	function checkError(error){

		$scope.panel = false;
		$scope.error = error;
		waitingDialog.hide();
		
	};

	function getselectcity(peop, callback) {
		API.GetCity(peop).then(function(res) {
			res.forEach(function(reg) {
				if ($scope.citys.indexOf(reg) < 0)
					$scope.citys.push(reg);
			});
			callback(peop);
		}, function(error) {
			checkError(error);
			//console.log(error);
		});

	};

	function updcity(res) {
		var city = [];
		res.forEach(function(ress) {
			if (city.indexOf(ress.city) < 0)
				city.push(ress.city);
		});

		$scope.citys = city;
	};

	function showform(resd) {
		date = resd;
		if(resd.length === 0){
			checkError("Нет общих друзей");
			return false;
		}
		$scope.content = resd;
		$scope.panel = true;
		waitingDialog.hide();
	};

	function getselectcountry(peop) {
		API.GetCountry(peop).then(function(res) {
			res.forEach(function(reg) {
				if ($scope.countrys.indexOf(reg) < 0)
					$scope.countrys.push(reg);
			});


		}, function(error) {
			checkError(error);
			//console.log(error);

		});

	};

	$scope.changee = function() {
		$scope.content = date;

		if ($scope.country != null)
			$scope.ccountry();
		if ($scope.sex != null)
			$scope.csex();
		if ($scope.city != null)
			$scope.ccity();
	};

	$scope.csex = function() {
		var res = [];
		$scope.content.forEach(function(ress) {
			if ($scope.sex.id != 0) {
				if (ress.sex === $scope.sex.id)
					res.push(ress);
			} else
				res.push(ress);

		});
		updcity(res);
		$scope.content = res;
	}

	$scope.ccountry = function() {
		var res = [];
		$scope.content.forEach(function(ress) {
			if (ress.country === $scope.country)
				res.push(ress);
		});
		updcity(res);
		$scope.content = res;
	};

	$scope.ccity = function() {
		var res = [];
		if ($scope.city != null) {
			$scope.content.forEach(function(ress) {
				if (ress.city === $scope.city)
					res.push(ress);
			});
			$scope.content = res;
		}
	}
});