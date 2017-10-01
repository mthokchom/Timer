
/**
 *  PostMessage
 *  
 *  @description Provides a simple and easy window.postMessage communication in browsers that support it (FF3, Safari 4, IE8)
 *  @version 1.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

const POST_MESSAGE = 'postMessage';

export class PostMessage{
    static isPostMsgSupported : boolean =  window[POST_MESSAGE] ? true : false;


    /**
     * Post data to target window
     * 
     * @param {any} message Data to be sent to the other window
     * @param {object} target A reference to the other frame this window is attempting to communicate with
     * @param {string} targetOrigin Specifies what the origin of otherWindow must be for the event to be dispatched, 
     * either as the literal string "*" (indicating no preference) or as a URI
     * @param {any} transfer is a sequence of Transferable objects that are transferred with the message.
     */
    static post(message: any, target: object = window.parent, targetOrigin: string = '*', transfer?: any[]){
        if(!this.isPostMsgSupported){
            return false;
        }

        message = JSON.stringify(message);
        target[POST_MESSAGE](message, targetOrigin, transfer);
    }

    /**
     * Receives data from source window
     * 
     * @param {string} sourceOrigin Specifies what the origin of otherWindow must be for the event to be rceived
     * @return {JQueryDeferred<object>} 
     */
    static get(callback: (e: Event, message: any) => void, sourceOrigin?: string){
        if(!this.isPostMsgSupported){
            return false;
        }

        var eventMethod                = window.addEventListener ? "addEventListener" : "attachEvent";
        var getMessage                 = window[eventMethod];
        var messageEvent               = eventMethod == "attachEvent" ? "onmessage" : "message";

        getMessage(messageEvent, function(e){

            if(sourceOrigin && (e.origin !== sourceOrigin)){
                return
            }
            var message = JSON.parse(e.data);

            callback(e, message);

        }, false);
    }

}