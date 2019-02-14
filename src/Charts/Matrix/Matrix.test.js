import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Matrix from './Matrix';

describe('Pie component', () => {

    let matrixData = {
        topRight: [{position: [2, 2], label: 'First'}],
        topLeft: [{position: [2, 2], label: 'Second'}],
        bottomRight: [{position: [2, 2], label: 'Third'}],
        bottomLeft: [{position: [2, 2], label: 'Fourth'}],
    }

    let matrixLabels = {
        yLabel: 'Y Axis Main Label',
        xLabel: 'X Axis Main Label',
        subLabels: {
            xLabels: ['X Axis Sub Label 1', 'X Axis Sub Label 2'],
            yLabels: ['Y Axis Sub Label 1', 'Y Axis Sub Label 2'],
        }
    };

    let matrixConfig = {
        max: 4,
        min: 0,
        size: 2,
        gridSize: 10,
        pad: 15,
        shift: 2,
        colors: ['yellow', 'blue', 'red', 'black']
    }

    it('should render correctly', () => {
        const wrapper = shallow(
            <Matrix data={matrixData} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with labels', () => {
        const wrapper = shallow(
            <Matrix data={matrixData} label={matrixLabels}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with identifier', () => {
        const wrapper = shallow(
            <Matrix data={matrixData} label={matrixLabels} identifier='test matrix'/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with config', () => {
        const wrapper = shallow(
            <Matrix data={matrixData} label={matrixLabels} config={matrixConfig}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
