/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : webapi.js
 * DESCRIPTION     : static data file for web APIs
 * AUTHOR          : louisz
 * DATE            : May 17, 2016
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

import Ajax from 'wrapper/ajax';
import Util from 'utils';
import Modal from 'components/modal';
import UrlConstants from 'constants/urlconstants';
import EplActionCreator from 'actions/eplactioncreator';

class WebApi {

    querySiteInfo(latLng) {

        Ajax.wait([
            this.queryAddress(latLng)
        ], (addressResponse) => {

            let address = '';
            if (addressResponse) {
                let data = addressResponse,
                    feature = (data.GeocodeInfo && data.GeocodeInfo.length > 0) ? data.GeocodeInfo[0] : null;

                if (feature && !feature.ErrorMessage) {
                    address = Util.addressFormatter((feature.BUILDINGNAME || null), (feature.BLOCK || null), feature.ROAD, null, null, (feature.POSTALCODE || null));
                } else {
                    address = null;
                }
            }

            EplActionCreator.querySiteInfoComplete({
                address: address
            });
        }, error => {
            EplActionCreator.displayMessage("Error retrieving site info");
        });

    }

    queryAddress(latLng) {
        return Ajax.call({
            url: Util.appendUrlWithParams(UrlConstants.OneMapReverseAddressSearch, {
                token: this.token,
                location: latLng.lat + ',' + latLng.lng
            }),
            crossDomain: true
        })
    }

    getOneMapToken() {
        let def = Ajax.deferred();
        this.url = UrlConstants.OneMapToken;
        let ajaxUrl = Util.appendUrlWithParams(this.url, {
            email: "plannercloud@gmail.com",
            password: "plannercloud1"
        });
        let callback = data => {
            def.resolve(data);
            this.token = data["access_token"];
        };

        let ajaxOptions = {
            url: ajaxUrl,
            crossDomain: true,
            dataType: 'json',
            success: callback,
            error: (error) => {
                def.resolve([]);
            }
        };

        Ajax.call(ajaxOptions);

        return def.promise();
    }

}

export default (new WebApi());