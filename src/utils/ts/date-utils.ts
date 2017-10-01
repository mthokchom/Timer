/**
 *  DateUtils
 *  
 *  @version 1.0
 *  @author M Thokchom (thokchomonline@gmail.com)
 */

export interface iTime{
	year?      : number,
	months?    : number,
	date?      : number,
	day?       : number,
	hours?     : number,
	minutes?   : number,
	seconds?   : number,
	timestamp? : number
}

export class DateUtils{

    public static tokens  : string[] = ['YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's', 'a', 'A'];
	

    /**
	 * formatDate
	 * 
	 * @description Formates a date object to the provided format
	 * @param date {Date} a date
	 * @param format {string} a format string
	 * @return {string} a formated date string
	 */
	public static formatDate(date: Date, format: string, meridianAM: string, meridianPM: string): string{
		var cache     = {};
		cache["YYYY"] = date.getFullYear() +'';
		cache["M"]    = date.getMonth() + 1;
		cache["D"]    = date.getDate();
		cache["H"]    = date.getHours();
		cache["m"]    = date.getMinutes();
		cache["s"]    = date.getSeconds();

		cache["YY"]   = cache["YYYY"].substring(2, 4);
		cache["MM"]   = this.padZero(cache["M"]);
		cache["DD"]   = this.padZero(cache["D"]);
		cache["HH"]   = this.padZero(cache["H"]);
		cache["mm"]   = this.padZero(cache["m"]);
		cache["ss"]   = this.padZero(cache["s"]);
		
		var is12Hrs   = (format.indexOf('h') !== -1) ?  true : false;
		var hours     = cache["H"];
		hours         = (hours + 24) % 24; 
		// get am/pm
		var mid       = hours < 12 ? meridianAM : meridianPM;
		// convert to 12-hour style
		cache["h"]    = (hours % 12) || 12;
		cache["hh"]   = this.padZero(cache["h"]);
		cache["a"]    = mid.toLowerCase();
		cache["A"]    = mid.toUpperCase();

		$.each(DateUtils.tokens, (i, token) => {
			format = format.replace(token, cache[token]);
		});

		return format;

	}

	/**
	 *  Utility function to format duration
	 * 
	 *  @param {number} durationTimestamp A duration in timestamp to be formated
	 *  @param {string} displaySeconds A boolean to determine to display seconds or not
	 *  @return {string} formated timer time
	 */
	public static formatDuration(durationTimestamp: number, format: string): string{
		var cache     = {};
		var decisec   = Math.floor(durationTimestamp/100) +'';
		var seconds   = Math.floor(durationTimestamp/1000);
		var minutes   = Math.floor(durationTimestamp/60000);
		var hours     = Math.floor(durationTimestamp/3600000);
		decisec       = decisec.charAt(decisec.length - 1);
		seconds       = seconds - (60 * minutes);
		minutes       = minutes - (60 * hours); 

		cache["h"]    = hours;
		cache["H"]    = hours;
		cache["m"]    = minutes;
		cache["s"]    = seconds;
		cache["hh"]   = this.padZero(cache["h"]);
		cache["HH"]   = this.padZero(cache["H"]);
		cache["mm"]   = this.padZero(cache["m"]);
		cache["ss"]   = this.padZero(cache["s"]);

		$.each(DateUtils.tokens, (i, token) => {
			format = format.replace(token, cache[token]);
		});

		return format;

	}


	/**
	 * Parses a date string based on the format provided
	 * 
	 * @param date {string} a date string
	 * @param format {string} {string} a format string of the date
	 * @return {Date} Date object, null if fails 
	 */
	public static parseDate(date: string, format: string): Date | null{
		var hasError                = false;
		var dateLetterCount: number = date.length;
		var formLetterCount         = format.length;
		var meridian                = date.substring(dateLetterCount - 2, dateLetterCount);
		var formatMeridian          = format.substring(formLetterCount - 1, formLetterCount);
		formatMeridian              = formatMeridian.toLowerCase();
		meridian                    = meridian.toLowerCase();

		if((meridian === 'pm' || meridian === 'am') && (formatMeridian === 'a')){
			format                  = format.substring(0, formLetterCount - 1);
		}

		var dt:string[]     = date.split(/[^\d]/);
		var fm:string[]     = format.match(/[a-zA-Z]+/g);


		var dtFormatMap: {
			year?   : number,
			month?  : number,
			date?   : number,
			hour?   : number,
			minute? : number,
			second? : number
		} = {
			year    : 0,
			month   : 0,
			date    : 0,
			hour    : 0,
			minute  : 0,
			second  : 0
		};

		var token       = '';
		var partsLength = 0;
		var startPos    = 0;
		var endPos      = 0;
		var tokens      = {
			year   : ['YYYY', 'YY'],
		    month  : ['MM', 'M'],
			date   : ['DD', 'D'],
			hour   : ['HH', 'hh', 'H', 'h'],
			minute : ['mm', 'm'],
			second : ['ss', 's']
		}
		var val: number;
		

		$.each(fm, (i, token) => {
			$.each(tokens, (tokenName, tokenValue) => {
				if($.inArray(token, tokenValue) !== -1){
					val = parseInt(dt[i], 10);
					
					if(tokenName === 'hour' && (token === 'hh' || token === 'h')){
						if(meridian === 'pm' && val < 12){
							val += 12;
						}
						
						if(meridian === 'am' && val == 12){
							val -= 12;
						}
					}

					dtFormatMap[tokenName] = val;
					return false;
				}
			});
		});

		if(dtFormatMap.month){
			dtFormatMap.month = dtFormatMap.month - 1;
		}
		
		var d = new Date(dtFormatMap.year, dtFormatMap.month, dtFormatMap.date, dtFormatMap.hour, dtFormatMap.minute, dtFormatMap.second);
		
		if(this.isDate(d)){
			return d;
		}
		else{
			return null;
		}

	}

	/**
	 * Checks for a valid Date
	 * 
	 * @param date date to be check
	 * @return {boolean} boolean whether it is valid date
	 */
	public static isDate(date: Date): boolean{
		if(Object.prototype.toString.call(date) === "[object Date]" ) {
			if(isNaN(date.getTime())){  
				return false;
			}else {
				return true;
			}
		}
		else {
			return false;
		}
	}

	/**
	 * parseDuration
	 * 
	 * @description Parses a date string based on the format provided
	 * @param duration {string} a formatted duration string
	 * @param format {string} {string} a format string of the date
	 * @return {Date} Date object 
	 */
	public static parseDuration(duration: string, format: string): iTime | null{
		var dt:string[] = duration.split(/[^\d]/);
		var fm:string[] = format.match(/[a-zA-Z]+/g);
		var dtFormatMap: iTime = {
			hours    : 0,
			minutes  : 0,
			seconds  : 0
		};
		var tokens: object = {
			hours   : ['HH', 'hh', 'H', 'h'],
			minutes : ['mm', 'm'],
			seconds : ['ss', 's']
		}

		var token       = '';
		var val: number;
		var meridian: string;
		var durationLetterCount: number = duration.length;

		$.each(fm, (i, token) => {
			$.each(tokens, (tokenName, tokenValue) => {
				if($.inArray(token, tokenValue) !== -1){
					val = parseInt(dt[i], 10);
					dtFormatMap[tokenName] = val;

					return false;
				}
			});
		});

		if(isNaN(dtFormatMap.hours) || isNaN(dtFormatMap.minutes) || isNaN(dtFormatMap.seconds)){
			return null
		}

		return dtFormatMap;

	}

	/**
	 * addTime
	 * 
	 * @param {Date} target 
	 * @param {number} Y 
	 * @param {number} M 
	 * @param {number} D 
	 * @param {number} H 
	 * @param {number} m 
	 * @param {number} s 
	 * @return {Date}
	 */
	public static addDateTime(target: Date, Y: number, M: number, D: number, H: number, m: number, s: number): Date{
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
	}

	/**
	 * addTime
	 * 
	 * @param {Date} target 
	 * @param {number} Y 
	 * @param {number} M 
	 * @param {number} D 
	 * @param {number} H 
	 * @param {number} m 
	 * @param {number} s 
	 * @return {Date}
	 */
	public static substractDateTime(target: Date, Y: number, M: number, D: number, H: number, m: number, s: number): Date{
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
	}

	/*
	public static substractDateTime(timestamp1: number, timestamp2: number): Date{
		var times1 = new Date(timestamp1);
		var times2 = new Date(timestamp2);

		var milliseconds = times1.getMilliseconds() - times2.getMilliseconds();
		var seconds      = times1.getSeconds() - times2.getSeconds();
		var minutes      = times1.getMinutes() - times2.getMinutes();
		var hours        = times1.getHours() - times2.getHours();
		return new Date(0, 0, 0, hours, minutes, seconds);
	}*/

	public static addDuration(target: string, duration: string, format: string){
		var targetiTime = this.parseDuration(target, format);
		var iTimeToAdd  = this.parseDuration(duration, format);

		targetiTime    = this.addITime(targetiTime, iTimeToAdd);
		return this.formatiTime(targetiTime, format);
	}

	public static substractDuration(target: string, duration: string, format: string){
		var targetiTime = this.parseDuration(target, format);
		var iTimeToAdd  = this.parseDuration(duration, format);

		targetiTime    = this.substractITime(targetiTime, iTimeToAdd);
		return DateUtils.formatiTime(targetiTime, format);
    }
    
    /**
	 *  Utility function to format duration
	 * 
	 *  @param {number} durationTimestamp A duration in timestamp to be formated
	 *  @param {string} displaySeconds A boolean to determine to display seconds or not
	 *  @return {string} formated timer time
	 */
	private static formatiTime(itime: iTime, format: string): string{
		var cache     = {};
		
		var seconds   = itime.seconds;
		var minutes   = itime.minutes
		var hours     = itime.hours;
		
		seconds       = Math.floor(itime.seconds % 60);
		minutes       = minutes + Math.floor(itime.seconds / 60); 
		hours         = hours + Math.floor(itime.minutes / 60);
		minutes       = Math.floor(minutes % 60);

		cache["h"]    = hours;
		cache["H"]    = hours;
		cache["m"]    = minutes;
		cache["s"]    = seconds;
		cache["hh"]   = this.padZero(cache["h"]);
		cache["HH"]   = this.padZero(cache["H"]);
		cache["mm"]   = this.padZero(cache["m"]);
		cache["ss"]   = this.padZero(cache["s"]);

		$.each(DateUtils.tokens, (i, token) => {
			format = format.replace(token, cache[token]);
		});

		return format;

	}

	 private static addITime(target: iTime, itime: iTime): iTime{
		if(itime.year){
			target.year += itime.year;
		}

		if(itime.months){
			target.months += itime.months;
		}

		if(itime.date){
			target.date += itime.date;
		}

		if(itime.hours){
			target.hours += itime.hours;
		}

		if(itime.minutes){
			target.minutes += itime.minutes;
		}

		if(itime.seconds){
			target.seconds += itime.seconds;
		}

		if(itime.timestamp){
			target.timestamp += (itime.timestamp - target.timestamp) 
		}

		return target;
	 }

	 private static substractITime(target: iTime, itime: iTime): iTime{
		if(itime.year){
			target.year -= itime.year;
		}

		if(itime.months){
			target.months -= itime.months;
		}

		if(itime.date){
			target.date -= itime.date;
		}

		if(itime.hours){
			target.hours -= itime.hours;
		}

		if(itime.minutes){
			target.minutes -= itime.minutes;
		}

		if(itime.seconds){
			target.seconds -= itime.seconds;
		}

		if(itime.timestamp){
			target.timestamp -= (itime.timestamp - target.timestamp) 
		}

		return target;
     }
     
     /**
	 *  Utility function to format a given number to two digit
	 * 
	 *  @param {number} num A number which will be formatted to two digit
	 *  @return {string} A string formated number with zero padded
	 */
	private static padZero(num: number): string{
		var strNum  = num.toString();
		if(strNum.length > 2){
			return strNum;
		}

		var str = '0'+ strNum;
		return str.slice(-2);
	}
}