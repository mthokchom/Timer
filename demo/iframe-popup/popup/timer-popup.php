<?php
include_once "../../common/php/head.inc";
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
          <link href="../../common/css/style.css" rel='stylesheet' type='text/css'>
        <link href="../../common/css/popup-style.css" rel='stylesheet' type='text/css'>
	</head>
	<body>

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
                        <img src="../../common/images/clock-icon.png" class="start-timer" alt="Start Clock" title="Start Clock" />
                    </span>
                    <span class="stop-timer-field input-addon-icon hide">
                        <img src="../../common/images/stop-icon.png" class="stop-timer" alt="Stop Clock" title="Stop Clock" />
                    </span>
                    <span class="save-timer-field input-addon-icon">
                        <img src="../../common/images/save-icon.png" class="save-timer disabled" alt="Save Clock" title="Save Clock" />
                    </span>
                </fieldset>
            </div>
            <script src="../../../node_modules/jquery/dist/jquery.min.js"></script>
		<script src="../../../node_modules/requirejs/require.js" data-main="../../../main.js"></script>
            <script>

                require(['main'], function() {
                    jTimer.init({
                        appSelector                            : '.popup-panel',
                        uid                                    : <?php echo $uid ?>,
                        pid                                    : <?php echo($primaryid); ?>,
                        sid                                    : <?php echo($secondaryid); ?>,
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
                        popupServiceUrl                        : '../../../src/popup/php/popup-server.php',
                        timerServiceUrl                        : '../../../src/timer/php/timer-server.php',
                        postMessage                            : '_TIMER_',
                        type                                   : 'popup'
                    });
                });
            
                /*
                require(['main'], function() {
                    jTimer.init(function(appProvider, popupProvider, utils){
                        var ERR_ALREADY_TIMER_RUNNING              = 'There\'s already a Timer running';
                        var ERR_CAN_START_ONLY_FROM_APPLICATION    = 'Timer can be started only from an Application';
                        var ERR_STOP_CLOCK_BEFORE_SAVING           = 'Stop the clock before saving';
                        var ERR_CLOCK_CANNOT_CHANGED_WHILE_RUNNING = 'The clock cannot be changed while running';
                        var ERR_INVALID_FORMAT                     = 'Invalid duration format';
                        var hideClass                              = 'hide';
                        var $popup                                 = $('.popup-panel');
                        var uid                                    = $('.userid-field', $popup).val();
                        var pid                                    = $('.primaryid-field', $popup).val();
                        var sid                                    = $('.secondaryid-field', $popup).val();
                        var $durationField                         = $('.duration-field', $popup);
                        var $saveTimer                             = $('.save-timer', $popup);
                        var $startDateField                        = $('.start-date-field', $popup);
                        var $startTimeField                        = $('.start-time-field', $popup);
                        var $startTimer                            = $('.start-timer', $popup);
                        var $stopTimer                             = $('.stop-timer', $popup);
                        var $endDateField                          = $('.end-date-field', $popup);
                        var $endTimeField                          = $('.end-time-field', $popup);
                        var $startTimerWrapper                     = $startTimer.closest('.start-timer-field');
                        var $stopTimerWrapper                      = $stopTimer.closest('.stop-timer-field');
                        var cacheData                              = {};

                        //var Timer         = new appProvider.TimerWidget(uid, {
                            //startDateFormat: 'mm/dd/yyyy'
                        //});
                        
                        
                       
                        var Popup         = new popupProvider.PopupWidget(uid, {
                            serviceUrl  : '../../../src/popup/php/popup-server.php'
                        });

                        var Timer         = new appProvider.TimerWidget(uid, {
                            serviceUrl: '../../../src/timer/php/timer-server.php'
                        });

                        var timerSettings = Timer.getOptions();

                        Timer.on(appProvider.EVENTS.ON_ERROR_TIMER, function(params){
                            var errorMsg = '';

                            switch(params.error){
                                case appProvider.ERROR.ALREADY_TIMER_RUNNING:
                                    errorMsg = ERR_ALREADY_TIMER_RUNNING;
                                    break;
                                
                                case appProvider.CAN_START_ONLY_FROM_APPLICATION:
                                    errorMsg = ERR_CAN_START_ONLY_FROM_APPLICATION;
                                    break;
                            }

                            if(errorMsg !== ''){
                                alert(errorMsg);
                            }

                        });

                        function populateData(strDuration, noCache, callbackFn){

                            Popup.get(noCache).done(function(response){
                                 callbackFn            = callbackFn || function(){};

                                 if(response.data){
                                    //strDuration  = utils.DateUtils.addDuration(strDuration, response.data.duration, formatDuration);
                                 
                                    var startDate         = response.data.startdate;
                                    var startTime         = response.data.starttime;

                                    populateStartDateTime(startDate, startTime);
                                    callbackFn(startDate, startTime, strDuration);
                                 }
                                 
                            });
                        }
            
                        Timer.on(appProvider.EVENTS.ON_TICK_TIMER, function(params){
                            if(params.status){
                                $durationField.val(params.duration);
                                //populateData(params.duration, false);

                                utils.PostMessage.post({
                                    eventName: '_TIMER_',
                                    eventType: appProvider.EVENTS.ON_TICK_TIMER,
                                    duration  : params.duration,
                                    status    : params.status
                                });
                            }
                        });

                        Timer.on(appProvider.EVENTS.ON_START_TIMER, function(params){
                            $startDateField.attr('disabled', true);
                            $startTimeField.attr('disabled', true);
                            $endDateField.attr('disabled', true);
                            $endTimeField.attr('disabled', true);
                            $durationField.attr('disabled', true);

                            $startTimerWrapper.addClass(hideClass);
                            $stopTimerWrapper.removeClass(hideClass);

                            $durationField.val(params.duration);
                            populateData(params.duration, true);
                        });

                        Timer.on(appProvider.EVENTS.ON_STOP_TIMER, function(params){
                            $startDateField.attr('disabled', false);
                            $startTimeField.attr('disabled', false);
                            $durationField.attr('disabled', false);

                            var startDate      = $startDateField.val();
                            var startTime      = $startTimeField.val();
                            var startDateTime  = utils.DateUtils.parseDate(startDate +' '+ startTime, timerSettings.startDateFormat +' '+ timerSettings.startShortTimeFormat);

                            if(!startDateTime || !params.status){
                                return;
                            }

                            Timer.stopTimer();
                            stopDateTimerHandler();

                        });

                       
                        $startTimer.off('click').on('click', function(){
                            var dt            = new Date();
                            var startDate     = utils.DateUtils.formatDate(dt, timerSettings.startDateFormat, timerSettings.meridianAM, timerSettings.meridianPM);
                            var startTime     = utils.DateUtils.formatDate(dt, timerSettings.startShortTimeFormat, timerSettings.meridianAM, timerSettings.meridianPM);
                            var duration      = $.trim($durationField.val());

                            startDateTimeHandler(startDate, startTime);

                            var data       = {};
                            data.uid       = uid;
                            data.pid       = pid;
                            data.sid       = sid;

                            Timer.startTimer({
                                startDate : startDate,
                                startTime : startTime,
                                duration  : duration,
                                params    : data
                            });

                            Popup.set({
                                startdate : startDate,
                                starttime : startTime,
                                params    : data
                            });
                            
                            utils.PostMessage.post({
                                eventName: '_TIMER_',
                                eventType: appProvider.EVENTS.ON_START_TIMER,
                                startDate : startDate,
                                startTime : startTime,
                                duration  : duration,
                                params    : data,
                                status    : appProvider.TIMER_STATUS.STARTED
                            });
                            

                        });

                        $stopTimer.off('click').on('click', function(){
                            Timer.stopTimer();
                            stopDateTimerHandler();

                            utils.PostMessage.post({
                                eventName : '_TIMER_',
                                eventType : appProvider.EVENTS.ON_STOP_TIMER,
                                duration  : $.trim($durationField.val()),
                                status    : appProvider.TIMER_STATUS.STOP
                            });
                            
                        });

                        function startDateTimeHandler(startDate, startTime){
                            $startTimerWrapper.addClass(hideClass);
                            $stopTimerWrapper.removeClass(hideClass);
                            populateStartDateTime(startDate, startTime);
                            
                        }

                        function populateStartDateTime(startDate, startTime){
                            if(startDate){
                                $startDateField.val(startDate);
                            }

                            if(startTime){
                                $startTimeField.val(startTime);
                            }

                            cacheData.startDate = $startDateField.val();
                            cacheData.startTime = $startTimeField.val();
                        }

                        function stopDateTimerHandler(startDate, startTime, duration){
                            $stopTimerWrapper.addClass(hideClass);
                            $startTimerWrapper.removeClass(hideClass); 
                            populateEndDateTime(startDate, startTime, duration);  
                        }

                        function populateEndDateTime(startDate, startTime, duration){
                            startDate           = startDate || $.trim($startDateField.val());
                            startTime           = startTime || $.trim($startTimeField.val());
                            duration            = duration  || $.trim($durationField.val());

                            var dtStartDate     = utils.DateUtils.parseDate(startDate +' '+ startTime, timerSettings.startDateFormat +' '+ timerSettings.startShortTimeFormat);

                            if(!dtStartDate){
                                return;
                            }

                            var dtDuration      = utils.DateUtils.parseDuration(duration, timerSettings.durationFormat);

                            if(!dtDuration){
                                alert(ERR_INVALID_FORMAT );
                                return;
                            }

                            var dtEndDate       = utils.DateUtils.addDateTime(dtStartDate, 0, 0, 0, dtDuration.hours, dtDuration.minutes, dtDuration.seconds);

                            $endDateField.val(utils.DateUtils.formatDate(dtEndDate, timerSettings.stopDateFormat, timerSettings.meridianAM, timerSettings.meridianPM));
                            $endTimeField.val(utils.DateUtils.formatDate(dtEndDate, timerSettings.stopShortTimeFormat, timerSettings.meridianAM, timerSettings.meridianPM));

                            cacheData.endDate   = $endDateField.val();
                            cacheData.endTime   = $endTimeField.val();
                            cacheData.duration  = $durationField.val();
                        }

                        $startDateField
                            .add($startTimeField)
                            .add($endDateField)
                            .add($endTimeField)
                            .add($durationField)
                            .closest('.form-control-wrapper')
                            .on('click', function(e){
                            if(Timer.getStatus() === appProvider.TIMER_STATUS.STARTED){
                                alert(ERR_CLOCK_CANNOT_CHANGED_WHILE_RUNNING);
                            }

                        });

                        $durationField.off('input').on('input', function(e){
                            var $this        = $(this);
                            var dtDuration   = utils.DateUtils.parseDuration($this.val(), timerSettings.durationFormat);
                            var endDate      = $endDateField.val();
                            var endTime      = $endTimeField.val();
                            var endDateTime  = utils.DateUtils.parseDate(endDate +' '+ endTime, timerSettings.stopDateFormat +' '+ timerSettings.stopShortTimeFormat);

                            if(!endDateTime){
                                return;
                            }


                            if(!dtDuration){
                                $durationField.val(cacheData.duration);
                                return
                            }

                            populateEndDateTime();

                        })

                        $saveTimer.off('click').on('click', function(e){
                            var $this = $(this);

                            if(Timer.getStatus() === appProvider.TIMER_STATUS.STARTED){
                                alert(ERR_STOP_CLOCK_BEFORE_SAVING);
                            }

                            Popup.set({
                                duration  : $.trim($durationField.val())
                            });

                        });

                        $startDateField.val('');
                        $startTimeField.val('');

                    });
                });
                */
            </script>
        </body>
    </html>