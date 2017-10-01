<div id="breadcrumb">
    <?php
        // This prints file full path and name
	echo "This file full path and file name is '" . $_SERVER["DOCUMENT_ROOT"] . "'.\n";
    
        // This prints file full path, without file name
        echo "This file full path is '" . __DIR__ . "'.\n";
    ?>
</div>