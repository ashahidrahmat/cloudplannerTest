
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
import {
Popover,
Tooltip,
Modal,
Button
} from 'react-bootstrap';
import {invokeApig} from 'components/restapi/awsLib';
import config from 'components/restapi/config';

class ReactBootstrapModal extends React.Component {
    constructor(props) {
        super(props);

        this.state={
          showModal: false
        }
    }



    close() {
      this.setState({
          showModal: false
      });
    }

    open() {
      this.setState({ showModal: true });
    }

    componentDidMount() {

    }


    componentWillUnmount() {
        console.log("unmout react bootstrap")

    }

    async componentWillReceiveProps(nextProps){

      if(nextProps.data.show){
      //query for data api
        var myDataQuery = {
            "s": nextProps.data.date.startDate,
            "e" : nextProps.data.date.endDate,
            "lotno" : nextProps.data.lotNo,
        }
        //let dataResult = await this.dataQuery(myDataQuery);
        //console.log(dataResult);

        //show modal
        this.setState({ showModal: nextProps.data.show });
      }

    }

    dataQuery(query){
        return invokeApig({
          path: '/pgquery/pgdata',
          method: 'POST',
          body: query,
        });
    }


    componentWillUnmount() {}

    show(){
      return this.state.props.showtabledetails
    }

    render() {



      const popover = (
        <Popover id="modal-popover" title="popover">
          very popover. such engagement
        </Popover>
      );
      const tooltip = (
        <Tooltip id="modal-tooltip">
          wow.
        </Tooltip>
      );
        return (
          <div>
            <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className={"show" + " site-fixed-info"}>
                    <table className="site-fixed-info-table" border="1">
                        <tbody>
                            <tr><td width="116px;">Address</td><td>a</td></tr>
                            <tr><td>DA Polygon ID</td><td>b</td></tr>

                        </tbody>
                    </table>

                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close.bind(this)}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
    }
}

export default ReactBootstrapModal;
