/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : userprofile.js
 * DESCRIPTION     : Reactjs component for UserProfile
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
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
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'utils';
import Dropzone from 'react-dropzone';
import UploadStore from 'stores/uploadstore';
import MapStore from 'stores/mapstore';
import Button from 'components/ui/button';

export default class Upload extends React.Component {

    constructor(opts) {
        super(opts);
        this.layerGroup = new L.layerGroup();
        this.layerGroupView = [];
        this.layerGroupViewDiv = null;
    }

    onDrop(acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      
      let map = MapStore.getMap();
      UploadStore.detectFormat(acceptedFiles[0]).then((layer)=>{      
        this.layerGroup.addLayer(layer).addTo(map);
        this.layerGroupView.push({name:acceptedFiles[0].name,id:layer._leaflet_id});
      }).catch((error)=>{
        console.log(error);
      });
    }

    appendLayerGroupView(){

    }

    removeLayer(id){
        this.layerGroup.removeLayer(this.layerGroupView[0].id)
        var index = this.layerGroupView.indexOf(this.layerGroupView[0]);
 
        if (index > -1) {
           this.layerGroupView.splice(index, 1);
        }
    }

    clearAll(e){
      if(this.layerGroup){
        this.layerGroup.clearLayers();
      }
    }

    render () {
        return (<div>
          <Dropzone multiple={false} preventDropOnDocument={true} onDrop={this.onDrop.bind(this)}>
              <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <Button text="Clear All" onClick={this.clearAll.bind(this)}></Button>
          </div>
        );
    }
}
