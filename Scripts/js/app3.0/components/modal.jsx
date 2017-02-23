
/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : filterbox.js
 * DESCRIPTION     : Reactjs component for Filterbox
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

import $ from 'jquery';
import Url from 'components/displays/url';
import React from 'react';
import { PopupboxManager,PopupboxContainer} from 'react-popupbox';
import fancybox from 'fancybox';
import ImgSliderModal from 'components/modals/imgslidermodal';
import EplActionCreator from 'actions/eplactioncreator';
import TableFilter from  'tablefilter';

class Modal extends React.Component {

    static close() {
        $.fancybox.close(true);
    }

    constructor(opts) {
        super(opts);
    }

    componentDidMount() {
        if(this.props.display.embedded){
            this.openPopupbox();
        }else{
            this.openFancybox();
        }
        
    }

    openFancybox(){
        fancybox($);
        let type = this.props.display.type;

        // Load Image Slider in Modal
        if (type === ImgSliderModal) {
            $.fancybox.open(this.props.display.props.images, {
                afterClose: e => {
                    EplActionCreator.hideModal();
                }
            });
        } else if (type === Url) {
            //Load Url in Modal
            $.fancybox.open([this.refs.popup], {
                type: 'iframe',
                href: this.props.display.props.url,
                afterClose: e => {
                    EplActionCreator.hideModal();
                }
            });
        } else {
            //Show React Modal
            $.fancybox.open([this.refs.popup], {
                type: 'inline',
                helpers: {
                    title: {
                        type: 'inside',
                        position: 'top'
                    }
                },
                afterClose: e => {
                    EplActionCreator.hideModal();
                }
            });
        }
    }
       
    openPopupbox() {
  
        var content = (<div>
                          {this.props.display.content}
                       </div>
                    )
        PopupboxManager.open({ content })
    }
    
    componentWillUnmount() {}

    onClosed(){
        EplActionCreator.hideModal();
    }

    render() {
        var display = null;
        if(this.props.display.embedded){
            display = (<div ref="popup" ><PopupboxContainer onClosed={this.onClosed.bind(this)}/></div>);
        }else{
            display = (<div ref="popup">{this.props.display}</div>);
        }
       
        
        return (display);
    }
}

export default Modal;