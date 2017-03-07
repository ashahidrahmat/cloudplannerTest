/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : Reactjs component for 1 layer on the LeftPanel
 * AUTHOR          : louisz
 * DATE            : Jan 6, 2016
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
"use strict";

import React from 'react';

class EsriLegend extends React.Component {

    processLegend() {
        var layers = this.props.layers,
            layerIds = Array.isArray(this.props.legendIds) ? this.props.legendIds : [this.props.legendIds],
            content = new Array(layerIds.length),
            layerIdsDict = {};

        layerIds.forEach((layerId, i) => {
            layerIdsDict[layerId] = i;
        });

        layers.forEach(layer => {
            if (layer.layerId in layerIdsDict) {
                content[layerIdsDict[layer.layerId]] = this.beautifyLegend(layer);
            }
        });
     
        return content;
    }

    processLegendFootnote(){
        var layerIds = this.props.legendIds,
           layers = this.props.layers,
           descArr = [],
           legendElements = [],
           descText;

        layers.forEach((layer) => {
            if(layer.layerId === layerIds[0]){
                descText = layer.description;
            }        
        })

        if (descText){
            descText = descText.replace(/\[/g, "|[");
            descText = descText.replace(/\]/g, "]|");
            descText = descText.replace(/\</g, "|<");
            descText = descText.replace(/\>/g, ">|");
        
            descArr = descText.split("|");

            for(var i in descArr){
                var str = descArr[i].trim();

                if(str == ""){
                    continue;
                }

                if(str.indexOf("]") > 0){
                    legendElements.push(<u> {str.replace("[","").replace("]","")} </u>);
                }
                else if(str.indexOf(">") > 0){
                    legendElements.push(<b> {str.replace("<","").replace(">","")} </b>);
                }
                else{
                    legendElements.push(<span>{str}</span>);
                }
            }
        }
        return (<div className="legend-footnote">{legendElements}</div>);
    }

    beautifyLegend(layers) {
        var url = this.props.url,
            layerName = layers.layerName,
            content = [];
        //push layer legend title
        content.push(<div className="legend-title">{layerName}</div>); 
        layers.legend.map((legend, i) => {
            var imageFullUrl = url + "/" + layers.layerId + "/images/" + legend.url;

            content.push(<div key={i} className="legend-row"><div className="legend-row-img"><img src={imageFullUrl} /></div><div className="legend-row-label">{legend.label}</div></div>);
        });

        return content;
    }

    render() {
            var title = this.props.title,
                content = this.processLegend(),
                legendFootnote = this.processLegendFootnote();

        return (
            <div>
                {content}  
                {legendFootnote}
            </div>
        );
    }
}

export default EsriLegend;