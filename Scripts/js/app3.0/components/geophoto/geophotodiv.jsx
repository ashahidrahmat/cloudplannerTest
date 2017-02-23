/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : geophotodiv.jsx
 * DESCRIPTION     : a container for right panel featured image
 * AUTHOR          : xingyu
 * DATE            : Jan 31, 2017
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

class GeoPhotoDiv extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            
        }; 
    }

    //add nearbyJsonData to clusterstore   
    toggleGeoTagPhotoDetail() { 
        EplActionCreator.updateNearbyJsonData(this.props.geophoto); 
        EplActionCreator.toggleGeoTagPhotoDetail();
    }

    render() {
         
        if(this.props.geophoto.length > 0){
            
            var firstFeaturedImage =   'url('+this.props.geophoto[0].nearbyData.Url+")"+'';
        }

        var styles = {
            container: {
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                 
                backgroundImage: firstFeaturedImage,
                backgroundSize: 'cover',
                overflow: 'hidden',
                width: '100%',
                maxHeight: '100%',
                backgroundRepeat:'no-repeat'
            },
            backdrop: { 
                width: 'auto',
                height: 150
            },
            backdropView: {
                
                height: 120,
                width: '100%',
                
            },
            headline: { 
                paddingLeft:'10',
                background: 'linear-gradient(rgba(0, 0, 0, 0.701961) 0%, rgba(0, 0, 0, 0.298039) 70%, rgba(0, 0, 0, 0) 100%)',
                color: 'rgb(255, 255, 255)',
                fontSize: 20,
                height:'50'
            } 
        };


        return(
      <div style={styles.container} onClick={this.toggleGeoTagPhotoDetail.bind(this)}>
      <div style={styles.backdrop}>
          <div style={styles.backdropView}>
            <div style={styles.headline}>   
                 {this.props.photoCount} Photos 
                           
              </div>
          </div>
      </div>
    </div>
            
            )
        }

}

export default GeoPhotoDiv;
