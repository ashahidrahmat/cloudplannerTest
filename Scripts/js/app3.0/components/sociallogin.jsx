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
import AWS from 'aws-sdk';

export default class SocialLogin extends React.Component {

    constructor(opts) {
        super(opts);

        this.state = {
            profile:null
        }
    }

    componentDidMount() {

        //config for cognito use pool
        //cloudplanner



    }

    awsCognitoAuthFlow(fbAuthAccessToken){

        var params = {
               IdentityPoolId: 'us-east-1:abbfcfb1-f03b-4bf2-8668-f8091b55cd4c',
                Logins: { 'graph.facebook.com': fbAuthAccessToken }
        };

        // set the Amazon Cognito region
        AWS.config.region = 'us-east-1';
        // initialize the Credentials object with our parameters
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

        // We can set the get method of the Credentials object to retrieve
        // the unique identifier for the end user (identityId) once the provider
        // has refreshed itself
        AWS.config.credentials.get(function(err) {
        	if (err) {
        		console.log("Error: "+err);
        		return;
        	}


            /*
        	// Other service clients will automatically use the Cognito Credentials provider
        	// configured in the JavaScript SDK.
        	var cognitoSyncClient = new AWS.CognitoSync();

        	cognitoSyncClient.listDatasets({
        		IdentityId: AWS.config.credentials.identityId,
        		IdentityPoolId: "YOUR_COGNITO_IDENTITY_POOL_ID"
        	}, function(err, data) {
        		if ( !err ) {
        			console.log(JSON.stringify(data));
        		}
        	});
*/

        });


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

var online = function(session) {
	var currentTime = (new Date()).getTime() / 1000;
	return session && session.access_token && session.expires > currentTime;
};

var fb = Hello('facebook').getAuthResponse();


                scope.awsCognitoAuthFlow(fb.access_token);

               scope.setState({
                   profile: r
               })

            });
            });



}

    render () {

//227854817681063
        return (
                <div>
                    {this.state.profile == null ?
                <div className="si-title-wrapper ui-title-color">
                <img src="http://www.freeiconspng.com/uploads/facebook-transparent-12.png" style={{height:'40px'}} onClick={this.facebookLogin.bind(this)} />
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
