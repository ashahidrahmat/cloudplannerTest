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
import Button from 'components/ui/button';
import L from 'leaflet';

export default class Upload extends React.Component {

    constructor(opts) {
        super(opts);
    }

    onDrop(acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      
      UploadStore.detectFormat(acceptedFiles[0]).then((layer)=>{
        UploadStore.setLayer(layer,acceptedFiles[0].name);
      }).catch((error)=>{
        console.log(error);
      });
    }

    clearAll(e){
      let layerGroup = UploadStore.getLayerGroup();
      if(layerGroup){
        layerGroup.clearLayers();
      }
    }

    render () {
        return (<div>
          <Dropzone multiple={false} preventDropOnDocument={true} onDrop={this.onDrop.bind(this)}>
              <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          </div>
        );
    }

}
//<Button text="Clear All" onClick={this.clearAll.bind(this)}></Button>