/**---------------------------------------------------------------------------
 * PROGRAM ID      : quicklink.js
 * DESCRIPTION     : quicklink Tools Flux Store
 * AUTHOR          : xingyu
 * DATE            : Dec 21, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
----------------------------------------------------------------------------*/

import BaseStore from 'stores/basestore';
import Quicklinkconstant from 'constants/quicklinkconstant';
import EplActionCreator from 'actions/eplactioncreator';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplConstants from 'constants/eplconstants';


class QuicklinkStore extends BaseStore {

    constructor() {
        super();
        this.quicklinks =  Quicklinkconstant.data;
        this.selected = [];
        this.buttonStatus = {}; 
        this.loadButton = this.loadButtons(); 
        this.resetUI = false;
    }
    
    clearUI(){
        this.resetUI = true;

        this.quicklinks.forEach((btn, i) => {
            this.buttonStatus[btn.name] = true;
        });
    }

    getResetUIStatus(){
        return this.resetUI;
    }

    setUIStatus(){
        this.resetUI = false;
    }

    loadButtons(){
        //load array obj to json string obj
        this.quicklinks.forEach((btn, i) => {
            this.buttonStatus[btn.name] = true;
        });
    }

    getAllQuickLink(){ 
        return this.quicklinks;
    }

    getSelected(){
        return this.selected;
    }

    getButtonStatus(){
        return this.buttonStatus;
    }
  
   
    //update the current selected quicklink btn
    selectButtonStatus(drawType){
        this.buttonStatus[drawType] = true;
    }

    disselectButtonStatus(drawType){
        this.buttonStatus[drawType] = false;
    }

    //check for any button clicked before
    isSelected(quicklinkBtn) {
        
        var hasClicked = false;

        for (var i = 0, len = this.selected.length; i < len; i++) {
            if (this.selected[i] === quicklinkBtn) {
                hasClicked = true;
                break;
            }
        }
        //console.log(hasClicked);
        return hasClicked;
    }

    //add quick link btn 
    addQuicklink(quicklinkBtn) {
        
        this.setUIStatus();
        
        /*
        //console.log(this.selected)
        //empty add 1st btn
       if(this.selected.length == 0){ 
           //this.selected.unshift(quicklinkBtn); 
           //this.selectButtonStatus(quicklinkBtn);
       }else{ 

        //loop through the select to check for selected btn
        this.selected.forEach((btn, i) => {
            //if the btn already exist
            //add to select
            if (btn === quicklinkBtn) { 
                //this.disselectButtonStatus(quicklinkBtn)
                console.log("btn exist");
            }else{
                //this.selected.unshift(quicklinkBtn); 
                //this.selectButtonStatus(quicklinkBtn)
                //this.selected.unshift(quicklinkBtn); 
                console.log("btn not exist");
            }
        });
       }

        //console.log(this.selected);
        //this.selectButtonStatus(quicklinkBtn);
        */

        //loop through  to change the value of selected btn
        this.quicklinks.forEach((btn, i) => {
             
            if (btn.name === quicklinkBtn) { 

                if(this.buttonStatus[btn.name]){
                    this.buttonStatus[btn.name] = false;
                }else{
                    this.buttonStatus[btn.name] = true;
                } 
                
            } 
        });
    }
        
        
     

    removeQuicklink(quicklinkBtn) {
        console.log("remove quick link");
        this.selected.forEach((layer, i) => {
            if (layer === quicklinkBtn) {
                this.selected.splice(i, 1);
                return;
            }
        });

        this.resetSelectedZIndex();
    }

    resetSelectedZIndex() {
        var length = this.selected.length;
        this.selected.forEach((layer, i) => {
            layer.setZIndex((length-i).toString());
        });
    }
 
 
}

var instance = new QuicklinkStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.SelectQuickLinkBtn:  
                instance.addQuicklink(action.selectedBtn);
                instance.emitChanges(); 
            break;
        case EplConstants.deSelectQuickLinkBtn:
            instance.removeQuicklink(action.selectedBtn);
            instance.emitChanges();
            break; 
       
     
    }
});

export default instance;
