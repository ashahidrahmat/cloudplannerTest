console.log("**************************************************************************");

import mockery from 'mockery';
import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import { mount, shallow } from 'enzyme';

chai.use(spies);

describe('LayerColFunc', () => {

    var displayMessageSpy = chai.spy(),
        LayerColFunc,
        util = class Util {
            niceNumberFormat(a, d) { return "nice" + d; }
            checkFeatureNullValue(a) { return "null"; }
            capitalizeFirstLetter(a) { return "caps"; }
        },
        action = class Action {
            constructor() {
                this.displayMessage = displayMessageSpy;
            }
        },
        empty = class Empty {};

    before((done) => {
        try {
            mockery.enable({
                warnOnReplace: true,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('\\util', new util());
            mockery.registerMock('actions/eplactioncreator', new action());

            LayerColFunc = require(process.env.NODE_PATH + '/layers/layercolfunc.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });


    it('LayerColFunc Parser Test', (done) => {
           
        [
            ["numeric(2)", ["numeric", ["2"]]],
            ["numeric(2,3,4,5123)", ["numeric", ["2", "3", "4", "5123"]]],
            ["capitalize", ["capitalize", []]],
            ["empty", ["empty", []]],
        ].forEach((testSet, i) => {
            assert.sameDeepMembers(LayerColFunc.parse(testSet[0]), testSet[1], "Parser Test " + i);
            expect(displayMessageSpy).to.not.have.been.called();
        });

        done();    
    });

    it('LayerColFunc Format Success Test', (done) => {
           
        [
            ["numeric(2)", "nice2"],
            ["numeric(5)", "nice5"],
            ["capitalize", "caps"],
            ["empty", "null"]
        ].forEach((testSet, i) => {
            assert.equal(LayerColFunc.format("", testSet[0]), testSet[1], "Format Test " + i);
            expect(displayMessageSpy).to.not.have.been.called();
        });

        done();    
    });

    it('LayerColFunc Format Fail Test', (done) => {
           
        [
            ["random", ""]
        ].forEach((testSet, i) => {
            assert.equal(LayerColFunc.format("", testSet[0]), testSet[1], "Format Test " + i);
            expect(displayMessageSpy).to.have.been.called();
        });

        done();    
    });
});