/**
 *  Popup Widget
 *  
 *  @version 1.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

import {Service} from '../../utils/ts/service';

export interface IPopupWidgetSettings{
    serviceUrl?               : string,
    serviceSetting            : {
		dataType              : string
	},
    getRequestKey             : string
}

export class PopupWidget{

	private _service          : Service;
    private _settings         : IPopupWidgetSettings;
    private _popupid          : any;
    private _cacheData        : object;

    private _defaultSettings  : IPopupWidgetSettings = {
		serviceSetting        : {
			dataType          : 'JSON'
		},
		getRequestKey         : 'jdata'
	}

    constructor(popupid: any, settings?: IPopupWidgetSettings){
       this._settings                     =  $.extend({}, this._defaultSettings, settings);
       this._service                      = new Service(this._settings.serviceUrl, this._settings.serviceSetting);
       this._popupid                      = popupid;

       if(!this._settings.serviceUrl){
            throw('Popup Service endpoint URL is not provided.');
        }
    }


    public set(data: object): JQueryDeferred<object>{
        var dfd:JQueryDeferred<object> = $.Deferred<object>();
        this._service.setToStorage(JSON.stringify({
		    popupid     : this._popupid, 
            data   	    : data
        })).done((param)=>{
           this.get(true);
           dfd.resolve(param);
        });
    
        return dfd;
    }

    public get(noCache: boolean = false): JQueryDeferred<object>{
        var dfd:JQueryDeferred<object> = $.Deferred<object>();

        if(!this._cacheData || noCache){
            this._service
                .getFromStorage({popupid: this._popupid})
                .done((params) => {
                    this._cacheData = params;
                    dfd.resolve(this._cacheData);
                });
        }
        else{
            dfd.resolve(this._cacheData);
        }

        return dfd;
    }


}