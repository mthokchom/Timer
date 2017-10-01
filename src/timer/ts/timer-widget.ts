/**
 *  Timer
 *  
 *  @version 3.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

import {DateUtils} from '../../utils/ts/date-utils';
import {Service} from '../../utils/ts/service';
import {EventDispatcher, IEvent} from '../../utils/ts/event';
import {Timer} from './timer';


export const enum ERROR{
	ALREADY_TIMER_RUNNING,
	CAN_START_ONLY_FROM_APPLICATION
}

export const enum TIMER_STATUS{
	UNSTARTED,
	STARTED,
	STOP
}

export const enum EVENTS{
	ON_START_TIMER,
	ON_STOP_TIMER,
	ON_TICK_TIMER,
	ON_CLICK_TIMER,
	ON_ERROR_TIMER
}

export interface ITimerWidgetSettings{
	dataInstanceName          : string,
	$element?                 : JQuery,
	serviceUrl?               : string,
	servicePingInterval       : number,
	onReady?                  : Function,
	serviceSetting            : {
		dataType              : string
	},
	getRequestKey             : string,
	activeClass               : string,
	startDateFormat           : string,
	startLongTimeFormat       : string,
	startShortTimeFormat      : string,
	stopDateFormat            : string,
	stopLongTimeFormat        : string,
	stopShortTimeFormat       : string,
	durationFormat            : string,
	meridianAM                : string,
	meridianPM                : string
}

export class TimerWidget{
    private _timer            : Timer;
	private _responseData     : any;
	private _isReady          : boolean;
	private _duration         : number;
    private _settings         : ITimerWidgetSettings;
	private _status           : TIMER_STATUS;
	private _service          : Service;
	private _timmerid         : any;
	
	// Events
	private _onTimerTick      : EventDispatcher<any>;
	private _onTimerClick     : EventDispatcher<any>;
	private _onTimerStart     : EventDispatcher<any>;
	private _onTimerStop      : EventDispatcher<any>;
	private _onTimerError     : EventDispatcher<any>;

	private _defaultSettings  : ITimerWidgetSettings = {
		dataInstanceName      : '_TIMER_INSTANCE',
		servicePingInterval   : 15,
		serviceSetting        : {
			dataType          : 'JSON'
		},
		getRequestKey         : 'jdata',
		activeClass           : 'active',
		startDateFormat       : 'DD/MM/YYYY',
		startLongTimeFormat   : 'hh:mm:ssA',
		startShortTimeFormat  : 'hh:mmA',
		stopDateFormat        : 'DD/MM/YYYY',
		stopLongTimeFormat    : 'hh:mm:ssA',
		stopShortTimeFormat   : 'hh:mmA',
		durationFormat        : 'HH:mm:ss',
		meridianAM            : 'AM',
		meridianPM            : 'PM'
	}

   static _timer_cache       : object = {};

   constructor(timmerid: any, settings?: ITimerWidgetSettings){
	   this._settings =  $.extend({}, this._defaultSettings, settings);
	   
	   if(!this._settings.serviceUrl){
			throw('Service endpoint URL is not provided.');
	   }

	   if(!(this._settings.$element instanceof jQuery)){
	        this._settings.$element       = $(this._settings.$element);
	   }

	   this._settings.servicePingInterval = 1000 * this._settings.servicePingInterval;
	   this._status                       = TIMER_STATUS.UNSTARTED;
       this._timer                        = new Timer();
	   this._service                      = new Service(this._settings.serviceUrl, this._settings.serviceSetting);
	   this._onTimerTick                  = new EventDispatcher<any>(); 
	   this._onTimerClick                 = new EventDispatcher<any>(); 
	   this._onTimerStart                 = new EventDispatcher<any>(); 
	   this._onTimerStop                  = new EventDispatcher<any>(); 
	   this._onTimerError                 = new EventDispatcher<any>();
	   this._isReady                      = false;
	   this._timmerid                     = timmerid;
	   this._responseData                 = {};

	   this._timer.onTick().on((time) => {
			this.init();
	   });

	   // Handles timer click
	   this._settings.$element.on('click', (e: JQueryEventObject) => {
		   this._onTimerClick.trigger({
			   	event    : e,
				status   : this._status,
				response : this._responseData, 
				element  : this._settings.$element
			}); 
		});

	   // Ping to server whether the timer has started or not
		this.pingServer();

		// Ping server at specified interval and get timer datas
		window.setInterval(() => {
			this.pingServer();
		}, this._settings.servicePingInterval); 
	
		this.init();
   }

   public init(){
	   this._duration = this._timer.getValue().duration; //this.getDuration();
	   if(this._status !== TIMER_STATUS.STOP){
			this.updateTime(this._settings.$element);
		}
   }

   /**
	* onTick
	*
	* @description Provides a way to hook to the timer ticks
	* @param {Function} fn A callbck function 
	*/
   public onTick(fn: Function){
	   this._timer.onTick().on((time) => {
			fn(time, this._status, this._responseData, this._settings.$element);
	   });
   }

   /**
	* on
	*
	* @description Binds Events
	* @param eventName 
	* @param fn 
	*/
   public on(eventName: EVENTS, fn: (data: any) => void){
	   var _eventDispatcher: EventDispatcher<any> = this.getEvent(eventName);

	   if(_eventDispatcher){
	   		_eventDispatcher.on(fn);
	   }

   }

   /**
	* off
	*
	* @description UnBinds Events
	* @param eventName 
	* @param fn 
	*/
   public off(eventName: EVENTS, fn: (data: any) => void){
	   var _eventDispatcher: EventDispatcher<any> = this.getEvent(eventName);

	   if(_eventDispatcher){
	   		_eventDispatcher.off(fn);
	   }

   }


   /**
	* trigger
	*
	* @description Triggers Events
	* @param eventName 
	* @param params 
	*/
   public trigger(eventName: EVENTS, params: object){
	   var _eventDispatcher: EventDispatcher<any> = this.getEvent(eventName);

	   if(_eventDispatcher){
	   		_eventDispatcher.trigger(params);
	   }
   }

   /**
	* Gets the timer id
	* 
	* @return {any} timer id
	*/
   public getTimerId(): any{
	   return this._timmerid;
   }

   /**
	* getStatus
	*
	* @description Gets timer status
	* @return {TIMER_STATUS}
	*/
   public getStatus(): TIMER_STATUS{
	  return this._status;
   }

   /**
	* getOptions
	* 
	* @description Gets Timer Widget Options 
	* @return {ITimerWidgetSettings} Timer Widget Options 
	*/
   public getOptions(): ITimerWidgetSettings{
		return this._settings;
   }

   /**
	* throwError
	* 
	* @description Throws Timer error
	* @param {error} errorType 
	*/
   public throwError(errorType: ERROR){
	  this.trigger(EVENTS.ON_ERROR_TIMER, {
		  error: errorType
	  })
   }

   /**
	* startTimer Overloads
	*
	* @description Starts the Timer
	* @param {number} params Object containing any
	*/
	public startTimer(params: {duration?: string, startDate?: string, startTime?: string, params?: object}): void;

	/**
	* startTimer Overloads
	*
	* @description Starts the Timer
	* @param {string} params The duration to be started from
	*/
	public startTimer(params?: string): void;

	/**
	 * StartTimer 
	 * @param params 
	 */
    public startTimer(params?: string | {duration?: string, startDate?: string, startTime?: string, params?: object}){
	   var timerInstance = this.getInstance();
	   if(timerInstance){
		   this.throwError(ERROR.ALREADY_TIMER_RUNNING);
		   return;
	   }

	   this.setInstance(this);
	   this._status = TIMER_STATUS.STARTED; 

	   var durtaionFrom = (typeof params == 'string') ? params : params.duration;

	   if(durtaionFrom){
			var dt           = new Date(this._timer.getValue().currentTime);
			var duration     = DateUtils.parseDate(durtaionFrom, this._settings.durationFormat);
			dt = DateUtils.addDateTime(dt, 0, 0, 0, duration.getHours(), duration.getMinutes(), duration.getSeconds());	
			this._timer.start(dt.getTime());
	   }
	   else{
			this._timer.start();
	   }

	   if(typeof params !== 'string'){
			var serviceResponse: JQueryXHR = this._service.setToStorage(JSON.stringify({
					timerid     : this._timmerid, 
					status   	: this._status,
					params      : params.params
			}));
		
			serviceResponse.done((data) => {
				this.sync(data);
			});
		}
	    
	   this.trigger(EVENTS.ON_START_TIMER, {
		   params   : params,
		   duration : this.getFormatedDuration(),
		   status   : this._status
	   });

   }

   /**
	* stopTimer
	*
	* @description Stops the Timer
	*/
   public stopTimer(){
	   if(this._status !== TIMER_STATUS.STARTED){
		 return;
	   }
				  
		this._timer.stop();
		this._status = TIMER_STATUS.STOP;
		this._settings.$element.removeClass(this._settings.activeClass);
		this.setInstance(null);

		this._service.setToStorage(JSON.stringify({
			timerid     : this._timmerid, 
            status   	: this._status
        }));

		this.trigger(EVENTS.ON_STOP_TIMER, {
			params   : this._responseData.params,
			status   : this._status,
			duration : this.getFormatedDuration()
		});
   }

    

	public getCurrentDateTime(startDateFormat: string | null, startTimeFormat: string | null): {
		[name: string] : string;
	}{
		var startDate       = new Date();
		var startTime       = new Date();

		startDateFormat     = startDateFormat || this._settings.startDateFormat;
		startTimeFormat     = startTimeFormat || this._settings.startLongTimeFormat;
		var strStartDate    = DateUtils.formatDate(startDate, startDateFormat, this._settings.meridianAM, this._settings.meridianPM); 
		var strStartTime    = DateUtils.formatDate(startTime, startTimeFormat, this._settings.meridianAM, this._settings.meridianPM); 

		return {
			strStartDate: strStartDate,
			strStartTime: strStartTime
		}

	}

    /**
	 * updateTime
	 * 
	 * @description A private utility helper function for updating the timer UI
	 * @param {jQuery} $element 
	 */
	public updateTime($element){
		var status       = this._timer.getStatus();  
		var d            = new Date();
		var strDuration  = this.getFormatedDuration();

		this.trigger(EVENTS.ON_TICK_TIMER, {
			duration : strDuration,
			status   : status,
			params   : this._responseData.params,
		});

		if($element instanceof jQuery){
			this.draw($element, strDuration);
		}
	}


	public reset(commitFlag: boolean = true){
		
		TimerWidget._timer_cache[this._settings.dataInstanceName] = null;
	    this._status = TIMER_STATUS.UNSTARTED;

		if(commitFlag){
			// Sends timer data to server
			this._service.setToStorage(JSON.stringify({
				timerid     : this._timmerid, 
				status   	: this._status
			}));
		}

	    this._timer.reset();
	}

	/**
	 * getFormatedDuration
	 * 
	 * @param {number} duration in timestamp
	 * @param {string} format
	 * @return {string} formated duration 
	 */
	public getFormatedDuration(duration?: number, format: string = this._settings.durationFormat): string{
		this._duration = this._timer.getValue().duration; 
		duration = $.type(duration) === 'undefined' ? this._duration : duration;
		return DateUtils.formatDuration(duration, format);
	}


	/**
	 *  A public utility function to ping to the server at specified interval
	 * 
	 * @param {any} data An optional data
	 * @param {boolean} forceStart An optional boolean indication timer to be started forcefully
	 */
	public pingServer(data : any = {}, forceStart?: boolean){

		data.timerid  =  data.timerid || this._timmerid;

		// Get timer data from server
		var serviceResponse = this._service.getFromStorage(<any> data);

		// Callback which will get called when server sends response back
		serviceResponse.done((data) => {
			this.sync(data, forceStart);
		});
	}


	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * PRIVATE METHODS
	 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	 /**
	  * getEvent
	  *
	  * @description Gets Event
	  * @param {EVENTS} eventName Name of the event
	  * @return {EventDispatcher} 
	  */
	 private getEvent(eventName: EVENTS): EventDispatcher<any>{
	 	var _eventDispatcher: EventDispatcher<any>;

	    switch(eventName){
			case EVENTS.ON_START_TIMER:
				_eventDispatcher = this._onTimerStart;
				break;
			case EVENTS.ON_STOP_TIMER:
				_eventDispatcher = this._onTimerStop;
				break;
			case EVENTS.ON_CLICK_TIMER:
				_eventDispatcher = this._onTimerClick;
				break;
			case EVENTS.ON_TICK_TIMER:
				_eventDispatcher = this._onTimerTick;
				break;
			case EVENTS.ON_ERROR_TIMER:
				_eventDispatcher = this._onTimerError;
				break;
	    }

		return _eventDispatcher;
	 }

	 /**
	  * getInstance
	  *
	  * @description Gets timer widget instance
	  * @return {TimerWidget} TimerWidget instance
	  */
	 private getInstance(): TimerWidget{
		//return this._settings.$element.data(this._settings.dataInstanceName);
		return TimerWidget._timer_cache[this._settings.dataInstanceName];
	 }

	 /**
	  * setInstance
	  *
	  * @description Sets timer widget instance
	  * @param {TimerWidget} instance TimerWidget instance
	  * 
	  */
	 private setInstance(instance: TimerWidget){
		//this._settings.$element.data(this._settings.dataInstanceName, instance);
		TimerWidget._timer_cache[this._settings.dataInstanceName] = instance;
	 }

	 /**
	  * onReady
	  *
	  * @description Handles timer widget onready callback
	  */
	 private onReady(){
		if(this._isReady){
			return
		}

		this._isReady = true;

		if(typeof this._settings.onReady === 'function'){
			this._settings.onReady(this._status);
		}
	}

	/**
	 * Synchronizes the timer
	 * 
	 * @param {string | object} data timer data to be used to syn up
	 * @param {boolean} forceStart optional flag to start the timer forcfully, without waiting for the status
	 */
	private sync(data: string | object, forceStart?: boolean){
		var parsedData: {
			status: TIMER_STATUS,
			duration: number
		} 
		var instance: TimerWidget  = this.getInstance();

		parsedData                 = <any>this.parseData(data);
		this._responseData         = parsedData;

		// Timer doesn't exit or it's disabled
		if(!forceStart && ($.type(data) !== 'object' || (($.type(data) === 'object') && (parsedData.status !== TIMER_STATUS.STARTED)))){

			if(parsedData.status === TIMER_STATUS.STOP){
				//$element.removeClass(this._settings.activeClass);
				this._timer.stop();
				this._status = TIMER_STATUS.STOP;
			}
			else{
				this._timer.reset();
				this._status  = TIMER_STATUS.UNSTARTED;
			}

			// Sync the stop timer
			if(parsedData.duration){
				this.setTime(data);
			}

			this.trigger(EVENTS.ON_STOP_TIMER, {
				params   : this._responseData.params,
				duration : this.getFormatedDuration(parsedData.duration), 
				status   : this._status
			});

			// Remove the timer instance
			if(instance && (instance.getTimerId() === this._timmerid)){
				this.setInstance(null);
				this._settings.$element.removeClass(this._settings.activeClass);
			}

			this.onReady();
			this.updateTime(this._settings.$element);
			return;
		}

		// Timer is disabled and started new timer
		if(!this._timer.getStatus()){
			this._timer.start();
			this._status = TIMER_STATUS.STARTED;
			var duration: string;
			
			if(parsedData.duration){
				duration = this.getFormatedDuration(parsedData.duration);
			}
			else{
				duration = this.getFormatedDuration();
			}

			this.trigger(EVENTS.ON_START_TIMER, {
				params   : this._responseData.params,
				duration : duration,
				status   : this._status
			});
		}

		if(!this._timer.getStatus() && parsedData.status !== TIMER_STATUS.STARTED){
			this.onReady();
			return;
		}

		if(!this._settings.$element.hasClass(this._settings.activeClass) && !instance){

			this.setInstance(this);

			// Make the timer in active state
			this._settings.$element.addClass(this._settings.activeClass);
		}
		

		// Sync the time duration with that of the server
		if(parsedData.duration !== this._timer.getValue().duration){
			this.setTime(data);
		}

		this.onReady();
	}

	/**
	 *  A private uitility helper function for updating timer data
	 * 
	 *  @param {object} data JSON response from server
	 */
	private setTime(data): void{
		data = this.parseData(data);

		// Gets the duration from the passed-in JSON data 
		if(data.duration){
			// Update the timer to the duration from the passed-in JSOn data
			this._timer.setValue(data.duration);
			this._duration = this._timer.getValue().duration; 
			return;
		}
	}

	
	/**
	 *  A private utility helper function for parsing JSON response from server
	 * 
	 * @param {object} data JSON response from server
	 * @return {object} parsed JSON
	 */
	private parseData(data: object | string): object{
		data         = data || '{}';
		data         = (typeof data === 'string') ? JSON.parse(data) : data;
		data         = ($.type(data) === 'array') ? data[0] : data;
		if($.type(data) !== 'object'){
			data = {};
		}
		return <object>data;
	}

	/**
	 * getDuration
	 * 
	 * @description gets timer duration
	 * @return {number}
	 */
	private getDuration(): number{
		return this._timer.getValue().duration;
	}

	/**
	 *  draw
	 *  @description Utility function to draw the timer to the UI
	 * 
	 *  @param {JQuery} $elem A jquery object of an element where the timer will be drawn
	 *  @param {string} txt A string representing the timer data which will be drawn on to the element
	 */
	private draw($elem: JQuery, txt: string){
		$elem.text(txt);
	}

	/**
	 *  Utility function to display alert
	 * 
	 *  @param {string} msg A string representing to the message which will be shown in the alert
	 */
	private alert(msg: string){
		alert(msg);
	}

}