<?php
// PHP EEDOMUS Framework for Pioneer HomeCinema VSX series with Ethernet (Can work with RS232)
// Author Clems01
// 
require_once "php-telnet.php";
// Set here your pioneer IP device
$PioneerIP = '192.168.3.1';
$Command = 'empty';
/********** Send commands **********/
// We get back the argument
if (isset($_GET['do']) && ($_GET['do'] != null))
	$do = $_GET['do'];

if (isset($do))
{
	switch ($do)
	{
		// Some examples of commands with Pioneer vsx921
		case "power_on" :
		{$Command = 'PO';break;}
		
		case "power_off" :
		{$Command = 'PF';break;}
		
		case "volume_up" :
		{$Command = 'VU';break;}
		
		case "volume_down" :
		{$Command = 'VD';break;}
		
		case "set_volume_to_30db" :
		{$Command = '101VL';break;}
		
		case "set_volume_to_40db" :
		{$Command = '081VL';break;}
		
		case "set_volume_to_50db" :
		{$Command = '061VL';break;}
		
		case "mute_on" :
		{$Command = 'MO';break;}
		
		case "mute_off" :
		{$Command = 'MF';break;}
		
		/* INPUTS */
		/*
		05FN = TV/SAT
		01FN = CD
		03FN = CD-R/TAPE
		04FN = DVD
		19FN = HDMI1
		05FN = TV/SAT
		00FN = PHONO
		03FN = CD-R/TAPE
		26FN = HOME MEDIA GALLERY(Internet Radio)
		15FN = DVR/BDR
		05FN = TV/SAT
		10FN = VIDEO 1(VIDEO)
		14FN = VIDEO 2
		19FN = HDMI1
		20FN = HDMI2
		21FN = HDMI3
		22FN = HDMI4
		23FN = HDMI5
		24FN = HDMI6
		25FN = BD
		17FN = iPod/USB
		FU = INPUT CHANGE (cyclic)
		?F = QUERY INPUT
		*/	
		case "input_BD" :
		{$Command = '25FN';break;}
		
		case "input_video1" :
		{$Command = '10FN';break;}
		
		case "input_video2" :
		{$Command = '14FN';break;}
		
		case "input_DVD" :
		{$Command = '04FN';break;}
		
		case "input_tuner" :
		{$Command = '02FN';break;}

		case "input_tv" :
		{$Command = '05FN';break;}

		case "input_next" :
		{$Command = 'FU';break;}

		case "input_prev" :
		{$Command = 'FD';break;}

		case "listening_DPLII_MOVIE" :
		{$Command = '0010SR';break;}
		
		case "listening_FSRWIDE" :
		{$Command = '0100SR';break;}	

		case "query_power" :
		{$Command = '?P';break;}	

		case "query_volume" :
		{$Command = '?V';break;}

		case "query_input" :
		{$Command = '?F';break;}	

	}
	//Send command to VSX.
	if ($Command != "empty"){
		$telnet = new PHPTelnet();
		$result = $telnet->Connect($PioneerIP,'','');
		echo $result;
		if ($result == 0) {
			$telnet->DoCommand($Command, $result);
			echo $result;
			$telnet->Disconnect();
		}
	}
	else
	{
		echo "Wrong command received";
	}
}
else
{
	echo "No command received";
}
/********** Receive commands **********/
// Work on Going...
?>