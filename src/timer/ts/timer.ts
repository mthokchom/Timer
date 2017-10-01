import {Clock} from './clock';

/**
 *  Timer
 *  
 *  @version 3.1
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

/**
 * Timer Class
 *  
 * This class inherits from clock class and provides timer functionality
 */
export class Timer extends Clock{

	private _running: boolean;
	private _setTime: number;
	private _startTime: number;
	private _stopTime: number;
	
	
	constructor() {
		super();
		this.reset();
	}

	
	public start(time?: number): void{
		if(time){
			this._startTime = this._currentTime - (time - this._currentTime );
		}else{
			this._startTime = this._currentTime;
		}
		
		this._running   = true;
	}
	
	public stop(): void{
		if(this._running){
			this._stopTime   = this._currentTime;
		}
		this._running   = false;
	}
	
	public pause(): void{
		this._running   = false;
	}

	public resume(): void{
		this._running   = true;
	}
	
	public reset(): void{
		this._startTime = this._currentTime;
		this._stopTime  = this._currentTime;
		this._running   = false;
	}

	public getValue(){
		var timerValue: {
			duration: number, 
			startTime: number, 
			currentTime: number
		} = {
			duration    : ((this._running ? this._currentTime : this._stopTime) - this._startTime) || 0,
			currentTime : this._currentTime,
			startTime   : this._startTime 
		}

		return  timerValue; 
	}

	public setValue(time: number):void{
		
		if(!this._startTime || this._running){
			this._startTime = this._currentTime - time;
		}
		
		if(!this._running){
			this._stopTime = this._startTime + time
		}
	}


	public getStatus(): boolean{
		return this._running;
	}
	
}