/*
These are helper functions that can be used throughout the code.
*/
let startDate = new Date(2020, 0, 22);

// Returns a string with hours and minutes
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes;
}

// Will generate an array of dates to filter through for the time slider
function getDateArray(lastAvailableDate) {
    var temp = new Array();
    // check incase reasons
    if (lastAvailableDate == undefined) {
        lastAvailableDate = getToday();
    }
    var length = date_diff_indays(startDate, lastAvailableDate);
    // create initial date array
    for (var i = 0; i <= length; i++) {
        temp.push(i);
    }
    return temp;
}

// turns a number to neat commas and neat printing
function niceNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// A pause function yoinked from endmemo
function wait(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    } while(d2-d < ms);
}

// Days between 2 dates
var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.abs(Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24)));
}

// Used to get todays date
function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth()).padStart(2, '0'); // 0 starting index
    var yyyy = today.getFullYear();

    return new Date(yyyy, mm, dd);
}

// give a nice date format to print
function niceDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); // 0 starting index
    var yyyy = date.getFullYear();

    return mm + "/" + dd + "/" + yyyy;
}

// linear map function
function linMap(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// This function will transfer days from to a readable date
function addToDate(date, days) {
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    return date.addDays(days);
}

// This function is needed to overcome the hassle of diffEncoding and get apt color code
function getColorCode(colorCodes, count){
    for(key in colorCodes){
        if(parseInt(key)>count){
            return colorArray[colorCodes[key]-1];
        }
    }
    return colorArray[colorArray.length-1];
}
