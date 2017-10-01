<?php
	include_once "../common/php/head.inc";
?>
<!DOCTYPE html>
<html>
    <head></head>
    <body>
     <div style="height:30px; width:100%; border: solid 1px gray; background-color: lightgray;position:absolute; top:0; left:0">
            <div style="padding-right:10px">
                Top Frame                
            </div>
        </div>
        <div>        
            <iframe src="iframe.php?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>" style="border: 0; position:absolute; top:20px; left:0; right:0; bottom:0; width:100%; height:100%"></iframe>
        </div>
    </body>
</html>