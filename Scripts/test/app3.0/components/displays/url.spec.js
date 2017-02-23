console.log("**************************************************************************");

import React from 'react';
import mockery from 'mockery';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Url from '../../../../js/app3.0/components/displays/url.jsx';

describe('Url', () => {
    it('shallow render', () => {
        let url = 'http://abc.com',
            className = 'myClass',
            text = 'testing 123';

        const wrapper = shallow(<Url 
            url={url}
            class={className}
            text={text}
        />);

        expect(wrapper.find('a')).to.have.length.of(1);
        expect(wrapper.props().href).to.equal(url);
        expect(wrapper.props().className).to.equal(className);
        expect(wrapper.text()).to.equal(text);

        const wrapper2 = shallow(<Url 
            url={url}
        />);

        expect(wrapper2.find('a')).to.have.length.of(1);
        expect(wrapper2.props().href).to.equal(url);
        expect(wrapper2.props().className).to.be.empty;
        expect(wrapper2.text()).to.be.empty;
    });
});