/**
 *  Timer
 *  
 *  @version 3.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

/**
 * Event Interface
 * 
 *  Provides event interface
 */
export interface IEvent<T> {
	on(handler: { (data?: T): void }) : void;
	off(handler: { (data?: T): void }) : void;
}

/**
 * EventDispatcher Class
 * 
 *  Handles Event dispatches and provdies listening on/off to an event
 */
export class EventDispatcher<T> implements IEvent	<T> {
	private _handlers: { (data?: T): void; }[] = [];

	public on(handler: { (data?: T): void }) {
		this._handlers.push(handler);
	}

	public off(handler: { (data?: T): void }) {
		this._handlers = this._handlers.filter(h => h !== handler);
	}

	public trigger(data?: T) {
		this._handlers.slice(0).forEach(h => h(data));
	}
}
