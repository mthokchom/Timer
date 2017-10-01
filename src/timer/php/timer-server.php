<?php
/**
* Timer Server.php
*
* @author: M Thokchom
* @version: 1.3
*/

/*
error_reporting(E_ALL); 
ini_set('display_errors', '1'); 
*/

require_once('../../utils/php/fs-helper.php');

date_default_timezone_set('America/Los_Angeles');

// Constant
define('FILE_PATH', '../data/timer-dataset.txt');
define('STATUS_UNSTARTED', 0);
define('STATUS_START', 1);
define('STATUS_STOP', 2);

// get the HTTP method
$method           = $_SERVER['REQUEST_METHOD'];
$datasets         = readFromFile(FILE_PATH);

/**
* HTTP POST Handler 
*/
if($method === "POST"){

	$data       = json_decode(file_get_contents('php://input'), true);

	if(!isset($data)){
		die();
	}

	
	$timerid        = $data['timerid'];
	$status         = $data['status'];
	$params         = $data['params'];
	$startDuration  = $params['duration'];
	
	if(!isset($startDuration)){
		$startDuration = '00:00:00';
	}
	
	$durationParts    = explode(":", $startDuration);
	$durationInterval = new DateInterval('PT'. $durationParts[0] .'H'. $durationParts[1] .'M'. $durationParts[2] .'S');

	if(!isset($status)){
		$status = STATUS_START;
	}
		
	$now       = date_create();
	$now->sub($durationInterval);

	if($status == STATUS_UNSTARTED){
		unset($datasets[$timerid]);
		$data = $datasets;
	}
	else{
		if($status == STATUS_START){
			$data['startTimer'] = $now->getTimestamp();
		}
		else if($status == STATUS_STOP){
			$data['endTimer']   = $now->getTimestamp();
		}

		$data = updateDataset($datasets, $timerid, $data);

		if($status == STATUS_STOP){
			unset($data[$timerid]);
		}
	}

	writeFromFile(FILE_PATH, $data);
	$datasets = $data;
}


/**
* RESPONSE Handler - Send JSON data as response
*/
header('Content-Type: application/json');


if(!isset($timerid)){
	$timerid    = $_GET['timerid'];
}

if(!isset($timerid)){
	echo('timerid cannot be empty');
	die();
}

$dataset  = array();

if(isset($datasets[$timerid])){
	$dataset        = $datasets[$timerid];
}


//print_r($dataset);

if(count($dataset)){
	$sdate      = date_create();
	$edate      = date_create();
	
	$sdate->setTimestamp($dataset['startTimer']);

	if(isset($dataset['endTimer'])){
		$edate->setTimestamp($dataset['endTimer']);
	}

	$duration   = $edate->getTimestamp() - $sdate->getTimestamp();
	$dataset['duration']  = $duration  * 1000;

	$d = date_create();
	$d->setTimestamp($duration);

	unset($dataset['startTimer']);
	unset($dataset['endTimer']);
}
else{
	$dataset = array();
}

echo json_encode($dataset);
