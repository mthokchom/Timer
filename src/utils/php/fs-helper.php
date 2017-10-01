<?php

function updateDataset($datasets, $popupid, $datas){ 
    $out      = array();

    foreach($datasets as $tid => $timerData){
		$out[$tid] = $timerData;

        if($popupid == $tid){
			foreach($datas as $k => $val){
				$out[$tid][$k] = $val;
			}
        }

	}

	if(!isset($datasets[$popupid])){
		$out[$popupid] = $datas;
	}

    return $out;
}


function fileOpen($filePath, $mode){
	$fp  = fopen($filePath, $mode);
    return $fp;
}

function readFromFile($filePath, $fp = null){
	$con = unserialize(file_get_contents($filePath));
	return $con;
}

function writeFromFile($filePath, $data){
    if(!isset($fp)){
	    $fp = fileOpen($filePath, 'w');
    }

    $serializedData = serialize($data);

    fwrite($fp, $serializedData);
	fclose($fp);
}

?>