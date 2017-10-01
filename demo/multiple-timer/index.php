<?php
	include_once "../common/php/head.inc";
?>
<!DOCTYPE html>
<html>
    <head>
        <link href='https://fonts.googleapis.com/css?family=Orbitron' rel='stylesheet' type='text/css'>
		<style>
		  	@import url('http://fonts.googleapis.com/css?family=Open+Sans:400,600,700');
          </style>
          <link href="../common/css/style.css" rel='stylesheet' type='text/css'>
        <link href="../common/css/popup-style.css" rel='stylesheet' type='text/css'>
    </head>
    <body>
     <div class="panel-block">
        <fieldset class="jtimer form-group duration-fieldset" 
            data-jtimer-uid="1" 
            data-jtimer-pid="1"
            data-jtimer-sid="1">
            <input type="hidden" class="start-date-control form-control" />
            <input type="hidden" class="start-time-control form-control" />
            <label class="control-label" for="duration-control">Duration: </label>
            <div class="form-control-wrapper duration-field">
                <input id="duration-control" type="text" class="duration-control form-control" value="00:00:00" /> 
            </div>
            <span class="start-timer-field input-addon-icon">
                <img src="../common/images/clock-icon.png" class="start-timer" alt="Start Clock" title="Start Clock" />
            </span>
            <span class="stop-timer-field input-addon-icon hide">
                <img src="../common/images/stop-icon.png" class="stop-timer" alt="Stop Clock" title="Stop Clock" />
            </span>
            <span class="save-timer-field input-addon-icon">
                <img src="../common/images/save-icon.png" class="save-timer disabled" alt="Save Clock" title="Save Clock" />
            </span>
        </fieldset>
        <fieldset class="jtimer form-group duration-fieldset"
            data-jtimer-uid="1" 
            data-jtimer-pid="2"
            data-jtimer-sid="2">
            <input type="hidden" class="start-date-control form-control" />
            <input type="hidden" class="start-time-control form-control" />
            <label class="control-label" for="duration-control">Duration: </label>
            <div class="form-control-wrapper duration-field">
                <input id="duration-control" type="text" class="duration-control form-control" value="00:00:00" /> 
            </div>
            <span class="start-timer-field input-addon-icon">
                <img src="../common/images/clock-icon.png" class="start-timer" alt="Start Clock" title="Start Clock" />
            </span>
            <span class="stop-timer-field input-addon-icon hide">
                <img src="../common/images/stop-icon.png" class="stop-timer" alt="Stop Clock" title="Stop Clock" />
            </span>
            <span class="save-timer-field input-addon-icon">
                <img src="../common/images/save-icon.png" class="save-timer disabled" alt="Save Clock" title="Save Clock" />
            </span>
        </fieldset>
        <fieldset class="jtimer form-group duration-fieldset"
            data-jtimer-uid="1" 
            data-jtimer-pid="3"
            data-jtimer-sid="3">
            <input type="hidden" class="start-date-control form-control" />
            <input type="hidden" class="start-time-control form-control" />
            <label class="control-label" for="duration-control">Duration: </label>
            <div class="form-control-wrapper duration-field">
                <input id="duration-control" type="text" class="duration-control form-control" value="00:00:00" /> 
            </div>
            <span class="start-timer-field input-addon-icon">
                <img src="../common/images/clock-icon.png" class="start-timer" alt="Start Clock" title="Start Clock" />
            </span>
            <span class="stop-timer-field input-addon-icon hide">
                <img src="../common/images/stop-icon.png" class="stop-timer" alt="Stop Clock" title="Stop Clock" />
            </span>
            <span class="save-timer-field input-addon-icon">
                <img src="../common/images/save-icon.png" class="save-timer disabled" alt="Save Clock" title="Save Clock" />
            </span>
        </fieldset>
    </div>
    <script src="../../node_modules/jquery/dist/jquery.min.js"></script>
	<script src="../../node_modules/requirejs/require.js" data-main="../../main.js"></script>
    <script>
        require(['main'], function() {
            jTimer.init({
                appSelector                            : '.jtimer',
                popupServiceUrl                        : '../../src/popup/php/popup-server.php',
                timerServiceUrl                        : '../../src/timer/php/timer-server.php',
                startDateSelector                      : '.start-date-control',
                startTimeSelector                      : '.start-time-control',
                durationFieldSelector                  : '.duration-field',
                saveSelector                           : '.save-timer-field',
                startSelector                          : '.start-timer-field',
                stopSelector                           : '.stop-timer-field',
                durationSelector                       : '.duration-control',
                type                                   : 'timer'
            });
        });
    </script>
    </body>
</html>