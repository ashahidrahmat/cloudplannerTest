/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : rangeslider.jsx
 * DESCRIPTION     : Reactjs component for jQrangeslider
 * AUTHOR          : xingyu
 * DATE            : Mar 30, 2017
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
import ReactDOM from 'react-dom';
import Jqueryui from 'jquery-ui';
import Rangeslider from 'libs/jQRangeSlider/jQAllRangeSliders-min';
import $ from 'jquery';

class RangeSlider extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
         const parent = ReactDOM.findDOMNode(this);
         const slider = $(parent).dateRangeSlider({
          bounds:{
              min: new Date(2013, 1, 1),
              max: new Date(2017, 2, 28)
          },
          defaultValues:{
              min: new Date(2017, 1, 1),
              max: new Date(2017, 2, 28)
          }
          });

       // Preferred method
       $(parent).on("valuesChanging", function(e, data){
         console.log("Something moved. min: " + data.values.min + " max: " + data.values.max);
       });

     }

     componentWillUnmount() {
       const parent = ReactDOM.findDOMNode(this);
       $(parent).dateRangeSlider("destroy");
   }


    render() {

        return (
            <div id="jrangeslider"></div>
        );
    }
}

export default RangeSlider;
