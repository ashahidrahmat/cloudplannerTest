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
import Input from 'components/ui/input';
import EplActionCreator from 'actions/eplactioncreator';
import ReactDOM from 'react-dom';

export default class UpdateProfile extends React.Component {

    constructor(opts) {
        super(opts);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            status: ''
        }

        this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
        this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    }

    componentDidMount() {
        //this.refs.oldPassword.addEventListener('change', this.onOldPasswordChange);
        //this.refs.newPassword.addEventListener('change', this.onNewPasswordChange);
        //this.refs.confirmPassword.addEventListener('change', this.onConfirmPasswordChange);
        ReactDOM.findDOMNode(this.refs.oldPassword).addEventListener('change', this.onOldPasswordChange);
        ReactDOM.findDOMNode(this.refs.newPassword).addEventListener('change', this.onNewPasswordChange);
        ReactDOM.findDOMNode(this.refs.confirmPassword).addEventListener('change', this.onConfirmPasswordChange);
    }

    componentWillUnmount() {
        //this.refs.oldPassword.removeEventListener('change', this.onOldPasswordChange);
        //this.refs.newPassword.removeEventListener('change', this.onNewPasswordChange);
        //this.refs.confirmPassword.removeEventListener('change', this.onConfirmPasswordChange);
        ReactDOM.findDOMNode(this.refs.oldPassword).removeEventListener('change', this.onOldPasswordChange);
        ReactDOM.findDOMNode(this.refs.newPassword).removeEventListener('change', this.onNewPasswordChange);
        ReactDOM.findDOMNode(this.refs.confirmPassword).removeEventListener('change', this.onConfirmPasswordChange);
    }

    onOldPasswordChange(e) {
        this.setState({
            oldPassword: e.target.value
        });
    }

    onNewPasswordChange(e) {
        this.setState({
            newPassword: e.target.value
        });
    }

    onConfirmPasswordChange(e) {
        this.setState({
            confirmPassword: e.target.value
        });
    }

    validatePassword(old, newP, confirm) {
        let status = true;
        if (old === '') {
            this.setState({
                status: 'Please enter your old password.'
            });
            return false;
        } else if (newP === '') {
            this.setState({
                status: 'Please enter your new password.'
            });
            return false;
        } else if (confirm === '') {
            this.setState({
                status: 'Please confirm your new password.'
            });
            return false;
        }

        if (newP.length < 8) {
            this.setState({
                status: 'New password must be at least 8 characters.'
            });
            return false;
        }

        if (old === newP) {
            this.setState({
                status: 'Your new and old password can not be the same.'
            });
            return false;
        }

        if (confirm !== newP) {
            this.setState({
                status: 'Your confirm and new password does not match.'
            });
            return false;
        }

        return status;
    }

    render () {
        let cancelFunc = e => {
            EplActionCreator.hideModal();
        }, changeFunc = e => {
            let old = this.state.oldPassword,
                newP = this.state.newPassword,
                confirm = this.state.confirmPassword;

            if (this.validatePassword(old, newP, confirm)) {
                EplActionCreator.changePassword(old, newP, confirm);
            }
        };

        return <div>
            <div className="change-pw-title">Change Password</div>
            <table>
                <tbody>
                    <tr>
                        <td className="change-pw-td"><label>Old Password</label></td>
                        <td>
                            <Input ref='oldPassword' className={"input change-pw-input"} type={"password"} value={this.state.oldPassword} onChange={this.onOldPasswordChange.bind(this)}/>
                        </td>
                    </tr>

                    <tr>
                        <td className="change-pw-td"><label>New Password</label></td>
                        <td>
                            <Input ref='newPassword' className={"input change-pw-input"} type={"password"} value={this.state.newPassword} onChange={this.onNewPasswordChange.bind(this)}/>
                        </td>
                    </tr>

                    <tr>
                        <td className="change-pw-td"><label>Confirm New Password</label></td>
                        <td>
                            <Input ref='confirmPassword' className={"input change-pw-input"} type={"password"} value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange.bind(this)}/>
                        </td>
                    </tr>

                    <tr>
                        <td></td>
                        <td id="change-pw-warning">{this.state.status}</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td>                           
                            <Button text="Change" onClick={changeFunc} />
                            <Button text="Cancel" onClick={cancelFunc} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
    }
}