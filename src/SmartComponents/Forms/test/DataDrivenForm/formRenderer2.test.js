import React from 'react';
import { widgetSchema , uiWidgetSchema, arraySchema, uiArraySchema } from '../../demoData/formSchemas';
import FormRenderer from '../../DataDrivenForm2/formRenderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Form renderer', () => {
  it('should render widget schema correctly', () => {
    const wrapper = mount(<FormRenderer schema={widgetSchema} uiSchema={uiWidgetSchema} onSubmit={jest.fn()} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render array schema correctly', () => {
    const wrapper = mount(<FormRenderer schema={arraySchema} uiSchema={uiArraySchema} onSubmit={jest.fn()} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});