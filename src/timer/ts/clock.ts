/**
 *  Timer
 *  
 *  @version 3.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

import {EventDispatcher, IEvent} from '../../utils/ts/event';

/**
 * Clock Class
 * 
 *  Provides clock functionality
 */
export class Clock {

	protected _currentTime : number;
	private   _onTick      : EventDispatcher<number> = new EventDispatcher<number>(); 
	private   _timeOffset  : number;
	
	constructor() {
		this._timeOffset = null;
		this.tick();
	}

	public getTime() {

		if (null != this._timeOffset && this._timeOffset) {
			var d  = new Date();
			d.setTime(d.getTime() - this._timeOffset);
			return d.getTime();
		} 

		return new Date().getTime();
	}
	
	public tick():void {
		this._currentTime = this.getTime();

		var _interval     = 600;
		this._onTick.trigger(this._currentTime);
		window.setTimeout(() => this.tick(), _interval); 
	}
	
	public setValue(time: number):void{
		var t            = this.getTime();
		this._timeOffset = t - time;
	}
	
	public onTick(): IEvent<number>{
		return this._onTick;
	}
	
}