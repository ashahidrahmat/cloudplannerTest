 /**-----------------------------------------------------------
 * PROGRAM ID      : quicklinkicons.jsx
 * DESCRIPTION     : child component of quicklink.jsx
 * AUTHOR          : xingyu
 * DATE            : Dec 22, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
-----------------------------------------------------------------
 * CHANGE LOG      :  
 * CHANGED BY      :  
 * DATE            : 
 * VERSION NO      :
 * CHANGES         :
-------------------------------------------------------------------*/
 "use strict";

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import ClusterStore from 'stores/clusterstore';
import Quicklinkconstant from 'constants/quicklinkconstant';
import LayerComponent from 'components/layer';
import Quicklinkstore from 'stores/quicklinkstore'
 import MapStore from 'stores/mapstore';

 class QuicklinkIcons extends React.Component {

    
     constructor(props){
         super(props);
         this.state = {
             buttonStatus: ClusterStore.getClusterStatus(),
             selected: false
         };

         this._onChange = this._onChange.bind(this);
         this.toggleQuicklink = this.toggleQuicklink.bind(this);
         
     }

     toggleQuicklink() {
         var quicklinkName = this.props.info.name;
         var selectedbtn = this.props.qLinkSelected;
        
         var status = this.props.qLinkSelected[quicklinkName];

         this.state = {
             selected:this.props.qLinkSelected[quicklinkName]
         }

         EplActionCreator.selectQuickLinkBtn(quicklinkName);
         !status ? EplActionCreator.removeLayer(quicklinkName) : EplActionCreator.addLayer(quicklinkName);
     }

     _onChange() { 
           

         //if reset btn pressed
         //reset back the ui to unselect 
         if(Quicklinkstore.getResetUIStatus() == true){
              
             this.setState({
                 selected: false
             }); 
              

         }else{ 
             
             this.setState({
                 buttonStatus: ClusterStore.getClusterStatus()
             }); 
         }
  

     }

     
     componentDidMount() { 
         ClusterStore.addChangeListener(this._onChange);
         Quicklinkstore.addChangeListener(this._onChange);
         MapStore.addChangeListener(this._onChange);
         
     }

     componentWillUnmount() {
         ClusterStore.removeChangeListener(this._onChange);
         Quicklinkstore.removeChangeListener(this._onChange);
         MapStore.removeChangeListener(this._onChange);
        
     }

    
     toggleGeoPhotoQuicklink(){
         console.log("geo photo quicklink");
         EplActionCreator.toggleGeoPhotoQuicklink();
         //getClusterStatus
         //{temp ? 'available' :'not available'}
     }

     toggleDemographicsQuicklink(){
         console.log(" demographic quicklink");
          
         
         //EplActionCreator.removeLayer("Total Population");
         if(ClusterStore.getClusterStatus()){
             EplActionCreator.addLayer("Total Population");
         }else{
             EplActionCreator.removeLayer("Total Population");
         }
     }

     toggleHousingQuicklink(){
         console.log(" housing quicklink");

         if(ClusterStore.getClusterStatus()){
             EplActionCreator.addLayer("Housing Units");
         }else{
             EplActionCreator.removeLayer("Housing Units");
         }
     }

     render () { 
          
         let highlighted = (!this.state.selected) ? {WebkitFilter: 'grayscale(1)'} : {WebkitFilter: 'grayscale(0)'}; 
         let pointer = {cursor:'pointer'}

         return ( 
                <div id="base-map" style={highlighted} onClick={this.toggleQuicklink.bind(this)}><i style={pointer} className={this.props.info.icon}></i></div>         
               );
                }
            }

export default QuicklinkIcons;
