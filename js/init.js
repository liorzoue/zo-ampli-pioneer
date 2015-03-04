/*
	v.0.1.0-150304
		- Pile des requetes AJAX
		- Ameliorations graphiques (responsive)
		- Gestion du volume (dB / Volume affiche sur l'appareil)
		- Correction de l'affichage des badges actifs
		- Autres evolutions liées aux premieres versions ... :)

	v.0.0
		- Premiere version
		- Requetes telnet en PHP
		- Base : Framework MaterializeCSS + AngularJS
*/


$.AjaxQueue = function() {
  this.reqs = [];
  this.requesting = false;
};
$.AjaxQueue.prototype = {
  add: function(req) {
    this.reqs.push(req);
    this.next();
  },
  next: function() {
    if (this.reqs.length == 0)
      return;
 
    if (this.requesting == true)
      return;
 
    var req = this.reqs.splice(0, 1)[0];
    var complete = req.complete;
    var self = this;
    if (req._run)
      req._run(req);
    req.complete = function() {
      if (complete)
        complete.apply(this, arguments);
      self.requesting = false;
      self.next();
    }
 
    this.requesting = true;
    $.ajax(req);
  }
};

var pioneerApp = angular.module('pioneerApp', []);

pioneerApp.controller('AmpliCtrl', function ($scope) {
	var queue = new $.AjaxQueue();

	var get = function (command) {
		queue.add({
			url: 'lib/index.php?do='+command,
			complete: function () {
				var xmlhttp = arguments[0];
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					var ret = xmlhttp.responseText;
					response2scope(command, ret);
				}
			}
		})
	};

	$scope.version = '';
	$scope.appTitle = "VSX-527";
	$scope.video = {
		current: '...'
	};
	$scope.power = false;

	$scope.volume = {
		isdB: true,
		value: 0,
		progress: 0
	};

	get('query_power');
	get('query_input');
	get('query_volume');

	var response2scope = function (command, response) {

		response = response.replace(/(\r\n|\n|\r)/gm,"");

		console.log(command);
		console.log(response);

		switch (command) {
			case 'query_power':			
				if (response == '0PWR0') { $scope.power = true; } else { $scope.power = false; }
				break;
			case 'query_input':
				switch (response) {
					case '0FN04':
						$scope.video.current = 'DVD';
						break;
					case '0FN25':
						$scope.video.current = 'BD';
						break;
					case '0FN05':
						$scope.video.current = 'TV/SAT';
						break;
					case '0FN15':
						$scope.video.current = 'DVR/BDR';
						break;
					case '0FN10':
						$scope.video.current = 'VIDEO 1';
						break;
					case '0FN14':
						$scope.video.current = 'VIDEO 2';
						break;
					case '0FN19':
						$scope.video.current = 'HDMI 1';
						break;
					case '0FN20':
						$scope.video.current = 'HDMI 2';
						break;
					case '0FN21':
						$scope.video.current = 'HDMI 3';
						break;
					case '0FN22':
						$scope.video.current = 'HDMI 4';
						break;
					case '0FN23':
						$scope.video.current = 'HDMI 5';
						break;
					default:
						$scope.video.current = 'N/A';
				}

				/*

				22: HDMI 4 ○ ○ ○○ ○ ○ ○ ×
				23: HDMI 5 ○(Front) ○(Front) ○(Front) ○(Front)r○(Front) ○(Front) ×
				26: HOME MEDIA GALLERY(Internet Radio) ○ ○ ○○ ○ ○○○
				17: iPod/USB ○ ○ ○○ ○ ○○○
				18: XM RADIO ○ ○ ○○ ○ ○ × ×
				01: CD ○ ○ ○○ ○ ○○○
				03: CD-R/TAPE ○ ○ ○○ ○ ○○○
				02: TUNER ○ ○ ○○ ○ ○○○
				00: PHONO ○ ○ × × × ×××
				12: MULTI CH IN ○ ○ × × × ×××
				33: ADAPTER PORT ○ ○ ○○ ○ ○○○
				27: SIRIUS ○ ○ ○○ ○ ○○○
				31: HDMI (cyclic)

				*/
				break;
			case 'query_volume':
				response = response.replace('0VOL', '');
				if ($scope.volume.isdB) {
					var val = ((parseInt(response, 10)-161)/2);
					$scope.volume.value = val+' dB';
				} else {
					$scope.volume.value = (parseInt(response, 10)/2)-0.5;
				}
				break;
			default:
				break;
		}
		toast(command+':'+response, 4000)
		$scope.$apply();
	};

	$scope.toggledb = function () {
		$scope.volume.isdB = !$scope.volume.isdB;
		get('query_volume');
	};

	$scope.togglePanel =  function (item) {
		$scope.panelVideo = false;
		$scope.panelVolume = false;

		switch(item) {
			case 'input':
				get('query_input');
				$scope.panelVideo = true;
				break;
			case 'volume':
				$scope.panelVolume = true;
				get('query_volume');
				break;
			default:
				break;
		}
	};

});