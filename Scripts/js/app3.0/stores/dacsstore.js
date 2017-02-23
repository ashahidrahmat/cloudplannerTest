/**---------------------------------------------------------------
 * PROGRAM ID      : dacsstore.js
 * DESCRIPTION     : DACS interface 
 * AUTHOR          : jianmin
 * DATE            : June 27, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
----------------------------------------------------------------*/
import BaseStore from 'stores/basestore';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplActionCreator from 'actions/eplactioncreator';
import SearchActionCreator from 'actions/searchactioncreator';
import {ControllerUrl} from 'constants/urlconstants';
import Ajax from 'wrapper/ajax';
import Util from '\\util';
import DacsContent from 'components/displays/dacscontent';
import WebApi from 'webapi';

class DacsStore extends BaseStore {

    constructor() {
        super();
        this.map = null;
        this.plotCases = 0;
        this.totalCases = 0;
        this.polygonIds = {};
        this.initialize();
    }

    initialize(){

        this.dacsLayer = new L.featureGroup();

        this.refinedCaseItems = {
            cases:[], //item: {x,y,content:[]}
            add:function(item){ 
                var cases = this.cases;
                var len = cases.length;
                var find = false;
                for(var i=0;i<len;i++){
                    var c = cases [i];
                    if(c.x == item.x && c.y == item.y){
                        find = c;
                        break;
                    }
                }
                
                if(!find){
                    find.content.push(item.content);
                }else{
                    var copy = {};
                    copy.x = item.x;
                    copy.y = item.y;
                    copy.content = [item.content];
                    cases.push(copy);
                }          
            }
        };
    
    }

    //listen to url has: ?para=value&para2=value2
    locationListener(map){
        this.map = map;

        var query = window.location.search,
            validSearch = query && query.length;

        if(!validSearch){
            return;
        }
        
        //ATTENTION:if content contains '&' then will cause error for parameters pass
        var q = query.substring(1).split('&'),
            params = {};

        q.forEach(d => {
            //to get accessToken contains value '=='
            var tokenIndex = d.indexOf('accessToken');
            if ( tokenIndex > -1){
                params['accessToken'] = d.substring(12);
            } else {
                var dd = d.split('=');
                params[dd[0]] = dd[1];
            }
        });
        
        this.decodeAction(params);
    }

    decodeAction(params){
        //action/method is default ASP MVC route, need to rewrite to act
        var act = params.action || params.act;
         
        switch(act){
            case 'displayInbox':
                this.displayInbox(params);
                break;

            case 'displayPolygon':
                this.displayPolygon(params);
                break;
        }
    }
    //TODO: TESTING and plotted box not done
    // display DACS inbox
    displayInbox(params){
    
        Ajax.wait([
                this.retrieveCases(params)
         ], (data) => {
            var valid = data && data.status && 
                        data.status ==='success';
            if(!valid){
                console.log(data);
                return;
            }
            let nocase = 'No DACS case found.';
            
            var recordset = JSON.parse(data.result);
            if(!recordset.dacs || recordset.dacs === 'null'){
                EplActionCreator.displayMessage(nocase);
                return;
            }

            var records = recordset.dacs.cases.caseItem;
            var length = records.length;
            if(length < 1){
                EplActionCreator.displayMessage(nocase);
                return;
            }

            this.getRefinedCaseItems(records, params['userId'], params['accessToken'])
                .buildDACSMarkerLayer()
                .buildDACSPolygonLayer();
                
        }, error => {
            EplActionCreator.displayMessage("Error retrieving DACS cases.");
        });
    }

    retrieveCases(params){
        var query = {};
        query.userid = params['userId'];
        query.accessToken = params['accessToken'];
        let url = ControllerUrl.DacsProxy;
        return Ajax.call({
            url: url,
            dataType: 'json',
            data: query
        });

    }

