<?php
	include_once "../common/php/head.inc";
?>
<!DOCTYPE html>

<html lang="en-US">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="robots" content="all,index,follow" />

		<title>Create Multiple Mobile Optimized Modal Windows in One Page</title>
		<meta name="description" content="Add more than one popup windows on the same page with jQuery, that work great on desktop and mobile." />
        <link href='https://fonts.googleapis.com/css?family=Orbitron' rel='stylesheet' type='text/css'>
		<style>
		  	@import url('http://fonts.googleapis.com/css?family=Open+Sans:400,600,700');
  		</style>
		 <link href='css/main.css' rel='stylesheet' type='text/css'>
	</head>

	<body>
        <div style="height:30px; width:100%; border: solid 1px gray; background-color: lightgray">
            <div class="jtimer" style="text-align:right; padding-right:10px">
                <a class="duration-panel timer-popup-trigger" style="font-family:'Orbitron';font-size:20px;color:gray"><span>00:00:00</span></a>                
            </div>
        </div>
        <br/>
	
		<a href="?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>" class="timer-popup-trigger popup-trigger" rel="nofollow">iFrame Popup (uid-<?php echo $uid ?>, pid-<?= $primaryid ?>, sid-<?= $secondaryid ?>)</a>
		<br />
		<a href="?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>" class="timer-popup-trigger popup-trigger" rel="nofollow">iFrame Popup (uid-<?php echo $uid ?>, pid-<?= $primaryid ?>, sid-<?= $secondaryid ?>)</a>
		<br />
		<a href="?uid=<?php echo $uid ?>&pid=<?= $primaryid ?>&sid=<?= $secondaryid ?>" class="timer-popup-trigger popup-trigger" rel="nofollow">iFrame Popup (uid-<?php echo $uid ?>, pid-<?= $primaryid ?>, sid-<?= $secondaryid ?>)</a>
		

		<div id="timer-popup" class="popup timer-popup">
			<div style="border: solid 2px black">
                <iframe src="popup/timer-popup.php" style="width: 100%; height: 280px; border: 0 none"></iframe>
			</div>
			<span class="popup-btn-close">close</span>
		</div>

		<script src="../../node_modules/jquery/dist/jquery.min.js"></script>
		<script src="popup/js/timer-popup.js"></script>
		<script src="../../node_modules/requirejs/require.js" data-main="../../main.js"></script>
		<script>

			$(document).ready(function(){
				popupTimer.init();
			});

			require(['main'], function() {
				jTimer.init({
					appSelector                            : '.jtimer',
					uid                                    : <?php echo $uid ?>,
					pid                                    : <?php echo $primaryid ?>,
				    sid                                    : <?php echo $secondaryid ?>,
					popupServiceUrl                        : '../../src/popup/php/popup-server.php',
					timerServiceUrl                        : '../../src/timer/php/timer-server.php',
					getMessage                             : '_TIMER_',
					timerDisplaySelector                   : '.duration-panel',
					type                                   : 'timer',
					onPostMessageReceived                  : function(data, helper){
						if(data.eventType === helper.appProvider.EVENTS.ON_STOP_TIMER){
								var $timerDisplayPanel = $('.jtimer .timer-popup-trigger');
								$timerDisplayPanel.removeAttr('href');
						}
					},
					onStartTimer                           : function(data, helper){
						var $timerDisplayPanel = $('.jtimer .timer-popup-trigger');
						$timerDisplayPanel.attr('href', '?'+ popupTimer.getObjParamToString({
							uid: <?php echo $uid ?>,
							pid: <?php echo $primaryid ?>,
							sid: <?php echo $secondaryid ?>
						}));
					},
					onStopTimer                            : function(data, helper){
						var $timerDisplayPanel = $('.jtimer .timer-popup-trigger');
						$timerDisplayPanel.removeAttr('href');
					}
				});
			});
		</script>
	</body>
</html>
