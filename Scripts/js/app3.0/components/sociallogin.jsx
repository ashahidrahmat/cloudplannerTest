/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : sociallogin.js
 * DESCRIPTION     : Reactjs component for social login
 * AUTHOR          : xingyu
 * DATE            : Mar 15, 2017
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
import Hello from 'hellojs';
import {
 Grid,
 Row,
 Col,
 Thumbnail
} from 'react-bootstrap';

export default class SocialLogin extends React.Component {

    constructor(opts) {
        super(opts);

        this.state = {
            profile:null
        }
    }

    facebookLogin(){

        var scope = this;

        Hello.init({
        facebook: '227854817681063'     // not real id
        });

            Hello('facebook').login();

            Hello.on('auth.login', function(auth) {

            // Call user information, for the given network
            Hello(auth.network).api('me').then(function(r) {


                /*
               // Inject it into the container
               var label = document.getElementById('profile_' + auth.network);
               if (!label) {
                   label = document.createElement('div');
                   label.id = 'profile_' + auth.network;
                   document.getElementById('profile').appendChild(label);
               }
               label.innerHTML = '<img src="' + r.thumbnail + '" /> Hey ' + r.name;


               //set profile state



               const thumbnailInstance = (
               <Grid>
                 <Row>
                     <Col xs={6} md={4}>
                           <Thumbnail src={r.thumbnail} style={{height:'40px',width:'40px'}}>
                           {r.name}
                           </Thumbnail>
                         </Col>

                 </Row>
               </Grid>
               );


*/
               scope.setState({
                   profile: r
               })

            });
            });



}

    render () {

        if(this.state.profile != null){
console.log(this.state.profile)
 }

//227854817681063
        return (
                <div>
                    {this.state.profile == null ?
                <div className="si-title-wrapper ui-title-color" id="special">
                <button onClick={this.facebookLogin.bind(this)}>Fb</button>
                </div> :     <Grid>
                      <Row>
                          <Col xs={6} md={4}>
                                <Thumbnail src={this.state.profile.thumbnail} style={{height:'40px',width:'40px'}}>
                                {this.state.profile.name}
                                </Thumbnail>
                              </Col>

                      </Row>
                    </Grid>
                }
                </div>

        );
    }
}
