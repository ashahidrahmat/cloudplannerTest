/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : util.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2014
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import L from 'leaflet';
import Proj4Leaflet from 'proj4leaflet';
import React from 'react';
import FeatureConstants from 'constants/featureconstants';
import * as d3 from 'd3';
import Ps from 'perfect-scrollbar';
import * as D from 'datejs';

class Util {
    constructor() {
        this.MercatorZoomLevels = {
            '0': 156543.03392799999,
            '1': 78271.516963999893,
            '2': 39135.758482000099,
            '3': 19567.879240999901,
            '4': 9783.9396204999593,
            '5': 4891.9698102499797,
            '6': 2445.9849051249898,
            '7': 1222.9924525624899,
            '8': 611.49622628138002,
            '9': 305.74811314055802,
            '10': 152.874056570411,
            '11': 76.437028285073197,
            '12': 38.218514142536598,
            '13': 19.109257071268299,
            '14': 9.5546285356341496,
            '15': 4.7773142679493699,
            '16': 2.38865713397468,
            '17': 1.1943285668550501,
            '18': 0.59716428355981699,
            '19': 0.29858214164761698,
            '20': 0.14929107082381,
            '21': 0.07464553541191,
            '22': 0.0373227677059525,
            '23': 0.0186613838529763
        };
        this._map = null;
        this._identifyPoint = null;
    }

    /*use by geo photo*/
    getMap(){
        return this._map;
    }

    transformToMercator(txt, point) {
        let crs = L.CRS[txt];
        return crs.projection.unproject(point);
    }

    objectValues(obj) {
        return Object.keys(obj).map(key => {
            return obj[key];
        });
    }

    getUniqueArray(sourceArray){
        if(sourceArray instanceof Array)
        {return sourceArray.filter(function(item,index,inputArray){return inputArray.indexOf(item)==index});}
    }

    removeUndefinedFromArray(sourceArray){
        if(sourceArray instanceof Array)
        {return sourceArray.filter(function(element){return element!=undefined;});}
    }

    searchProperty(nestedObj , propertyName){
        
        if(nestedObj){
            var objectsFound = [];
            if (nestedObj instanceof Object){

                for(var property in nestedObj){  
                    if(nestedObj.hasOwnProperty(property) && property ==propertyName ){
                        objectsFound.push(nestedObj[property]);
                    }else if(nestedObj.hasOwnProperty(property)){ 
                        objectsFound=objectsFound.concat(this.searchProperty(nestedObj[property] , propertyName));
                    } }

            }else if(nestedObj instanceof Array){
                nestedObj.map((per)=>{objectsFound=objectsFound.concat(this.searchProperty(per, propertyName ));})
            }
            return objectsFound;
        }
    }

    //Geoloction
    supportGeolocation() {
        return navigator.geolocation;
    }

