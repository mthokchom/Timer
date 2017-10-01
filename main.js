var jTimer = {

	init : function(options){
		var self                       = this;
		
		requirejs.config({
			deps     : ["node_modules/jquery/dist/jquery", "build/build"],
			callback : $.proxy(self.onReady, self, options)
		});
	},

	onReady: function(options){
		var self = this;

		$(document).ready(function(){

			requirejs(["timer/ts/timer-widget", "popup/ts/popup-widget", "utils/ts/index"], 
				function(appProvider, popupProvider, utils){
					var args = [].slice.call(arguments);
					args.unshift(options);
					self.app.init.apply(self.app, args);

				}
			); // requirejs ends here
			
		});
	},

	app : {

		config: {
			ERR_ALREADY_TIMER_RUNNING              : 'There\'s already a Timer running',
			ERR_CAN_START_ONLY_FROM_APPLICATION    : 'Timer can be started only from an Application',
			ERR_STOP_CLOCK_BEFORE_SAVING           : 'Stop the clock before saving',
			ERR_CLOCK_CANNOT_CHANGED_WHILE_RUNNING : 'The clock cannot be changed while running',
			ERR_INVALID_FORMAT                     : 'Invalid format',
			postMessage                            : null,
			getMessage                             : null,
			hideClass                              : 'hide',
			appSelector                            : 'data-jtimer-init',
			uid                                    : null,
			pid                                    : null,
			sid                                    : null,
			timerDisplaySelector                   : 'data-jtimer-timer',
			uidSelector                            : 'data-jtimer-uid',
			pidSelector                            : 'data-jtimer-pid',
			sidSelector                            : 'data-jtimer-sid',
			durationFieldSelector                  : 'data-jtimer-durationfield',
			durationSelector                       : 'data-jtimer-duration',
			startDateFieldSelector                 : 'data-jtimer-start-datefield',
			startDateSelector                      : 'data-jtimer-start-date',
			startTimeFieldSelector                 : 'data-jtimer-start-timefield',
			startTimeSelector                      : 'data-jtimer-start-time',
			endDateFieldSelector                   : 'data-jtimer-end-datefield',
			endDateSelector                        : 'data-jtimer-end-date',
			endTimeFieldSelector                   : 'data-jtimer-end-timefield',
			endTimeSelector                        : 'data-jtimer-end-time',
			saveSelector                           : 'data-jtimer-save',
			startSelector                          : 'data-jtimer-start',
			stopSelector                           : 'data-jtimer-stop',
			onStartTimer                           : function(){},
			onStopTimer                            : function(){},
			timerDataKey                           : '_TIMER_DATA_'
		},

		isDataAttr: function(str){
			if(typeof str !== 'string'){
				return fals;
			}

			return (str.indexOf('data-') === 0);
		},

		getElem: function(selector, $scope){
			$scope        = $scope || $();
			$scope        = $scope.length ? $scope : $(document.body);
			var self      = this;
			var _selector = '';

			if(typeof selector === 'function'){
				_selector = selector();

				if(!(_selector instanceof jQuery)){
					_selector = $(_selector, $scope);
				}
			}
			else if(this.isDataAttr(selector)){
				var dataSelector = '['+ selector +']';
				_selector = $scope.find(dataSelector);

				if(!_selector.length){
					_selector = $(_selector.attr(selector));
				}
			}
			else{
				_selector = (typeof selector === 'string') ? selector : _selector;
				_selector = $(_selector, $scope);
			}

			return _selector
		},

		setValue: function($elem, value){
			if($elem.is('input')){
				$elem.val(value);
			}
			else{
				$elem.text(value);
			}
		},

		getValue: function($elem){
			var _value;

			if($elem.is('input')){
				_value = $elem.val();
			}
			else{
				_value = $elem.text();
			}

			return _value;
		},

		elem: function(selector, $scope){
			var self  = this;
			var $elem = self.getElem(selector, $scope);
			var val;

			if(this.isDataAttr(selector)){
				val = $elem.attr(selector);
			}
			else{
				val = $elem.val();
			}

			return {
				get: $elem,
				val: self.getValue($elem)
			}
		},

		init: function(options, appProvider, popupProvider, utils){
			var self                                   = this;
			this.appProvider                           = appProvider;
			this.popupProvider                         = popupProvider;
			this.utils                                 = utils;
			this.settings                              = $.extend({}, this.config, options);
			var $timerElems                            = this.getElem(this.settings.appSelector);

			$.each($timerElems, function(i, timerElem){
				var $timerElem = $(timerElem);
				var timer      = new self.Timer($timerElem, self);
				$timerElem.data(self.settings.timerDataKey, timer);
			});
		},

		Timer: (function(){
			_Timer.ACTION_TYPE = {
				SAVE  : 0,
				START : 1,
				STOP  : 2
			}

			function _Timer($timerElem, helper){
				var self                               = this;
				this.helper                            = helper;
				this.settings                          = $.extend(true, {}, this.helper.settings);
				this.$timerDisplay                     = this.helper.getElem(this.settings.timerDisplaySelector, $timerElem);
				this.$durationField                    = this.helper.getElem(this.settings.durationFieldSelector, $timerElem);
				this.$startDateField                   = this.helper.getElem(this.settings.startDateFieldSelector, $timerElem);
				this.$startTimeField                   = this.helper.getElem(this.settings.startTimeFieldSelector, $timerElem);
				this.$endDateField                     = this.helper.getElem(this.settings.endDateFieldSelector, $timerElem);
				this.$endTimeField                     = this.helper.getElem(this.settings.endTimeFieldSelector, $timerElem);
				this.$duration                         = this.helper.getElem(this.settings.durationSelector, (this.$durationField.length ? this.$durationField : $timerElem));
				this.$startDate                        = this.helper.getElem(this.settings.startDateSelector, (this.$startDateField.length ? this.$startDateField : $timerElem));
				this.$startTime                        = this.helper.getElem(this.settings.startTimeSelector, (this.$startTimeField.length ? this.$startTimeField: $timerElem));
				this.$endDate                          = this.helper.getElem(this.settings.endDateSelector, (this.$endDateField.length ? this.$endDateField : $timerElem));
				this.$endTime                          = this.helper.getElem(this.settings.endTimeSelector, (this.$endTimeField.length ? this.$endTimeField : $timerElem));
				this.$saveTimer                        = this.helper.getElem(this.settings.saveSelector, $timerElem);
				this.$startTimer                       = this.helper.getElem(this.settings.startSelector, $timerElem);
				this.$stopTimer                        = this.helper.getElem(this.settings.stopSelector, $timerElem);
				this.cacheData                         = {};
				this.durationDefaultValue              = $.trim(this.$duration.val());
				this.status                            = this.helper.appProvider.TIMER_STATUS.UNSTARTED;
				this.action                            = null;
				
				if(!this.settings.timerServiceUrl){
					throw 'Require Timer service enpoint URL';
				}

				if(!this.settings.uid){
					this.settings.uid = $timerElem.attr(this.settings.uidSelector);
				}
				if(!this.settings.sid){
					this.settings.sid = $timerElem.attr(this.settings.sidSelector);
				}
				if(!this.settings.pid){
					this.settings.pid = $timerElem.attr(this.settings.pidSelector);
				}

				if(this.settings.popupServiceUrl){
					this.Popup         = new this.helper.popupProvider.PopupWidget(this.settings.uid, {
						serviceUrl: this.settings.popupServiceUrl
					});
				}

				var timerOptions        = {};
				timerOptions.serviceUrl = this.settings.timerServiceUrl;
				timerOptions.type       = this.settings.type;

				if(this.$timerDisplay.length){
					timerOptions.$element = this.$timerDisplay;
				}

				this.Timer         = new this.helper.appProvider.TimerWidget(this.settings.uid, timerOptions);
				this.timerSettings = this.Timer.getOptions();

				this.Timer.on(helper.appProvider.EVENTS.ON_ERROR_TIMER, $.proxy(this.onErrorHandler, this));
				this.Timer.on(helper.appProvider.EVENTS.ON_TICK_TIMER, $.proxy(this.onTickHandler, this));
				this.Timer.on(helper.appProvider.EVENTS.ON_START_TIMER, $.proxy(this.onStartTimerHandler, this));
				this.Timer.on(helper.appProvider.EVENTS.ON_STOP_TIMER, $.proxy(this.onStopTimerHandler, this));

				this.$startTimer.off('click').on('click', $.proxy(this.onStartClick, this));
				this.$stopTimer.off('click').on('click', $.proxy(this.onStopClick, this));
				this.$startDate.off('input').on('input', $.proxy(this.onStartDateTimeChange, this));
				this.$startTime.off('input').on('input', $.proxy(this.onStartDateTimeChange, this));
				this.$endDate.off('input').on('input', $.proxy(this.onEndDateTimeChange, this));
				this.$endTime.off('input').on('input', $.proxy(this.onEndDateTimeChange, this));
				this.$duration.off('input').on('input', $.proxy(this.onDurationChange, this));
				this.$saveTimer.off('click').on('click', $.proxy(this.onSaveTimerClick, this));

				this.$startDateField
					.add(this.$startTimeField)
					.add(this.$endDateField)
					.add(this.$endTimeField)
					.add(this.$durationField)
					.on('click', function(e){
						if(self.Timer.getStatus() === self.helper.appProvider.TIMER_STATUS.STARTED){
							alert(self.settings.ERR_CLOCK_CANNOT_CHANGED_WHILE_RUNNING);
						}
				});

				this.helper.setValue(this.$startDate, '');
				this.helper.setValue(this.$startTime, '');

				this.populateData(false);

				if(this.settings.getMessage){
					this.helper.utils.PostMessage.get(function(e, message){
						var data = message ? message : {};

						if(self.settings.onPostMessageReceived(data, self.helper)){
							return;
						}
		
						if(data.eventName === self.settings.getMessage){	
							if(data.eventType === self.helper.appProvider.EVENTS.ON_TICK_TIMER){
		
							}
							else if(data.eventType === self.helper.appProvider.EVENTS.ON_STOP_TIMER){
								self.Timer.reset(false);
							}
							else if(data.eventType === self.helper.appProvider.EVENTS.ON_START_TIMER){
								self.Timer.startTimer(data.duration);			
							}
						}
		
					})
				}
				
			}

			_Timer.prototype.onErrorHandler = function(params){
				var errorMsg = '';

				switch(params.error){
					case this.helper.appProvider.ERROR.ALREADY_TIMER_RUNNING:
						errorMsg = this.settings.ERR_ALREADY_TIMER_RUNNING;
						this.$startTimer.removeClass(this.settings.hideClass);
						this.$stopTimer.addClass(this.settings.hideClass);
						break;
					
					case this.helper.appProvider.CAN_START_ONLY_FROM_APPLICATION:
						errorMsg = this.settings.ERR_CAN_START_ONLY_FROM_APPLICATION;
						this.$startTimer.removeClass(this.settings.hideClass);
						this.$stopTimer.addClass(this.settings.hideClass);
						break;
				}

				if(errorMsg !== ''){
					alert(errorMsg);
				}

			}

			_Timer.prototype.onTickHandler = function(data){
				var params = data.params || {};

				if(data.status && params.pid == this.settings.pid && params.sid == this.settings.sid){
					this.helper.setValue(this.$duration, data.duration);
					//populateData(params.duration, false);
					if(this.settings.postMessage){
						this.helper.utils.PostMessage.post({
							eventName : this.settings.postMessage,
							eventType : this.helper.appProvider.EVENTS.ON_TICK_TIMER,
							duration  : data.duration,
							status    : data.status
						});
					}
				}
			}

			_Timer.prototype.onStartTimerHandler = function(data){

				var params = data.params;

				if(this.settings.onStartTimer({
					duration: data.duration, 
					status  : data.status, 
					params  : params
				}, this.helper)){
					return;
				}

				if(params.pid != this.settings.pid && params.sid != this.settings.sid){
					return
				}

				this.status  = this.helper.appProvider.TIMER_STATUS.STARTED;
				this.helper.setValue(this.$endDate, '');
				this.helper.setValue(this.$endTime, '');

				this.$startDate.attr('disabled', true);
				this.$startTime.attr('disabled', true);
				this.$endDate.attr('disabled', true);
				this.$endTime.attr('disabled', true);
				this.$duration.attr('disabled', true);

				this.$startTimer.addClass(this.settings.hideClass);
				this.$stopTimer.removeClass(this.settings.hideClass);

				this.helper.setValue(this.$duration, data.duration);
				//this.populateData(data.duration, true);
			}

			_Timer.prototype.onStopTimerHandler = function(params){

				if(this.settings.onStopTimer({
						duration: params.duration, 
						status  : params.status,
						params  :  null
					}, this.helper)){
					return;
				}

				this.$startDate.attr('disabled', false);
				this.$startTime.attr('disabled', false);
				this.$endDate.attr('disabled', false);
				this.$endTime.attr('disabled', false);
				this.$duration.attr('disabled', false);

				var startDate      = this.helper.getValue(this.$startDate);
				var startTime      = this.helper.getValue(this.$startTime);
				var duration       = this.helper.getValue(this.$duration);
				var startDateTime  = this.helper.utils.DateUtils.parseDate(startDate +' '+ startTime, this.timerSettings.startDateFormat +' '+ this.timerSettings.startShortTimeFormat);
				this.$stopTimer.addClass(this.settings.hideClass);
				this.$startTimer.removeClass(this.settings.hideClass); 

				if(startDateTime && (params.status || (this.status  == this.helper.appProvider.TIMER_STATUS.STARTED))){	
					this.Timer.stopTimer();
					this.populateEndDateTime(startDate, startTime, duration);  
					this.status  = this.helper.appProvider.TIMER_STATUS.STOP;
				}

			}


			_Timer.prototype.populateData = function(noCache){
				var self = this;
				
				if(this.Popup){
					this.Popup.get(noCache).done(function(response){

						if(response.data){
							var params = response.data.params;

							if(params.pid == self.settings.pid && params.sid == self.settings.sid){
								//strDuration  = this.helper.utils.DateUtils.addDuration(strDuration, response.data.duration, formatDuration);
							
								var startDate         = response.data.startdate;
								var startTime         = response.data.starttime;
								var duration          = response.data.duration;
								self.action           = response.data.action;
								//if(duration !== self.durationDefaultValue){
									self.populateStartDateTime(startDate, startTime);

									if(self.Timer.getStatus() ===  self.helper.appProvider.TIMER_STATUS.STOP){
										self.populateEndDateTime(startDate, startTime, duration);
									}

									self.helper.setValue(self.$duration, duration);
									self.durationDefaultValue = duration;
								//}
							}
						}
						
					});
				}
			}

		   
			_Timer.prototype.onStartClick = function(){
				this.status       = this.helper.appProvider.TIMER_STATUS.STARTED;

				var self          = this;
				var dt            = new Date();
				var startDate     = this.helper.getValue(this.$startDate);
				var startTime     = this.helper.getValue(this.$startTime);
				var duration      = $.trim(this.helper.getValue(this.$duration));

				this.$startTimer.addClass(this.settings.hideClass);
				this.$stopTimer.removeClass(this.settings.hideClass);

				if(!startDate || !startTime || (this.action !== _Timer.ACTION_TYPE.SAVE)){
					startDate     = this.helper.utils.DateUtils.formatDate(dt, this.timerSettings.startDateFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM);
					startTime     = this.helper.utils.DateUtils.formatDate(dt, this.timerSettings.startShortTimeFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM);
					this.populateStartDateTime(startDate, startTime);
				}

				this.helper.setValue(this.$endDate, '');
				this.helper.setValue(this.$endTime, '');

				this.$startDate.attr('disabled', true);
				this.$startTime.attr('disabled', true);
				this.$endDate.attr('disabled', true);
				this.$endTime.attr('disabled', true);
				this.$duration.attr('disabled', true);

				var data       = {};
				data.uid       = this.settings.uid;
				data.pid       = this.settings.pid;
				data.sid       = this.settings.sid;
				data.duration  = duration;

				this.Timer.startTimer({
					startDate : startDate,
					startTime : startTime,
					params    : data
				});

				if(this.Popup){
					this.Popup.set({
						startdate : startDate,
						starttime : startTime,
						duration  : duration,
						params    : data,
						action    : _Timer.ACTION_TYPE.START
					});
				}
				
				if(this.settings.postMessage){
					this.helper.utils.PostMessage.post({
						eventName : this.settings.postMessage,
						eventType : self.helper.appProvider.EVENTS.ON_START_TIMER,
						startDate : startDate,
						startTime : startTime,
						duration  : duration,
						params    : data,
						status    : self.helper.appProvider.TIMER_STATUS.STARTED
					});
				}

			}

			_Timer.prototype.onStopClick = function(){
				this.status       = this.helper.appProvider.TIMER_STATUS.STOP;
				this.Timer.stopTimer();
				this.$stopTimer.addClass(this.settings.hideClass);
				this.$startTimer.removeClass(this.settings.hideClass); 
				this.populateEndDateTime(); 

				this.$startDate.attr('disabled', false);
				this.$startTime.attr('disabled', false);
				this.$endDate.attr('disabled', false);
				this.$endTime.attr('disabled', false);
				this.$duration.attr('disabled', false);

				if(this.settings.postMessage){
					this.helper.utils.PostMessage.post({
						eventName : this.settings.postMessage,
						eventType : this.helper.appProvider.EVENTS.ON_STOP_TIMER,
						duration  : $.trim(this.helper.getValue(this.$duration)),
						status    : this.helper.appProvider.TIMER_STATUS.STOP
					});
				}
			};

			_Timer.prototype.populateStartDateTime = function(startDate, startTime){
				if(startDate){
					this.helper.setValue(this.$startDate, startDate);
				}

				if(startTime){
					this.helper.setValue(this.$startTime, startTime);
				}

				this.cacheData.startDate = this.helper.getValue(this.$startDate);
				this.cacheData.startTime = this.helper.getValue(this.$startTime);
			}

			_Timer.prototype.populateEndDateTime = function(startDate, startTime, duration){
				var dtStartDate     = this.dtGetStartDate(startDate, startTime);

				if(!dtStartDate){
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}

				var dtDuration      = this.dtGetDuration(duration);

				if(!dtDuration){
					this.helper.setValue(this.$duration, this.cacheData.duration);
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}

				var dtEndDate       = this.helper.utils.DateUtils.addDateTime(dtStartDate, 0, 0, 0, dtDuration.hours, dtDuration.minutes, dtDuration.seconds);

				this.helper.setValue(this.$endDate, this.helper.utils.DateUtils.formatDate(dtEndDate, this.timerSettings.stopDateFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM));
				this.helper.setValue(this.$endTime, this.helper.utils.DateUtils.formatDate(dtEndDate, this.timerSettings.stopShortTimeFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM));

				this.cacheData.endDate   = this.helper.getValue(this.$endDate);
				this.cacheData.endTime   = this.helper.getValue(this.$endTime);
				this.cacheData.duration  = this.helper.getValue(this.$duration);
			}

			_Timer.prototype.onEndDateTimeChange = function(e){
				var dtEndDate  = this.dtGetEndDate();

				if(!dtEndDate){
					this.helper.setValue(this.$endDate, this.cacheData.endDate);
					this.helper.setValue(this.$endTime, this.cacheData.endTime);
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}

				var dtDuration      = this.dtGetDuration();
				
				if(!dtDuration){
					this.helper.setValue(this.$duration, this.cacheData.duration);
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}

				var dtStartDate       = this.helper.utils.DateUtils.substractDateTime(dtEndDate, 0, 0, 0, dtDuration.hours, dtDuration.minutes, dtDuration.seconds);
				var startDate         = this.helper.utils.DateUtils.formatDate(dtStartDate, this.timerSettings.startDateFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM);
				var startTime         = this.helper.utils.DateUtils.formatDate(dtStartDate, this.timerSettings.startShortTimeFormat, this.timerSettings.meridianAM, this.timerSettings.meridianPM);
				this.populateStartDateTime(startDate, startTime);
			}

			_Timer.prototype.onStartDateTimeChange = function(e){
				if(this.status !== this.helper.appProvider.TIMER_STATUS.STOP){
					return;
				}

				var dtStartDate  = this.dtGetStartDate();

				if(!dtStartDate){
					this.helper.setValue(this.$startDate, this.cacheData.startDate);
					this.helper.setValue(this.$startTime, this.cacheData.startTime);
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}

				this.populateEndDateTime();
				
			}

			_Timer.prototype.onDurationChange = function(e){
				var dtDuration   = this.dtGetDuration();
				var endDateTime  = this.getEndDate();

				if(!endDateTime){
					this.helper.setValue(this.$endDate, this.cacheData.endDate);
					this.helper.setValue(this.$endTime, this.cacheData.endTime);
					alert(this.settings.ERR_INVALID_FORMAT);
					return;
				}


				if(!dtDuration){
					this.helper.setValue(this.$duration, this.cacheData.duration);
					alert(this.settings.ERR_INVALID_FORMAT);
					return
				}

				this.populateEndDateTime();

			}

			_Timer.prototype.onSaveTimerClick = function(e){
				var $this = $(this);

				if(this.Timer.getStatus() === this.helper.appProvider.TIMER_STATUS.STARTED){
					alert(this.settings.ERR_STOP_CLOCK_BEFORE_SAVING);
					return;
				}

				var data       = {};
				data.uid       = this.settings.uid;
				data.pid       = this.settings.pid;
				data.sid       = this.settings.sid;

				if(this.Popup){
					this.Popup.set({
						startdate : $.trim(this.helper.getValue(this.$startDate)),
						starttime : $.trim(this.helper.getValue(this.$startTime)),
						duration  : $.trim(this.helper.getValue(this.$duration)),
						params     : data,
						action    : _Timer.ACTION_TYPE.SAVE
					});
				}

			}

			_Timer.prototype.dtGetStartDate = function(startDate, startTime){
				startDate        = startDate || $.trim(this.helper.getValue(this.$startDate));
				startTime        = startTime || $.trim(this.helper.getValue(this.$startTime));
				var dtStartDate  = this.helper.utils.DateUtils.parseDate(startDate +' '+ startTime, this.timerSettings.startDateFormat +' '+ this.timerSettings.startShortTimeFormat);

				return dtStartDate;
			}

			_Timer.prototype.dtGetEndDate = function(endDate, endTime){
				endDate          = endDate || this.helper.getValue(this.$endDate);
				endTime          = endTime || this.helper.getValue(this.$endTime);
				var endDateTime  = this.helper.utils.DateUtils.parseDate(endDate +' '+ endTime, this.timerSettings.stopDateFormat +' '+ this.timerSettings.stopShortTimeFormat);

				return endDateTime;
			}

			_Timer.prototype.dtGetDuration = function(duration){
				duration         = duration || $.trim(this.helper.getValue(this.$duration));
				var dtDuration   = this.helper.utils.DateUtils.parseDuration(duration, this.timerSettings.durationFormat);

				return dtDuration;
			}

			return _Timer;

		})()

	}



}
