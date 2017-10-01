(function(){
    // Popup Window
    var scrollTop = '';
    var newHeight = '100';

    $(window).bind('scroll', function() {
        scrollTop = $( window ).scrollTop();
        newHeight = scrollTop + 100;
    });

    window.popupTimer = {
        config: {
            popupSelector: '#timer-popup',
            popupTrigger: '.timer-popup-trigger',
            popupCloseBtn: '.popup-btn-close'
        },

        init: function(settings){
            this.settings           = $.extend(true, this.config, settings);
            this.settings.$popup    = $(this.settings.popupSelector); 
            this.settings.$trigger  = $(this.settings.popupTrigger);
            this.settings.$closeBtn = $(this.settings.popupCloseBtn, this.settings.$popup);
            this.bindEvent();
        },

        bindEvent: function(){
            var self = this;

            this.settings.$trigger.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();

                var $elem    = $(this);
                var params   = $elem.attr('href');

                if(!params){
                    return;
                }
                params   = self.getParams(params);

                self.openTimerPopup(params);
            });

            this.settings.$closeBtn.on('click', function(){
                self.hideTimerPopup();
            });

            $('html').on('click', function(){
                self.hideTimerPopup();
            });
        },

        getParams: function(str){
            if(typeof str !== 'string'){
                return;
            }

            var self  = this;
            var start = str.indexOf('?');
            var out   = '';

            if(start !== -1){
                out   = str.substring(start + 1);
            }

            return out;
        },

        getStrParamToObject: function(qs){
            var params    = qs.split('&');
            var out       = {};

            $.each(params, function(i, item){
                var keyValue = item.split('=');
                var key      = keyValue[0];
                if(typeof key !== 'undefined'){
                    out[key] = keyValue[1];
                }

            });

            return out;
        },

        getObjParamToString: function(params){
            var out        = '';
            var isBegining = true;

            $.each(params, function(key, value){
                if(!isBegining){
                    out += '&';
                }
                out += key +'='+ value;
                isBegining = false;

            });

            return out;
        },

        openTimerPopup: function(params){
            var self = this;

            if(jQuery(window).width() < 767) {
                this.settings.$popup.addClass('popup-mobile').css('top', 0).toggle();
                
                $('html, body').animate({
                    scrollTop: self.settings.$popup.offset().top
                }, 500);

            } else {
                self.settings.$popup.hide();
                self.settings.$popup.removeClass('popup-mobile').css('top', newHeight).toggle();

            };

            var $iframe = self.settings.$popup.find('iframe');

            if($iframe.length){
                var src        = $iframe.attr('src');
                var hasQueryAt = src.indexOf('?');
                var url        = src;

                if(hasQueryAt !== -1){
                    url = src.substring(0, hasQueryAt);
                }

                var objParam     = (typeof params === 'object') ? params : self.getStrParamToObject(params);
                objParam['_rnd'] = Math.random();
                params           = self.getObjParamToString(objParam);
                $iframe.attr('src', url +'?'+ params);
            }

        },

        hideTimerPopup: function(){
            this.settings.$popup.hide();
        }
    }

})();