    getRefinedCaseItems(caseItems, userId, accessToken){
        var scope = this;
        var total = caseItems.length;
        var notPlot = 0;
        caseItems.forEach((item) => {
            var points = item.coordinate;
            var numOfPoints = points.length;
            var newItem = {
                x:0,
                y:0,
                content:{}
            };
            newItem.content = {
                color: item.color,
                refNo: item.refNo,
                systemId: item.systemId,
                description: item.description,
                planningArea: item.planningArea,
                deadLine: item.deadLine,
                status: item.status,
                polygonId: item.polygonId,
                postalCode: item.postalCode,
                detailUrl: item.detailUrl
            };

            if (item.polygonId && (''+item.polygonId).toUpperCase() !== 'NULL'){
                scope.polygonIds[item.polygonId] = item.polygonId;
            }

            if (numOfPoints){

                points.forEach((p) => {
                    var pt = newItem;
                    pt.x = p.x;
                    pt.y = p.y;
                    scope.refinedCaseItems.add(pt);
                });

            } else {
                newItem.x = '0';
                newItem.y = '0';
                scope.refinedCaseItems.add(newItem);
                notPlot++;
            }

        });

        this.totalCases = total;
        this.plotCases = total - notPlot;

        return this;
    }


    buildDACSMarkerLayer(){
        let refinedCases = this.refinedCaseItems.cases;
        let scope = this;

        refinedCases.forEach((value) => {
            let valid = +value.x && (+value.y);
            if(!valid){
                return;
            }

            var point = Util.convertLatLngFrom3414To4326([value.x, value,y]);
            var content = value.content[0];
            var image = scope.getCaseMarkerImage(content.systemId, content.color);
            var icon = L.icon({
                iconUrl: image,
                iconSize: [24, 24]
            });
            var marker = L.marker(point, {
                icon: icon
            }).bindPopup(scope.getMarkerPopupContent(value));

            scope.dacsLayer.addLayer(marker);

        });

        return this;
    }

    buildDACSPolygonLayer(){
        
        var scope = this;
        if(Object.getOwnPropertyNames(this.polygonIds).length){
            WebApi.queryMultipleDevtPolygons(this.polygonIds)
                .done((results)=>{
                    //console.log(results);
                    results.map((result)=>{
                        scope.setupDACSPolygon(result);
                    });
                });

            this.dacsLayer.addTo(this.map).bringToFront();
        }
    }

    setupDACSPolygon(result){
        var geometry = result.geometry;
        var markerOpts =  {
            zIndex: 900,
            color:'#f00',
            fillColor: '#f00',
            opacity: 0.9,
            weight: 2,
            clickable: false
        };
        geometry.coordinates.map(region => {
            let polygon = L.polygon(region, markerOpts);
            let content = '<div style="width:100px;height:20px;">'+ result.properties.DEV_POL_ID +'</div>';
            polygon.bindPopup(content);
            this.dacsLayer.addLayer(polygon);
        });

    }
    
    getCaseMarkerImage(systemId, color){
        
        var imageUrl = '';

        switch (('' + systemId).toUpperCase()) {
            case 'DAX':
                imageUrl = '/Content/img/dacs/v2/pin';
                break;
            case 'CIS':
                imageUrl = '/Content/img/dacs/v2/marker';
                break;
            case 'EPAC':
                imageUrl = '/Content/img/dacs/v2/msg';
                break;
            default:
                imageUrl = '/Content/img/dacs/v2/pin65';
        }

        switch (('' + color).toUpperCase())  {
            case 'RED':
                imageUrl += '_red.png';
                break;
            case 'ORANGE':
                imageUrl += '_orange.png';
                break;
            case 'GREEN':
                imageUrl += '_green.png';
                break;
            default:
                imageUrl += '.png';
        }

        return imageUrl;
    
    }

    getMarkerPopupContent(value){
        let contents = value.content,
            length = contents.length;

        return (!length) ? '<div>No case description.</div>' :
                            <DacsContent contents={contents} />; 
    }

    //for only one polygonId
    displayPolygon(params){
        let devtSearch = new DevtSearch(params.polygonId);
        let promise =  devtSearch.promise;
        promise.then(function(features){
            var valid = features && features.length;
            if (!valid){
                var msg = 'Development polygon ID ' + params.polygonId + ' is not found.';
                EplActionCreator.displayMessage(msg);
                return;
            }
            let feature = features[0];
            EplActionCreator.highlightZoomCenterMap(feature.geometry, feature.zoom, feature.center);
        });
        
    }

}

var instance = new DacsStore();

instance.dispatchToken = AppDispatcher.register(function(action) {


});

export default instance;



