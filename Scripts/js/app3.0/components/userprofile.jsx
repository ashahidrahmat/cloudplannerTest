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

import Modal from 'components/modal';
import React from 'react';
import Button from 'components/ui/button';
import UpdateProfile from 'components/updateprofile';
import EplActionCreator from 'actions/eplactioncreator';

export default class UserProfile extends React.Component {

    constructor(opts) {
        super(opts);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    }

    changePasswordFunc(e) {
        let modelContainer = {}
        modelContainer.content = <UpdateProfile />;
        modelContainer.embedded = true;
        EplActionCreator.showModal(modelContainer);
    }

    render () {
        return (
            <div id="userinfo" className="userinfo-color">
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">User Profile</span>
                    <span id="profile-title-close" className="right-close-btn right-close-btn-color" onClick={this.props.onClose}><i className="icon-cancel-circled"></i></span>
                </div>
                <div className="userinfo-wrapper">
                    <div className="si-title-wrapper ui-title-color">
                        <span id="userdisplay" className="userdisplay-color">Welcome, { this.props.username }</span>
                    </div>
                    {
                        this.props.extranet ? 
                        <div className="si-title-wrapper ui-title-color helpspan" onClick={this.changePasswordFunc.bind(this)}>
                            <span id="change-pw">Change Password</span>
                        </div> : null
                    }
                    {/*<div className="si-title-wrapper ui-title-color helpspan">
                        <span id="begin-tour">Take A Tour</span>
                    </div>*/}
                    <div className="si-title-wrapper ui-title-color helpspan">
                        <form id="logout-form" action="/Account/Logout" method="GET"> <span><button id="logout-btn" type="submit">Log Out</button></span></form>
                    </div>
                </div>
            </div>
        );
                    }
}