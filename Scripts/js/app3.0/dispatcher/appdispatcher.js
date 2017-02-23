/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : appdispatcher.js
 * DESCRIPTION     : 
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2014
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


import Flux from 'flux';

class AppDispatcher extends Flux.Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: 'ViewAction',
            action: action
        });
    }
}

export default new AppDispatcher();