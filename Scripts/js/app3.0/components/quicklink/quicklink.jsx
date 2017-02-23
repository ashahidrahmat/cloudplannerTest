 /**-----------------------------------------------------------
 * PROGRAM ID      : quicklink.jsx
 * DESCRIPTION     : Reactjs component for quicklink
 * AUTHOR          : xingyu
 * DATE            : Dec 21, 2016
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
import QuicklinkIcons from 'components/quicklink/quicklinkicons';
import Quicklinkstore from 'stores/quicklinkstore';
import Quicklinkextra from 'components/quicklink/quicklinkextra';
import MapStore from 'stores/mapstore';

 class Quicklink extends React.Component {
 
     constructor(props) {
         super(props); 

         this.state = { 
             quicklink: Quicklinkstore.getAllQuickLink(), 
             buttonStatus: Quicklinkstore.getButtonStatus(),
             show:true
         };

         this._onChange = this._onChange.bind(this); 
        
     }

     componentDidMount() { 
         ClusterStore.addChangeListener(this._onChange); 
         Quicklinkstore.addChangeListener(this._onChange);
         MapStore.addChangeListener(this._onChange);
     }

     componentWillUnmount() {
         Quicklinkstore.removeChangeListener(this._onChange);
         ClusterStore.removeChangeListener(this._onChange);
         MapStore.removeChangeListener(this._onChange);
     }

     _onChange() {


         //if reset btn pressed
         //reset back the ui to unselect 
         if(Quicklinkstore.getResetUIStatus() == true){
              
             this.setState({
                 buttonStatus: Quicklinkstore.getButtonStatus()
             });  

         }else{
               
             this.setState({ 
                 quicklink: Quicklinkstore.getAllQuickLink()
             }); 

         }
     }

     quicklinkComponent(quicklinks,selected){ 
         let components = [];
          
         var innerStyle = {
             display: 'table-cell',
             listStyle:'none', 
             color:'#4787ed',
             textAlign:'center',
             paddingLeft:'0'
         }

         quicklinks.map((quicklink, j) => { 
      
             components.push(
             <QuicklinkIcons info={quicklink} qLinkSelected = {selected}/>  
             );
     });  
         return components; 
     }
      
     toggleGeoPhotoQuicklink(){
         EplActionCreator.toggleGeoPhotoQuicklink();
         //getClusterStatus
         //{temp ? 'available' :'not available'}
     }

     toggleHousingQuicklink(){
         console.log(" housing quicklink");

         if(ClusterStore.getClusterStatus()){
             EplActionCreator.addLayer("Housing Units");
         }else{
             EplActionCreator.removeLayer("Housing Units");
         }
     }

     toggleQuicklinkExtra(){
         EplActionCreator.toggleQuicklinkExtra();
     }

     render () { 

          
         //retrieve all values from quicklinkstore
         let qSelected = this.state.buttonStatus,
             quicklink = this.quicklinkComponent(this.state.quicklink,qSelected);
 
         let highlighted = (!ClusterStore.getClusterStatus()) ? {WebkitFilter: 'grayscale(1)',opacity:'0.8'} : {WebkitFilter: 'grayscale(0)', color:'#4787ed'}; 

         let pointer = !ClusterStore.getClusterStatus()? {cursor:'pointer',opacity:'0.8'}:{cursor:'pointer',opacity:'1'}
         //for ui at the top
         //<li style={highlighted} onClick={this.toggleGeoPhotoQuicklink.bind(this)}> <i className={ClusterStore.getClusterStatus() ? 'icon-picture' :'icon-picture'}></i><div className="iconfont-name">Image</div></li> 
           
         return (
            <span> 
           {this.props.showAll? 
         <div id="quicklink-container">
        <div style={highlighted} onClick={this.toggleGeoPhotoQuicklink.bind(this)}><i style={pointer} className={ClusterStore.getClusterStatus() ? 'icon-picture' :'icon-picture'}></i></div>    
        {quicklink} 
         </div> :   null
      
         
          

        }
        </span>
      );
     }
 }

export default Quicklink;
