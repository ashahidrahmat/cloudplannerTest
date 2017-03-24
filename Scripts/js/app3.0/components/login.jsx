
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

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import EplReact  from 'components/eplreact';
class Login extends React.Component {

    constructor() {
        super();
        this.div = <div style={{height:'100%',width:'100%', background:'#4787ed'}}>
        <div className="gps_ring_no_animate"> 
                <img className="gps_ring_no_animate" src="Content/img/eplanner_logo_white.png" style={{width:'50px',height:'65px'}} />
                <br />
                <div className="login" ><input id="login_input" className="login-input" type="password" onChange={this.updateInputValue.bind(this)}/><button id="login_button" className="login-button" onClick={this.onClick.bind(this)}>Login</button></div></div>
        </div>
    }

    updateInputValue(e){
        document.getElementById("login_input")
            .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                document.getElementById("login_button").click();
            }
        });
        this.setState({
            password: e.target.value
        });

    }

    onClick(){
        if(this.state.password && this.state.password === "what"){
            this.div = <EplReact />
            this.setState();
        }
    }

    render() {
        return this.div;
    }
}

export default Login;
