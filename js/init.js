/*
	v.0.1.0-150305
		- Gestion des erreurs dans les notifications
		- Meilleure gestion du volume

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

	var get = $scope.get = function (command) {
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
	$scope.inputs = [
		{id: '04', name: 'DVD', 				icon: 'mdi-action-input'},
		{id: '25', name: 'BD', 				icon: 'mdi-action-input'},
		{id: '05', name: 'TV/SAT', 			icon: 'mdi-hardware-tv'},
		{id: '15', name: 'DVR/BDR', 			icon: 'mdi-device-dvr'},
		{id: '10', name: 'VIDEO 1', 			icon: 'mdi-action-input'},
		{id: '14', name: 'VIDEO 2', 			icon: 'mdi-action-input'},
		{id: '19', name: 'HDMI 1', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '20', name: 'HDMI 2', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '21', name: 'HDMI 3', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '22', name: 'HDMI 4', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '23', name: 'HDMI 5', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '26', name: 'HOME MEDIA GALLERY(Internet Radio)', icon: 'mdi-image-camera-roll'},
		{id: '22', name: 'HDMI 4', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '23', name: 'HDMI 5', 			icon: 'mdi-action-settings-input-hdmi'},
		{id: '17', name: 'iPod/USB', 		icon: 'mdi-device-usb'},
		{id: '18', name: 'XM RADIO', 		icon: 'mdi-action-input'},
		{id: '01', name: 'CD', 				icon: 'mdi-action-input'},
		{id: '03', name: 'CD-R/TAPE', 		icon: 'mdi-action-input'},
		{id: '02', name: 'TUNER', 			icon: 'mdi-av-radio'},
		{id: '00', name: 'PHONO', 			icon: 'mdi-action-input'},
		{id: '12', name: 'MULTI CH IN ', 	icon: 'mdi-action-settings-input-composite'},
		{id: '33', name: 'ADAPTER PORT', 	icon: 'mdi-action-input'},
		{id: '27', name: 'SIRIUS', 			icon: 'mdi-action-input'},
		{id: '31', name: 'HDMI (cyclic)', 	icon: 'mdi-action-settings-input-hdmi'}
	];

	console.log($scope.inputs);

	$scope.power = false;

	$scope.volume = {
		isdB: true,
		value: 0,
		raw: 0
	};

	get('query_power');
	get('query_input');
	get('query_volume');

	var response2scope = function (command, response) {
		var volumeValue = function (raw) {
			$scope.volume.raw = raw;

			if ($scope.volume.isdB) {
				var val = ((raw-161)/2);
				$scope.volume.value = val+' dB';
			} else {
				$scope.volume.value = (raw/2)-0.5;
			}
		};

		response = response.replace(/(\r\n|\n|\r)/gm,"");
		command = command.split('&')[0];
		console.log(command);
		console.log(response);

		switch (command) {
			case 'query_power':			
				if (response == '0PWR0') { $scope.power = true; } else { $scope.power = false; }
				break;
			case 'set_input':
			case 'query_input':
				switch (response) {
					case '0FN04': $scope.video.current = 'DVD'; break;
					case '0FN25': $scope.video.current = 'BD'; break;
					case '0FN05': $scope.video.current = 'TV/SAT'; break;
					case '0FN15': $scope.video.current = 'DVR/BDR'; break;
					case '0FN10': $scope.video.current = 'VIDEO 1'; break;
					case '0FN14': $scope.video.current = 'VIDEO 2'; break;
					case '0FN19': $scope.video.current = 'HDMI 1'; break;
					case '0FN20': $scope.video.current = 'HDMI 2'; break;
					case '0FN21': $scope.video.current = 'HDMI 3'; break;
					case '0FN22': $scope.video.current = 'HDMI 4'; break;
					case '0FN23': $scope.video.current = 'HDMI 5'; break;
					case '0FN26': $scope.video.current = 'HOME MEDIA GALLERY(Internet Radio)'; break;
					case '0FN22': $scope.video.current = 'HDMI 4'; break;
					case '0FN23': $scope.video.current = 'HDMI 5'; break;
					case '0FN17': $scope.video.current = 'iPod/USB'; break;
					case '0FN18': $scope.video.current = 'XM RADIO'; break;
					case '0FN01': $scope.video.current = 'CD'; break;
					case '0FN03': $scope.video.current = 'CD-R/TAPE'; break;
					case '0FN02': $scope.video.current = 'TUNER'; break;
					case '0FN00': $scope.video.current = 'PHONO'; break;
					case '0FN12': $scope.video.current = 'MULTI CH IN '; break;
					case '0FN33': $scope.video.current = 'ADAPTER PORT'; break;
					case '0FN27': $scope.video.current = 'SIRIUS'; break;
					case '0FN31': $scope.video.current = 'HDMI (cyclic)'; break;
					default:
						$scope.video.current = 'N/A';
				}

				/*

				case '0FN26': $scope.video.current = 'HOME MEDIA GALLERY(Internet Radio)'; break;
				case '0FN22': $scope.video.current = 'HDMI 4'; break;
				case '0FN23': $scope.video.current = 'HDMI 5'; break;
				case '0FN17': $scope.video.current = 'iPod/USB'; break;
				case '0FN18': $scope.video.current = 'XM RADIO'; break;
				case '0FN01': $scope.video.current = 'CD'; break;
				case '0FN03': $scope.video.current = 'CD-R/TAPE'; break;
				case '0FN02': $scope.video.current = 'TUNER'; break;
				case '0FN00': $scope.video.current = 'PHONO'; break;
				case '0FN12': $scope.video.current = 'MULTI CH IN '; break;
				case '0FN33': $scope.video.current = 'ADAPTER PORT'; break;
				case '0FN27': $scope.video.current = 'SIRIUS'; break;
				case '0FN31': $scope.video.current = 'HDMI (cyclic)'; break;

				*/
				break;
			case 'query_volume':
			case 'volume_up':
			case 'volume_down':
				volumeValue(parseInt(response.replace('0VOL', ''), 10))
				break;
			default:
				break;
		}
		var cssClass = 'mdi-action-done green-text';
		if (response.substring(0,3) == 'ERR') {	cssClass = 'mdi-alert-error red-text'; }
		toast('<span><i class="'+cssClass+' right"></i> '+command+':'+response+'</span>', 4000);
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