import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TableToolbar from './TableToolbar';

describe('TableToolbar component', () => {
    it('should render', () => {
        const wrapper = shallow(<TableToolbar>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with results', () => {
        const wrapper = shallow(<TableToolbar result={ 3 }>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})
