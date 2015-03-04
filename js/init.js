(function($){
	$(function(){

		$('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space



var pioneerApp = angular.module('pioneerApp', []);

pioneerApp.controller('AmpliCtrl', function ($scope) {
	var get = function (command) {
		var response = '';

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {

			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				response = xmlhttp.responseText;

				response2scope(command, response);
			} else {
				// Erreur
			}
		}

		xmlhttp.open("GET", 'lib/index.php?do=' + command,true);
		xmlhttp.send();
	};
	$scope.appTitle = "VSX-527";
	$scope.video = {
		current: '...'
	};
	$scope.power = false;

	$scope.volume = {
		value: 0
	};

	get('query_power');
	get('query_input');

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
			default:
				break;
		}

		$scope.$apply();
	};



	$scope.togglePanel =  function (item) {
		$scope.panelVideo = false;
		$scope.panelVolume = false;

		switch(item) {
			case 'input':
				$scope.panelVideo = true;
				break;
			case 'volume':
				$scope.panelVolume = true;
				break;
			default:
				break;
		}
	};

});