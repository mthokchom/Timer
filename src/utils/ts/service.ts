/**
 *  Service
 *  
 *  @version 1.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

export class Service{

    private serviceUrl: string;
    private serviceSettings: JQueryAjaxSettings;
    /**
     * Constructor
     * 
     * @param {string} serviceUrl Endpoint url
     * @param {JQueryAjaxSettings} serviceSettings Settings for ajax
     */
    constructor(serviceUrl: string, serviceSettings: JQueryAjaxSettings){
        this.serviceUrl      = serviceUrl;
        this.serviceSettings = serviceSettings;
    }

    /**
     * setToStorage
     * 
     * @description Sends data to the server 
     * @param {any} data optional parameter to be passed
     * @param {any} method optional method type 
     * @return {JQueryXHR}
     */
    public setToStorage(data?: any, method?: string): JQueryXHR{
        var settings         = <any>this.serviceSettings;
        settings.method      = method || 'POST';

        if(data){
            settings.data    = data;
        }

        return this.service(this.serviceUrl, settings);
    }

    /**
     *  getFromStorage
     * 
     * @description Gets data from the server 
     * @param {any} data optional parameter to be passed
     * @param {any} method optional method type 
     * @return {JQueryXHR}
     */
    public getFromStorage(data?: any, method?: string): JQueryXHR{
        var settings    = <any>this.serviceSettings;
        settings.method = method || 'GET';

        if(data){
            settings.data = data;
        }

        return this.service(this.serviceUrl, settings);
    }

    /**
     *  A wrapper function for Ajax 
     * 
     *  @param {string} url Server endpoint where the ajax request will be made
     *  @param {JQueryAjaxSettings} settings An optional jquery ajax settings object
     *  @return {JQueryXHR}
     */
    private service(url: string, settings?: JQueryAjaxSettings): JQueryXHR{
        return $.ajax(url, settings);
    }
}