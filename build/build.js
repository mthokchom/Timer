var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("utils/ts/service", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Service = (function () {
        function Service(serviceUrl, serviceSettings) {
            this.serviceUrl = serviceUrl;
            this.serviceSettings = serviceSettings;
        }
        Service.prototype.setToStorage = function (data, method) {
            var settings = this.serviceSettings;
            settings.method = method || 'POST';
            if (data) {
                settings.data = data;
            }
            return this.service(this.serviceUrl, settings);
        };
        Service.prototype.getFromStorage = function (data, method) {
            var settings = this.serviceSettings;
            settings.method = method || 'GET';
            if (data) {
                settings.data = data;
            }
            return this.service(this.serviceUrl, settings);
        };
        Service.prototype.service = function (url, settings) {
            return $.ajax(url, settings);
        };
        return Service;
    }());
    exports.Service = Service;
});
define("popup/ts/popup-widget", ["require", "exports", "utils/ts/service"], function (require, exports, service_1) {
    "use strict";
    exports.__esModule = true;
    var PopupWidget = (function () {
        function PopupWidget(popupid, settings) {
            this._defaultSettings = {
                serviceSetting: {
                    dataType: 'JSON'
                },
                getRequestKey: 'jdata'
            };
            this._settings = $.extend({}, this._defaultSettings, settings);
            this._service = new service_1.Service(this._settings.serviceUrl, this._settings.serviceSetting);
            this._popupid = popupid;
            if (!this._settings.serviceUrl) {
                throw ('Popup Service endpoint URL is not provided.');
            }
        }
        PopupWidget.prototype.set = function (data) {
            var _this = this;
            var dfd = $.Deferred();
            this._service.setToStorage(JSON.stringify({
                popupid: this._popupid,
                data: data
            })).done(function (param) {
                _this.get(true);
                dfd.resolve(param);
            });
            return dfd;
        };
        PopupWidget.prototype.get = function (noCache) {
            var _this = this;
            if (noCache === void 0) { noCache = false; }
            var dfd = $.Deferred();
            if (!this._cacheData || noCache) {
                this._service
                    .getFromStorage({ popupid: this._popupid })
                    .done(function (params) {
                    _this._cacheData = params;
                    dfd.resolve(_this._cacheData);
                });
            }
            else {
                dfd.resolve(this._cacheData);
            }
            return dfd;
        };
        return PopupWidget;
    }());
    exports.PopupWidget = PopupWidget;
});
define("utils/ts/event", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this._handlers = [];
        }
        EventDispatcher.prototype.on = function (handler) {
            this._handlers.push(handler);
        };
        EventDispatcher.prototype.off = function (handler) {
            this._handlers = this._handlers.filter(function (h) { return h !== handler; });
        };
        EventDispatcher.prototype.trigger = function (data) {
            this._handlers.slice(0).forEach(function (h) { return h(data); });
        };
        return EventDispatcher;
    }());
    exports.EventDispatcher = EventDispatcher;
});
define("timer/ts/clock", ["require", "exports", "utils/ts/event"], function (require, exports, event_1) {
    "use strict";
    exports.__esModule = true;
    var Clock = (function () {
        function Clock() {
            this._onTick = new event_1.EventDispatcher();
            this._timeOffset = null;
            this.tick();
        }
        Clock.prototype.getTime = function () {
            if (null != this._timeOffset && this._timeOffset) {
                var d = new Date();
                d.setTime(d.getTime() - this._timeOffset);
                return d.getTime();
            }
            return new Date().getTime();
        };
        Clock.prototype.tick = function () {
            var _this = this;
            this._currentTime = this.getTime();
            var _interval = 600;
            this._onTick.trigger(this._currentTime);
            window.setTimeout(function () { return _this.tick(); }, _interval);
        };
        Clock.prototype.setValue = function (time) {
            var t = this.getTime();
            this._timeOffset = t - time;
        };
        Clock.prototype.onTick = function () {
            return this._onTick;
        };
        return Clock;
    }());
    exports.Clock = Clock;
});
define("utils/ts/date-utils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.formatDate = function (date, format, meridianAM, meridianPM) {
            var cache = {};
            cache["YYYY"] = date.getFullYear() + '';
            cache["M"] = date.getMonth() + 1;
            cache["D"] = date.getDate();
            cache["H"] = date.getHours();
            cache["m"] = date.getMinutes();
            cache["s"] = date.getSeconds();
            cache["YY"] = cache["YYYY"].substring(2, 4);
            cache["MM"] = this.padZero(cache["M"]);
            cache["DD"] = this.padZero(cache["D"]);
            cache["HH"] = this.padZero(cache["H"]);
            cache["mm"] = this.padZero(cache["m"]);
            cache["ss"] = this.padZero(cache["s"]);
            var is12Hrs = (format.indexOf('h') !== -1) ? true : false;
            var hours = cache["H"];
            hours = (hours + 24) % 24;
            var mid = hours < 12 ? meridianAM : meridianPM;
            cache["h"] = (hours % 12) || 12;
            cache["hh"] = this.padZero(cache["h"]);
            cache["a"] = mid.toLowerCase();
            cache["A"] = mid.toUpperCase();
            $.each(DateUtils.tokens, function (i, token) {
                format = format.replace(token, cache[token]);
            });
            return format;
        };
        DateUtils.formatDuration = function (durationTimestamp, format) {
            var cache = {};
            var decisec = Math.floor(durationTimestamp / 100) + '';
            var seconds = Math.floor(durationTimestamp / 1000);
            var minutes = Math.floor(durationTimestamp / 60000);
            var hours = Math.floor(durationTimestamp / 3600000);
            decisec = decisec.charAt(decisec.length - 1);
            seconds = seconds - (60 * minutes);
            minutes = minutes - (60 * hours);
            cache["h"] = hours;
            cache["H"] = hours;
            cache["m"] = minutes;
            cache["s"] = seconds;
            cache["hh"] = this.padZero(cache["h"]);
            cache["HH"] = this.padZero(cache["H"]);
            cache["mm"] = this.padZero(cache["m"]);
            cache["ss"] = this.padZero(cache["s"]);
            $.each(DateUtils.tokens, function (i, token) {
                format = format.replace(token, cache[token]);
            });
            return format;
        };
        DateUtils.parseDate = function (date, format) {
            var hasError = false;
            var dateLetterCount = date.length;
            var formLetterCount = format.length;
            var meridian = date.substring(dateLetterCount - 2, dateLetterCount);
            var formatMeridian = format.substring(formLetterCount - 1, formLetterCount);
            formatMeridian = formatMeridian.toLowerCase();
            meridian = meridian.toLowerCase();
            if ((meridian === 'pm' || meridian === 'am') && (formatMeridian === 'a')) {
                format = format.substring(0, formLetterCount - 1);
            }
            var dt = date.split(/[^\d]/);
            var fm = format.match(/[a-zA-Z]+/g);
            var dtFormatMap = {
                year: 0,
                month: 0,
                date: 0,
                hour: 0,
                minute: 0,
                second: 0
            };
            var token = '';
            var partsLength = 0;
            var startPos = 0;
            var endPos = 0;
            var tokens = {
                year: ['YYYY', 'YY'],
                month: ['MM', 'M'],
                date: ['DD', 'D'],
                hour: ['HH', 'hh', 'H', 'h'],
                minute: ['mm', 'm'],
                second: ['ss', 's']
            };
            var val;
            $.each(fm, function (i, token) {
                $.each(tokens, function (tokenName, tokenValue) {
                    if ($.inArray(token, tokenValue) !== -1) {
                        val = parseInt(dt[i], 10);
                        if (tokenName === 'hour' && (token === 'hh' || token === 'h')) {
                            if (meridian === 'pm' && val < 12) {
                                val += 12;
                            }
                            if (meridian === 'am' && val == 12) {
                                val -= 12;
                            }
                        }
                        dtFormatMap[tokenName] = val;
                        return false;
                    }
                });
            });
            if (dtFormatMap.month) {
                dtFormatMap.month = dtFormatMap.month - 1;
            }
            var d = new Date(dtFormatMap.year, dtFormatMap.month, dtFormatMap.date, dtFormatMap.hour, dtFormatMap.minute, dtFormatMap.second);
            if (this.isDate(d)) {
                return d;
            }
            else {
                return null;
            }
        };
        DateUtils.isDate = function (date) {
            if (Object.prototype.toString.call(date) === "[object Date]") {
                if (isNaN(date.getTime())) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        };
        DateUtils.parseDuration = function (duration, format) {
            var dt = duration.split(/[^\d]/);
            var fm = format.match(/[a-zA-Z]+/g);
            var dtFormatMap = {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            var tokens = {
                hours: ['HH', 'hh', 'H', 'h'],
                minutes: ['mm', 'm'],
                seconds: ['ss', 's']
            };
            var token = '';
            var val;
            var meridian;
            var durationLetterCount = duration.length;
            $.each(fm, function (i, token) {
                $.each(tokens, function (tokenName, tokenValue) {
                    if ($.inArray(token, tokenValue) !== -1) {
                        val = parseInt(dt[i], 10);
                        dtFormatMap[tokenName] = val;
                        return false;
                    }
                });
            });
            if (isNaN(dtFormatMap.hours) || isNaN(dtFormatMap.minutes) || isNaN(dtFormatMap.seconds)) {
                return null;
            }
            return dtFormatMap;
        };
        DateUtils.addDateTime = function (target, Y, M, D, H, m, s) {
            var targetY = target.getFullYear();
            var targetM = target.getMonth();
            var targetD = target.getDate();
            var targetH = target.getHours();
            var targetm = target.getMinutes();
            var targets = target.getSeconds();
            targetY += Y;
            targetM += M;
            targetD += D;
            targetH += H;
            targetm += m;
            targets += s;
            target.setFullYear(targetY);
            target.setMonth(targetM);
            target.setDate(targetD);
            target.setHours(targetH);
            target.setMinutes(targetm);
            target.setSeconds(targets);
            return target;
        };
        DateUtils.substractDateTime = function (target, Y, M, D, H, m, s) {
            var targetY = target.getFullYear();
            var targetM = target.getMonth();
            var targetD = target.getDate();
            var targetH = target.getHours();
            var targetm = target.getMinutes();
            var targets = target.getSeconds();
            targetY -= Y;
            targetM -= M;
            targetD -= D;
            targetH -= H;
            targetm -= m;
            targets -= s;
            target.setFullYear(targetY);
            target.setMonth(targetM);
            target.setDate(targetD);
            target.setHours(targetH);
            target.setMinutes(targetm);
            target.setSeconds(targets);
            return target;
        };
        DateUtils.addDuration = function (target, duration, format) {
            var targetiTime = this.parseDuration(target, format);
            var iTimeToAdd = this.parseDuration(duration, format);
            targetiTime = this.addITime(targetiTime, iTimeToAdd);
            return this.formatiTime(targetiTime, format);
        };
        DateUtils.substractDuration = function (target, duration, format) {
            var targetiTime = this.parseDuration(target, format);
            var iTimeToAdd = this.parseDuration(duration, format);
            targetiTime = this.substractITime(targetiTime, iTimeToAdd);
            return DateUtils.formatiTime(targetiTime, format);
        };
        DateUtils.formatiTime = function (itime, format) {
            var cache = {};
            var seconds = itime.seconds;
            var minutes = itime.minutes;
            var hours = itime.hours;
            seconds = Math.floor(itime.seconds % 60);
            minutes = minutes + Math.floor(itime.seconds / 60);
            hours = hours + Math.floor(itime.minutes / 60);
            minutes = Math.floor(minutes % 60);
            cache["h"] = hours;
            cache["H"] = hours;
            cache["m"] = minutes;
            cache["s"] = seconds;
            cache["hh"] = this.padZero(cache["h"]);
            cache["HH"] = this.padZero(cache["H"]);
            cache["mm"] = this.padZero(cache["m"]);
            cache["ss"] = this.padZero(cache["s"]);
            $.each(DateUtils.tokens, function (i, token) {
                format = format.replace(token, cache[token]);
            });
            return format;
        };
        DateUtils.addITime = function (target, itime) {
            if (itime.year) {
                target.year += itime.year;
            }
            if (itime.months) {
                target.months += itime.months;
            }
            if (itime.date) {
                target.date += itime.date;
            }
            if (itime.hours) {
                target.hours += itime.hours;
            }
            if (itime.minutes) {
                target.minutes += itime.minutes;
            }
            if (itime.seconds) {
                target.seconds += itime.seconds;
            }
            if (itime.timestamp) {
                target.timestamp += (itime.timestamp - target.timestamp);
            }
            return target;
        };
        DateUtils.substractITime = function (target, itime) {
            if (itime.year) {
                target.year -= itime.year;
            }
            if (itime.months) {
                target.months -= itime.months;
            }
            if (itime.date) {
                target.date -= itime.date;
            }
            if (itime.hours) {
                target.hours -= itime.hours;
            }
            if (itime.minutes) {
                target.minutes -= itime.minutes;
            }
            if (itime.seconds) {
                target.seconds -= itime.seconds;
            }
            if (itime.timestamp) {
                target.timestamp -= (itime.timestamp - target.timestamp);
            }
            return target;
        };
        DateUtils.padZero = function (num) {
            var strNum = num.toString();
            if (strNum.length > 2) {
                return strNum;
            }
            var str = '0' + strNum;
            return str.slice(-2);
        };
        return DateUtils;
    }());
    DateUtils.tokens = ['YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's', 'a', 'A'];
    exports.DateUtils = DateUtils;
});
define("timer/ts/timer", ["require", "exports", "timer/ts/clock"], function (require, exports, clock_1) {
    "use strict";
    exports.__esModule = true;
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer() {
            var _this = _super.call(this) || this;
            _this.reset();
            return _this;
        }
        Timer.prototype.start = function (time) {
            if (time) {
                this._startTime = this._currentTime - (time - this._currentTime);
            }
            else {
                this._startTime = this._currentTime;
            }
            this._running = true;
        };
        Timer.prototype.stop = function () {
            if (this._running) {
                this._stopTime = this._currentTime;
            }
            this._running = false;
        };
        Timer.prototype.pause = function () {
            this._running = false;
        };
        Timer.prototype.resume = function () {
            this._running = true;
        };
        Timer.prototype.reset = function () {
            this._startTime = this._currentTime;
            this._stopTime = this._currentTime;
            this._running = false;
        };
        Timer.prototype.getValue = function () {
            var timerValue = {
                duration: ((this._running ? this._currentTime : this._stopTime) - this._startTime) || 0,
                currentTime: this._currentTime,
                startTime: this._startTime
            };
            return timerValue;
        };
        Timer.prototype.setValue = function (time) {
            if (!this._startTime || this._running) {
                this._startTime = this._currentTime - time;
            }
            if (!this._running) {
                this._stopTime = this._startTime + time;
            }
        };
        Timer.prototype.getStatus = function () {
            return this._running;
        };
        return Timer;
    }(clock_1.Clock));
    exports.Timer = Timer;
});
define("timer/ts/timer-widget", ["require", "exports", "utils/ts/date-utils", "utils/ts/service", "utils/ts/event", "timer/ts/timer"], function (require, exports, date_utils_1, service_2, event_2, timer_1) {
    "use strict";
    exports.__esModule = true;
    var ERROR;
    (function (ERROR) {
        ERROR[ERROR["ALREADY_TIMER_RUNNING"] = 0] = "ALREADY_TIMER_RUNNING";
        ERROR[ERROR["CAN_START_ONLY_FROM_APPLICATION"] = 1] = "CAN_START_ONLY_FROM_APPLICATION";
    })(ERROR = exports.ERROR || (exports.ERROR = {}));
    var TIMER_STATUS;
    (function (TIMER_STATUS) {
        TIMER_STATUS[TIMER_STATUS["UNSTARTED"] = 0] = "UNSTARTED";
        TIMER_STATUS[TIMER_STATUS["STARTED"] = 1] = "STARTED";
        TIMER_STATUS[TIMER_STATUS["STOP"] = 2] = "STOP";
    })(TIMER_STATUS = exports.TIMER_STATUS || (exports.TIMER_STATUS = {}));
    var EVENTS;
    (function (EVENTS) {
        EVENTS[EVENTS["ON_START_TIMER"] = 0] = "ON_START_TIMER";
        EVENTS[EVENTS["ON_STOP_TIMER"] = 1] = "ON_STOP_TIMER";
        EVENTS[EVENTS["ON_TICK_TIMER"] = 2] = "ON_TICK_TIMER";
        EVENTS[EVENTS["ON_CLICK_TIMER"] = 3] = "ON_CLICK_TIMER";
        EVENTS[EVENTS["ON_ERROR_TIMER"] = 4] = "ON_ERROR_TIMER";
    })(EVENTS = exports.EVENTS || (exports.EVENTS = {}));
    var TimerWidget = (function () {
        function TimerWidget(timmerid, settings) {
            var _this = this;
            this._defaultSettings = {
                dataInstanceName: '_TIMER_INSTANCE',
                servicePingInterval: 15,
                serviceSetting: {
                    dataType: 'JSON'
                },
                getRequestKey: 'jdata',
                activeClass: 'active',
                startDateFormat: 'DD/MM/YYYY',
                startLongTimeFormat: 'hh:mm:ssA',
                startShortTimeFormat: 'hh:mmA',
                stopDateFormat: 'DD/MM/YYYY',
                stopLongTimeFormat: 'hh:mm:ssA',
                stopShortTimeFormat: 'hh:mmA',
                durationFormat: 'HH:mm:ss',
                meridianAM: 'AM',
                meridianPM: 'PM'
            };
            this._settings = $.extend({}, this._defaultSettings, settings);
            if (!this._settings.serviceUrl) {
                throw ('Service endpoint URL is not provided.');
            }
            if (!(this._settings.$element instanceof jQuery)) {
                this._settings.$element = $(this._settings.$element);
            }
            this._settings.servicePingInterval = 1000 * this._settings.servicePingInterval;
            this._status = 0;
            this._timer = new timer_1.Timer();
            this._service = new service_2.Service(this._settings.serviceUrl, this._settings.serviceSetting);
            this._onTimerTick = new event_2.EventDispatcher();
            this._onTimerClick = new event_2.EventDispatcher();
            this._onTimerStart = new event_2.EventDispatcher();
            this._onTimerStop = new event_2.EventDispatcher();
            this._onTimerError = new event_2.EventDispatcher();
            this._isReady = false;
            this._timmerid = timmerid;
            this._responseData = {};
            this._timer.onTick().on(function (time) {
                _this.init();
            });
            this._settings.$element.on('click', function (e) {
                _this._onTimerClick.trigger({
                    event: e,
                    status: _this._status,
                    response: _this._responseData,
                    element: _this._settings.$element
                });
            });
            this.pingServer();
            window.setInterval(function () {
                _this.pingServer();
            }, this._settings.servicePingInterval);
            this.init();
        }
        TimerWidget.prototype.init = function () {
            this._duration = this._timer.getValue().duration;
            if (this._status !== 2) {
                this.updateTime(this._settings.$element);
            }
        };
        TimerWidget.prototype.onTick = function (fn) {
            var _this = this;
            this._timer.onTick().on(function (time) {
                fn(time, _this._status, _this._responseData, _this._settings.$element);
            });
        };
        TimerWidget.prototype.on = function (eventName, fn) {
            var _eventDispatcher = this.getEvent(eventName);
            if (_eventDispatcher) {
                _eventDispatcher.on(fn);
            }
        };
        TimerWidget.prototype.off = function (eventName, fn) {
            var _eventDispatcher = this.getEvent(eventName);
            if (_eventDispatcher) {
                _eventDispatcher.off(fn);
            }
        };
        TimerWidget.prototype.trigger = function (eventName, params) {
            var _eventDispatcher = this.getEvent(eventName);
            if (_eventDispatcher) {
                _eventDispatcher.trigger(params);
            }
        };
        TimerWidget.prototype.getTimerId = function () {
            return this._timmerid;
        };
        TimerWidget.prototype.getStatus = function () {
            return this._status;
        };
        TimerWidget.prototype.getOptions = function () {
            return this._settings;
        };
        TimerWidget.prototype.throwError = function (errorType) {
            this.trigger(4, {
                error: errorType
            });
        };
        TimerWidget.prototype.startTimer = function (params) {
            var _this = this;
            var timerInstance = this.getInstance();
            if (timerInstance) {
                this.throwError(0);
                return;
            }
            this.setInstance(this);
            this._status = 1;
            var durtaionFrom = (typeof params == 'string') ? params : params.duration;
            if (durtaionFrom) {
                var dt = new Date(this._timer.getValue().currentTime);
                var duration = date_utils_1.DateUtils.parseDate(durtaionFrom, this._settings.durationFormat);
                dt = date_utils_1.DateUtils.addDateTime(dt, 0, 0, 0, duration.getHours(), duration.getMinutes(), duration.getSeconds());
                this._timer.start(dt.getTime());
            }
            else {
                this._timer.start();
            }
            if (typeof params !== 'string') {
                var serviceResponse = this._service.setToStorage(JSON.stringify({
                    timerid: this._timmerid,
                    status: this._status,
                    params: params.params
                }));
                serviceResponse.done(function (data) {
                    _this.sync(data);
                });
            }
            this.trigger(0, {
                params: params,
                duration: this.getFormatedDuration(),
                status: this._status
            });
        };
        TimerWidget.prototype.stopTimer = function () {
            if (this._status !== 1) {
                return;
            }
            this._timer.stop();
            this._status = 2;
            this._settings.$element.removeClass(this._settings.activeClass);
            this.setInstance(null);
            this._service.setToStorage(JSON.stringify({
                timerid: this._timmerid,
                status: this._status
            }));
            this.trigger(1, {
                params: this._responseData.params,
                status: this._status,
                duration: this.getFormatedDuration()
            });
        };
        TimerWidget.prototype.getCurrentDateTime = function (startDateFormat, startTimeFormat) {
            var startDate = new Date();
            var startTime = new Date();
            startDateFormat = startDateFormat || this._settings.startDateFormat;
            startTimeFormat = startTimeFormat || this._settings.startLongTimeFormat;
            var strStartDate = date_utils_1.DateUtils.formatDate(startDate, startDateFormat, this._settings.meridianAM, this._settings.meridianPM);
            var strStartTime = date_utils_1.DateUtils.formatDate(startTime, startTimeFormat, this._settings.meridianAM, this._settings.meridianPM);
            return {
                strStartDate: strStartDate,
                strStartTime: strStartTime
            };
        };
        TimerWidget.prototype.updateTime = function ($element) {
            var status = this._timer.getStatus();
            var d = new Date();
            var strDuration = this.getFormatedDuration();
            this.trigger(2, {
                duration: strDuration,
                status: status,
                params: this._responseData.params
            });
            if ($element instanceof jQuery) {
                this.draw($element, strDuration);
            }
        };
        TimerWidget.prototype.reset = function (commitFlag) {
            if (commitFlag === void 0) { commitFlag = true; }
            TimerWidget._timer_cache[this._settings.dataInstanceName] = null;
            this._status = 0;
            if (commitFlag) {
                this._service.setToStorage(JSON.stringify({
                    timerid: this._timmerid,
                    status: this._status
                }));
            }
            this._timer.reset();
        };
        TimerWidget.prototype.getFormatedDuration = function (duration, format) {
            if (format === void 0) { format = this._settings.durationFormat; }
            this._duration = this._timer.getValue().duration;
            duration = $.type(duration) === 'undefined' ? this._duration : duration;
            return date_utils_1.DateUtils.formatDuration(duration, format);
        };
        TimerWidget.prototype.pingServer = function (data, forceStart) {
            var _this = this;
            if (data === void 0) { data = {}; }
            data.timerid = data.timerid || this._timmerid;
            var serviceResponse = this._service.getFromStorage(data);
            serviceResponse.done(function (data) {
                _this.sync(data, forceStart);
            });
        };
        TimerWidget.prototype.getEvent = function (eventName) {
            var _eventDispatcher;
            switch (eventName) {
                case 0:
                    _eventDispatcher = this._onTimerStart;
                    break;
                case 1:
                    _eventDispatcher = this._onTimerStop;
                    break;
                case 3:
                    _eventDispatcher = this._onTimerClick;
                    break;
                case 2:
                    _eventDispatcher = this._onTimerTick;
                    break;
                case 4:
                    _eventDispatcher = this._onTimerError;
                    break;
            }
            return _eventDispatcher;
        };
        TimerWidget.prototype.getInstance = function () {
            return TimerWidget._timer_cache[this._settings.dataInstanceName];
        };
        TimerWidget.prototype.setInstance = function (instance) {
            TimerWidget._timer_cache[this._settings.dataInstanceName] = instance;
        };
        TimerWidget.prototype.onReady = function () {
            if (this._isReady) {
                return;
            }
            this._isReady = true;
            if (typeof this._settings.onReady === 'function') {
                this._settings.onReady(this._status);
            }
        };
        TimerWidget.prototype.sync = function (data, forceStart) {
            var parsedData;
            var instance = this.getInstance();
            parsedData = this.parseData(data);
            this._responseData = parsedData;
            if (!forceStart && ($.type(data) !== 'object' || (($.type(data) === 'object') && (parsedData.status !== 1)))) {
                if (parsedData.status === 2) {
                    this._timer.stop();
                    this._status = 2;
                }
                else {
                    this._timer.reset();
                    this._status = 0;
                }
                if (parsedData.duration) {
                    this.setTime(data);
                }
                this.trigger(1, {
                    params: this._responseData.params,
                    duration: this.getFormatedDuration(parsedData.duration),
                    status: this._status
                });
                if (instance && (instance.getTimerId() === this._timmerid)) {
                    this.setInstance(null);
                    this._settings.$element.removeClass(this._settings.activeClass);
                }
                this.onReady();
                this.updateTime(this._settings.$element);
                return;
            }
            if (!this._timer.getStatus()) {
                this._timer.start();
                this._status = 1;
                var duration;
                if (parsedData.duration) {
                    duration = this.getFormatedDuration(parsedData.duration);
                }
                else {
                    duration = this.getFormatedDuration();
                }
                this.trigger(0, {
                    params: this._responseData.params,
                    duration: duration,
                    status: this._status
                });
            }
            if (!this._timer.getStatus() && parsedData.status !== 1) {
                this.onReady();
                return;
            }
            if (!this._settings.$element.hasClass(this._settings.activeClass) && !instance) {
                this.setInstance(this);
                this._settings.$element.addClass(this._settings.activeClass);
            }
            if (parsedData.duration !== this._timer.getValue().duration) {
                this.setTime(data);
            }
            this.onReady();
        };
        TimerWidget.prototype.setTime = function (data) {
            data = this.parseData(data);
            if (data.duration) {
                this._timer.setValue(data.duration);
                this._duration = this._timer.getValue().duration;
                return;
            }
        };
        TimerWidget.prototype.parseData = function (data) {
            data = data || '{}';
            data = (typeof data === 'string') ? JSON.parse(data) : data;
            data = ($.type(data) === 'array') ? data[0] : data;
            if ($.type(data) !== 'object') {
                data = {};
            }
            return data;
        };
        TimerWidget.prototype.getDuration = function () {
            return this._timer.getValue().duration;
        };
        TimerWidget.prototype.draw = function ($elem, txt) {
            $elem.text(txt);
        };
        TimerWidget.prototype.alert = function (msg) {
            alert(msg);
        };
        return TimerWidget;
    }());
    TimerWidget._timer_cache = {};
    exports.TimerWidget = TimerWidget;
});
define("utils/ts/post-message", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var POST_MESSAGE = 'postMessage';
    var PostMessage = (function () {
        function PostMessage() {
        }
        PostMessage.post = function (message, target, targetOrigin, transfer) {
            if (target === void 0) { target = window.parent; }
            if (targetOrigin === void 0) { targetOrigin = '*'; }
            if (!this.isPostMsgSupported) {
                return false;
            }
            message = JSON.stringify(message);
            target[POST_MESSAGE](message, targetOrigin, transfer);
        };
        PostMessage.get = function (callback, sourceOrigin) {
            if (!this.isPostMsgSupported) {
                return false;
            }
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var getMessage = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
            getMessage(messageEvent, function (e) {
                if (sourceOrigin && (e.origin !== sourceOrigin)) {
                    return;
                }
                var message = JSON.parse(e.data);
                callback(e, message);
            }, false);
        };
        return PostMessage;
    }());
    PostMessage.isPostMsgSupported = window[POST_MESSAGE] ? true : false;
    exports.PostMessage = PostMessage;
});
define("utils/ts/index", ["require", "exports", "utils/ts/event", "utils/ts/post-message", "utils/ts/service", "utils/ts/date-utils"], function (require, exports, event_3, post_message_1, service_3, date_utils_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    exports.__esModule = true;
    __export(event_3);
    __export(post_message_1);
    __export(service_3);
    __export(date_utils_2);
});
