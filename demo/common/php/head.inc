<?php

/*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
*/
	$uid         = $_GET['uid'];
	$primaryid   = $_GET['pid'];
	$secondaryid = $_GET['sid'];

	if(!isset($uid)){
		$uid = 1;
	}

	if(!isset($primaryid)){
		$primaryid = 1;
	}

	if(!isset($secondaryid)){
		$secondaryid = 1;
	}
?>