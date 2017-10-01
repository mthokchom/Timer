<?php
	include_once "common/php/head.inc";
?>
<!DOCTYPE html>
<html>
    <head>
        <style>

        </style>
    </head>
    <body>

        <fieldset>
            <legend>UID, PID and SID</legend>
            <form action="index.php" method="GET">
                <label>UID: <input type="text" size="3" name="uid" value="<?=$uid?>" /></label>
                <label>PID: <input type="text" size="3" name="pid" value="<?=$secondaryid?>" /></label>
                <label>SID: <input type="text" size="3" name="sid" value="<?=$primaryid?>" /></label>
                <button type="submit">UPDATE</button>
            </form>
        </fieldset>

        <h1>Timer Demo</h1>
        <p><a href="iframe-popup/index.php?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>">Timer clock and popup</a></p>
        <p><a href="multiple-timer/index.php">Multiple Timer clock</a></p>
        <p><a href="mobile-timer/index.php?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>">Mobile Timer</a></p>
        </ul>
    </body>
</html>