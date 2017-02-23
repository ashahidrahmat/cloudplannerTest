/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : speechstore.js
 * DESCRIPTION     : for speech and text conversion
 * AUTHOR          : alanng
 * DATE            : June 2016
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


import MapStore from 'stores/mapstore';
import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import MenuConstants, {FilterState} from 'constants/menuconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplActionCreator from 'actions/eplactioncreator';
import SearchActionCreator from 'actions/searchactioncreator';

class SpeechStore extends BaseStore {

    constructor(opts) {
        super();

        this.speechState = {
            activate: false
        };

        this.results = "";

        if (typeof webkitSpeechRecognition != 'undefined') {
            this.speech = new webkitSpeechRecognition();
            this.setUp();
        }
    }

    setUp(){
        this.speech.continuous = true;
        this.speech.lang = 'en-GB';
        this.speech.interimResults = true;

        var that = this;
        this.speech.onresult = function (event){ // delve into words detected results & get the latest total results detected
            var resultsLength = event.results.length - 1; // get length of latest results
            var ArrayLength = event.results[resultsLength].length - 1; // get last word detected
            var saidWord = event.results[resultsLength][ArrayLength].transcript;

            if (event.results[resultsLength].isFinal) {
                that.speech.stop();
                that.search(saidWord);
            }
        };

        this.speech.onerror = function(event) {
            that.speech.stop();
            EplActionCreator.offSpeech();
            responsiveVoice.speak("Sorry, I didn't quite get that.");
        };
    }

    search(text) {
        EplActionCreator.setSearchText(text);
        SearchActionCreator.search(text);
    }

    getSpeechState() {
        return this.speechState.activate;
    }

    setSpeechState(flag) {
       this.speechState.activate = flag;
    }
     
    onSpeech() {
        this.setSpeechState(true);
        responsiveVoice.speak(
            "Ask me something", 
            "UK English Female",
            {onend: this.onSpeechStart.bind(this)}
        );
    }

    onSpeechStart(){
        this.speech.start();  
    }

    offSpeech() {
        this.setSpeechState(false);
    }

    getResults(){
        return this.results;
    }

    clearResults(){
        this.results = "";
    }

    speakText(text){
        responsiveVoice.speak(
            text.toString(), 
            "UK English Female",
            {onend: this.onSpeechStart.bind(this)}
        );
        this.offSpeech();
    }
}

var instance = new SpeechStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.OnSpeech:
            instance.onSpeech();
            instance.emitChanges();
            break;
        case EplConstants.OffSpeech:
            instance.offSpeech();
            instance.emitChanges();
            break;
        // no default really required here
    }
});

export default instance;