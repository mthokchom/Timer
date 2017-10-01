<?php
/**
* Popup Server.php
*
* @author: M Thokchom
* @version: 1.0
*/

//error_reporting(E_ALL); 
//ini_set('display_errors', '1'); 


require_once('../../utils/php/fs-helper.php');

date_default_timezone_set('America/Los_Angeles');

// Constant
define('FILE_PATH', '../data/popup-dataset.txt');

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

	
	$popupid    = $data['popupid'];

	
	$data = updateDataset($datasets, $popupid, $data);
    writeFromFile(FILE_PATH, $data);
}


/**
* RESPONSE Handler - Send JSON data as response
*/
header('Content-Type: application/json');

if(!isset($popupid)){
	$popupid    = $_GET['popupid'];
}

if(!isset($popupid)){
	echo('popupid cannot be empty');
	die();
}

$dataset        = $datasets[$popupid];

//print_r($dataset);

if(!count($dataset)){
	$dataset = array();
}

echo json_encode($dataset);