    getCurrentPosition(handleGeoSuccess, handleGeoError) {
        if (this.supportGeolocation()) {
            var options = {
                enableHighAccuracy: false,
                timeout: 15000,     // milliseconds (15 seconds)
                maximumAge: 180000  // milliseconds (3 minutes)
            };
            navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, options);
        }
    }

    isAbsUrl(url) {
        return /^(http|\/\/)/i.test(url);
    }

    isArray(item) {
        return (typeof item !== "undefined") && item.constructor === Array;
    }

    withinPercentage (a, b, percentage) {
        var diff = Math.abs((a/b) - 1);
        return diff < percentage;
    }

    isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x || 0) === x;
    }

    appendUrlWithParams(url, params) {
        var paramsInStr = "?";
        for (let key in params) {
            paramsInStr += key + "=" + params[key] + "&"
        }

        return url + paramsInStr.slice(0, -1);
    } 

    toPointObject(x, y) {
        return {
            coordinates: [[x, y]],
            type: FeatureConstants.Point
        }
    }

    emptyPromise(val=null) {
        return new Promise((resolve) => { resolve(val); });
    }

    arrayToList(arr, useValue=true) {
        return arr.map((value, index) => {
            return {
                'title': value,
                'value': useValue ? value : index
            }
        });
    }

    listToOptions(list, selected) {
        return list.map(row => {
            if (row.value === selected){
                return (<option key={row.title} value={row.value} selected>{row.title}</option>);
            } else {
                return (<option key={row.title} value={row.value}>{row.title}</option>);
            }
        });
    }

    reversePolygonLatLng(obj) {

        var geometry,
            type = obj.type,
            switchFunc = coordinates => {
                return [coordinates[1], coordinates[0]];
            };

        if (type === FeatureConstants.Point) {
            geometry = [switchFunc(obj.coordinates)];
        } else {
            geometry = obj.coordinates.map((region, i) => {
                switch(type) {
                    case FeatureConstants.Line: 
                        return switchFunc(region);
                        break;
                    case FeatureConstants.Polygon:
                        return region.map(switchFunc);
                        break;
                    case FeatureConstants.MultiLine:
                        return region.map(coordinates => {
                            return switchFunc(coordinates);
                        });
                        break;
                    case FeatureConstants.MultiPolygon:
                        return region.map(area => {
                            return area.map(switchFunc);
                        });
                        break;
                }
            });
        }

        return {
            coordinates: geometry,
            type: type
        }
    }

    //TODO: refactor this function
    checkFeatureNullValue (value, defaultValue='N/A') {
        //case 0, '0'
        if (value == '0'){
            return value;
        }
        //case undefined, null
        if (!value){
            return defaultValue;
        }
        //case '' or  '  '
        if(!(''+value).trim().length){
            return defaultValue;
        }

        let temp = (''+value).toUpperCase();
        if (['NIL', 'NULL', 'UNDEFINED'].indexOf(temp) > -1){
            return defaultValue;
        }

        return value;
    }

    //TODO: refactor this function
    addressFormatter (building, blk, street, floor, unit, postal) {
        var result = ''; 
        if (this.checkFeatureNullValue(building) != 'N/A') {
            result += building + ' ';
        }
        if (this.checkFeatureNullValue(blk) != 'N/A') {
            result += blk + ' ';
        }
        if (this.checkFeatureNullValue(street) != 'N/A') {
            result += street + ' ';
        }
        if (floor != '0' && this.checkFeatureNullValue(floor) != 'N/A') {
            result += '#' + floor + ' ';
        }

        if (unit != '0' && this.checkFeatureNullValue(unit) != 'N/A') {
            result += '- ' + unit + ' ';
        }

        if (this.checkFeatureNullValue(postal) != 'N/A') {
            result += 'S' + postal;
        }

        return result;
    }

    //Convert long number to 1,122,333,222 format
    formatNumbers (string=0) {
        //Seperates the components of the number
        let n = string.toString().split(".");
        //Comma-fies the first part
        n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //Combines the two sections
        n = n.join(".");
       
        return n.toString();
    }

    removeItemFromArray(array, item) {
        var index = array.indexOf(item);

        if (index > -1) {
            array.splice(index, 1);
        }

        return array;
    }

    parseInt(val, to) {
        val = (''+ val).replace(/,/g, '').trim();
        var invalidOrZero = !val || !val.length || isNaN(val);
        to = to || 10;
        return invalidOrZero ? 0 : parseInt(val, to);
    }

    sqmToSqkm(sqm, decimal) {
        return parseFloat(0.000001 * sqm).toFixed(decimal);
    }

    toJson(obj) {
        return JSON.stringify(obj);
    }

    //Returns true if it is a DOM node
    isDomNode(o){
        return (
            typeof Node === "object" ? o instanceof Node : 
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }

    //Returns true if it is a DOM element    
    isDomElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    getFeatureCenter(geometry) {
        var center;
        try{
            switch(geometry.type) {
                case FeatureConstants.Point:
                    center = [geometry.coordinates[0][0], geometry.coordinates[0][1]];
                    break;
                case FeatureConstants.Polygon:
                    center = new L.polygon(geometry.coordinates).getBounds().getCenter();
                    break;
                case FeatureConstants.MultiPolyline:
                    center = new L.Polyline(geometry.coordinates).getBounds().getCenter();
                    break;
                case FeatureConstants.MultiPolygon:
                    center = new L.Polygon(geometry.coordinates).getBounds().getCenter();
                    break;
            }
        } catch(err) {
            //do nothing
        }
        return center;
    }

    polygonsToMultiPolygon(polygons) {
        return {
            coordinates: polygons.map(polygon => {
                return polygon.coordinates[0];
            }),
            type: FeatureConstants.MultiPolygon
        };
    }

    /*getObjId = (function () {
        var keys = {};
            
        return function (key) {
            if (!keys[key])
                keys[key] = 0;

            return keys[key]++;
        };
    }());*/

    parseFloat(val, rounding) {
        var invalidOrZero = !val || !(''+val).length || isNaN(''+val);
        rounding = rounding || 2;
        return invalidOrZero ? 0 : parseFloat(val).toFixed(rounding);
    }
    //format number 12345 to 12,345 and 22222.098 to 22,222.09
    niceNumberFormat(number, digits=4, acceptNullToZero=false){
        if (acceptNullToZero && number === "Null") {
            return 0;
        }
        
        if (isNaN(number)){
            return number;
        }
        //prevent adding more precision
        let temp = (number + '');
        if(temp.indexOf('.') > -1){
            let precision = temp.split('.')[1].length;
            digits = digits > precision ? precision : digits;
        }
        
        return (parseInt(number) != number) ? d3.format(',.'+digits+'f')(number) : 
                                              d3.format(',d')(number);
    }
    //only show c3js chart tooltip for content with number > 0 
    formatChartTooltipByContent(d){
        var vals = [];
        for(let ele of d){
            if(ele && ele.value > 0){
                vals.push(ele);
            }
        }
        let html = '<div style="background-color:#fff; border:1px solid #eee; padding: 5px; font-size:12px">';
        for(let val of vals){
            html += '<span>' + val.name + ': ' + d3.format(',d')(val.value) + '</span><br>';
        }
        html += '</div>';
        return html;
    }

    formatChartLabelNumber(v){
        return ( v > 0 ) ? d3.format(',d')(v) :  '';
    }

    convertSquareMetersToHa(sqmeters){
        if (typeof sqmeters === 'string'){
            let temp = +sqmeters.replace(/,/g, '');
            if (isNaN(temp)){
                return sqmeters;
            }else{
                return this.niceNumberFormat(temp * 0.0001);
            }
        }else if (!isNaN(sqmeters)){
            return this.niceNumberFormat(+sqmeters * 0.0001);
        }

        return sqmeters;
    }

    makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    
    setIdentifyPoint(latLng){
        let point = this._map.latLngToContainerPoint(latLng);
        this._identifyPoint = {
            latLng: latLng, 
            point: point
        };
    }

    getIdentifyPoint(){
        return this._identifyPoint;
    }

    centerMap(){
        this._map.panTo(this._identifyPoint.latLng);
    }
    
    setPerfectScrollbar(content){
        if(content && Ps){
            Ps.initialize(content);    }
    }

    updatePerfectScroll(content,yPos){
        content.scrollTop = yPos;
        Ps.update(content);
    }

    removePerfectScroll(content){
        if(content && Ps){
            Ps.destroy(content);
        }
    }

    splitParagraphByLen(text, len) {
        let regExp = new RegExp(".{"+len+"}\\S*\\s+", "g");
        return text.replace(regExp, "$&@").split(/\s+@/);
    }

    formatDate(date, from, to) {
        return Date.parseExact(date, from).toString(to);
    }

    humanize(number) {
        if(number % 100 >= 11 && number % 100 <= 13)
            return number + "th";
        
        switch(number % 10) {
            case 1: return number + "st";
            case 2: return number + "nd";
            case 3: return number + "rd";
        }
        
        return number + "th";
    }

    toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    convertDate(date){
        let monthChar = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
        var yyyy = date.getFullYear().toString();
        var mm = date.getMonth();
        var dd = date.getDate().toString();

        var mmChars = monthChar[mm];
        var ddChars = dd.split('');

        return dd +'-'+mmChars+'-'+yyyy;
    }

    sqlToJsDate(sqlDate){
        //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
        var sqlDateArr1 = sqlDate.split("-");
        //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
        var sYear = sqlDateArr1[0];
        var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
        var sqlDateArr2 = sqlDateArr1[2].split(" ");
        //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
        var sDay = sqlDateArr2[0];
        var sqlDateArr3 = sqlDateArr2[1].split(":");
        //format of sqlDateArr3[] = ['hh','mm','ss.ms']
        var sHour = sqlDateArr3[0];
        var sMinute = sqlDateArr3[1];
        var sqlDateArr4 = sqlDateArr3[2].split(".");
        //format of sqlDateArr4[] = ['ss','ms']
        var sSecond = sqlDateArr4[0];
        var sMillisecond = sqlDateArr4[1];
    
        return new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond,sMillisecond);
    }



    generateCSVString(table) {
        let csvStr = "",
            dataString="";

        table.forEach(function(rowArray, rowIndex){
            dataString="";
            if (rowIndex==0){
                dataString = rowArray.join(",");
                dataString = dataString.indexOf("ID") === 0 ? dataString.replace("ID","_ID") : dataString;
                csvStr += rowIndex < table.length ? dataString+ "\n" : dataString;
            }
            else{
                rowArray.forEach(function(item,colIndex){
                    if (typeof item == "object"){
                        if(item.props.text){
                            dataString+= item.props.text + ",";
                        }
                        else if(item.props.children){
                            var objStr = "";
                            item.props.children.forEach( arrEl => {                                    
                                if(typeof arrEl != "object" && arrEl.trim() != ""){
                                    objStr+= arrEl.trim().replace(/[\n\r|\r\n|\n|\r]/gm," ").replace(/'/g,"\'") + " "; 
                                }                                    
                            });
                            dataString += "\"" + objStr + "\",";
                        }
                        else{
                            dataString += ",";
                        }
                    }
                    else if (typeof item!="undefined" && item!="Null"){
                        if(item.toString().indexOf(",")>0)
                        {
                            dataString+= "\"" + item +  "\",";
                        }
                        else{
                            dataString+= item.toString().replace(/[\n\r|\r\n|\n|\r]/gm," ").replace(/'/g,"\'") + ",";
                        }
                    }
                    else{
                        dataString+= item+ ",";
                    }
                });
                dataString= dataString.substring(0,dataString.length-1);
                csvStr += rowIndex < table.length ? dataString+ "\n" : dataString;
            }      
        });

        return csvStr;
    }


    generateChartCSVString(headerArr, table) {
        let csvStr= "",
            dataString= "",
            header = "", 
            dateField = "", 
            isDate = false,
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        if(headerArr){ 
            header = headerArr.reduce((a,b)=>{
                return a + "~" + b;
            });

            csvStr += "X,=\"" + header.replace(/~/g , "\",=\"")+ "\"\n";
        }

        table.forEach(function(rowArray, rowIndex){
            dataString="";

            if(rowArray.constructor === Array){

                rowArray.forEach(function(item,colIndex){
                
                    if(item && item.toString().indexOf(",")>0)
                    {
                        dataString+= "\"" + item +  "\",";
                    }
                    else if(item){
                        var str = item.toString().replace(/[\n\r|\r\n|\n|\r]/gm," ").replace(/'/g,"\'");
                        dataString+= Math.abs(str) ? Math.abs(str) + "," : str + ",";
                    }
                    else{
                        dataString+= item+  ",";
                    }               
                });
            }
            else{
                if(header === ""){
                    for(var prop in rowArray){

                        if(prop.toUpperCase() === "DATE"){
                            isDate = true;
                            dateField = prop;
                        }

                        if(prop.toString().indexOf(",")>0)
                        {
                            dataString+= "=\"" + prop +  "\",";
                        }
                        else{
                            dataString+= "=\"" + prop.toString().replace(/(\r\n|\n|\r)/gm,"").replace("'","\'") + "\",";
                        } 
                        
                        header += prop.toString() + ", ";
                    }

                    dataString= dataString.substring(0,dataString.length-1);
                    csvStr += rowIndex < table.length ? dataString+ "\n" : dataString;
                    dataString= "";
                }

                for(var prop in rowArray){
                    
                    if(isDate == true && prop === dateField){
                        var dateObj = new Date(parseInt(rowArray[prop]) * 1000);
                        var year = dateObj.getFullYear();
                        var month = months[dateObj.getMonth()];
                        var date = dateObj.getDate();

                        dataString+= date + " " + month + " "+ year + ",";
                    }
                    else if(rowArray[prop].toString().indexOf(",")>0){
                        dataString+= "\"" + rowArray[prop] +  "\",";
                    }
                    else{
                        var str = rowArray[prop].toString().replace(/[\n\r|\r\n|\n|\r]/gm," ").replace(/'/g,"\'");
                        dataString+= Math.abs(str) ? Math.abs(str) + "," : str + ",";
                    }
                    
                }
            }
            dataString= dataString.substring(0,dataString.length-1);
            csvStr += rowIndex < table.length ? dataString+ "\n" : dataString;
        });

        return csvStr;
    }



    capitalizeFirstLetter(str) {
        return str.split(' ').map(s => {
            //todo: remove hardcode
            return (s === 'HDB-TAMPINES') ? 'HDB-Tampines' : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        }).join(' ');
    }

    colorLuminance(hex, lum) {
       /*
            colorLuminance("#69c", 0);		// returns "#6699cc"
            colorLuminance("6699CC", 0.2);	// "#7ab8f5" - 20% lighter
            colorLuminance("69C", -0.5);	// "#334d66" - 50% darker
            colorLuminance("000", 1);		// "#000000" - true black cannot be made lighter!
        */
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }

    jsonArrayToArray(jsonArray){
        let arr = [];
        arr.push(Object.keys(jsonArray[0]));
        jsonArray.forEach(array => {
            arr.push(Object.values(array));
        })

        return arr;
    }

}

export default (new Util());
