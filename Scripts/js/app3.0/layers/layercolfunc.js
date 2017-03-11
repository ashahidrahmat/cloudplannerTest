/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : basic class for layer
 * AUTHOR          : louisz
 * DATE            : Jan 5, 2016
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
import Url from 'components/displays/url';
import Util from 'utils';
import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';

class LayerColFunc {

    static ParseInt = "parseInt";
    static Numeric = "numeric";
    static Empty = "empty";
    static Capitalize = 'capitalize';
    static Price = 'price';
    static AddressFormatter = 'addressFormatter';
    static Url = 'url';

    constructor() {
        this.funcs = {};

        this.funcs[LayerColFunc.ParseInt] = Util.parseInt;
        this.funcs[LayerColFunc.Numeric] = Util.niceNumberFormat;
        this.funcs[LayerColFunc.Empty] = Util.checkFeatureNullValue;
        this.funcs[LayerColFunc.Capitalize] = Util.capitalizeFirstLetter;
        this.funcs[LayerColFunc.Price] = (number, digits=2) => {
            return '$' + Util.niceNumberFormat(number, digits);
        };
        this.funcs[LayerColFunc.AddressFormatter] = (attrs) => {
            return Util.addressFormatter(...attrs);
        };

        this.funcs[LayerColFunc.Url] = (url, comparer="N/A", text="More Info") => {
            return url === comparer ? url : <Url text={text} url={url} />;
        };
    }

    format(val, input) {
        let type, attrs, func;
        try {
            [type, attrs] = this.parse(input);
        } catch(err) {
            EplActionCreator.displayMessage("Error occur while parsing layer column function.");
        }

        func = this.funcs[type];

        if (!func) {
            EplActionCreator.displayMessage("Invalid column function.");
        }
        
        return (!func) ? val : func(val, ...attrs);
    }

    parse(input) {
        let type = input,
            attrs = [],
            start = type.indexOf("("),
            end = type.indexOf(")"),
            str = type.slice(start+1, end);

        if (start > 0 && end > 0) {
            type = type.slice(0, start);
            if (str !== "") {
                attrs = str.split(",").map(attr => {
                    return attr.trim();
                });
            }
        }

        return [type, attrs];
    }
}

export default new LayerColFunc();