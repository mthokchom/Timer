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
        <div class="app">
            <div id="clock-panel" class="panel-block view-panel" data-nextview="#timer-panel">
                <div class="align-center jtimer" style="font-family:'Orbitron';font-size:20px;color:gray">
                    00:00:00              
                </div>
            </div>
            <div id="timer-panel" class="panel-block view-panel hide" data-prevview="#clock-panel">
                <div class="popup-panel form panel-block">
                    <fieldset class="form-group start-date-fieldset">
                        <label class="control-label" for="start-date-control">Start Date: </label>
                        <div class="form-control-wrapper start-date-field">
                            <input id="start-date-control" type="text" class="start-date-control form-control" />
                        </div>
                    </fieldset>
                    <fieldset class="form-group start-time-fieldset">
                        <label class="control-label" for="start-time-control">Start Time: </label>
                        <div class="form-control-wrapper start-time-field">
                            <input id="start-time-control" type="text" class="start-time-control form-control" />
                        </div>
                    </fieldset>
                    <fieldset class="form-group end-date-fieldset">
                        <label class="control-label" for="end-date-control">End Date: </label>
                        <div class="form-control-wrapper end-date-field">
                            <input id="end-date-control" type="text" class="end-date-control form-control"/>
                        </div>
                    </fieldset>
                    <fieldset class="form-group end-time-fieldset">
                        <label class="control-label" for="end-time-control">End Time: </label>
                        <div class="form-control-wrapper end-time-field">
                            <input id="end-time-control" type="text" class="end-time-control form-control" />
                        </div>
                    </fieldset>
                    <fieldset class="form-group duration-fieldset">
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
            </div>
        </div>

        <script src="../../node_modules/jquery/dist/jquery.min.js"></script>
		    <script src="../../node_modules/requirejs/require.js" data-main="../../main.js"></script>
            <script>
                $(document).ready(function(){
                    var clockPanelSelector = '#clock-panel';
                    var timerPanelSelector = '#timer-panel';
                    var $viewPanel         = $('.view-panel');
                    var hideClass          = 'hide';

                    var switchPanel = function($panelToShow){
                        if(!$panelToShow){
                            return;
                        }
                        if($panelToShow.is($(timerPanelSelector))){
                            var $app = $('.app');

                            if($app.length){
                                timer = $app.data('_TIMER_DATA_');
                                if(timer){
                                    timer.populateData();
                                }
                            }
                        }

                        $viewPanel.addClass(hideClass);
                        $panelToShow.removeClass(hideClass);
                    }

                    $viewPanel.on('click', function(){
                        var $view            = $(this);
                        var nextViewSelector = $view.attr('data-nextview');
                        var $activeView;

                        if(nextViewSelector){
                            $activeView        = $(nextViewSelector);
                        }
                        switchPanel($activeView);
                    });

                });

                require(['main'], function() {
                    jTimer.init({
                        appSelector                            : '.app',
                        uid                                    : <?php echo $uid ?>,
                        pid                                    : <?php echo($primaryid); ?>,
                        sid                                    : <?php echo($secondaryid); ?>,
                        timerDisplaySelector                   : '.jtimer',
                        durationFieldSelector                  : '.duration-field',
                        startDateFieldSelector                 : '.start-date-field',
                        startTimeFieldSelector                 : '.start-time-field',
                        endDateFieldSelector                   : '.end-date-field',
                        endTimeFieldSelector                   : '.end-time-field',
                        durationSelector                       : '.duration-control',
                        startDateSelector                      : '.start-date-control',
                        startTimeSelector                      : '.start-time-control',
                        endDateSelector                        : '.end-date-control',
                        endTimeSelector                        : '.end-time-control',
                        saveSelector                           : '.save-timer-field',
                        startSelector                          : '.start-timer-field',
                        stopSelector                           : '.stop-timer-field',
                        popupServiceUrl                        : '../../src/popup/php/popup-server.php',
                        timerServiceUrl                        : '../../src/timer/php/timer-server.php',
                        postMessage                            : '_TIMER_',
                        type                                   : 'popup'
                    });
                });
            </script>

    </body>
</html>