import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextField, TextareaField } from '../../DataDrivenForm2';
import { Form } from 'react-final-form';

describe('FinalForm wrapper fields', () => {
  let initialProps;
  let FormContext = ({children}) => (
    <Form onSubmit={jest.fn()}>
      {() => children}
    </Form>
  );

  beforeEach(() => {
    initialProps = {
      name: 'field'
    }
  })

  it('should render TextField without any label', () => {
    const wrapper = mount(
      <FormContext>
        <TextField {...initialProps} />
      </FormContext>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it('should render TextField with label and helper text', () => {
    const wrapper = mount(
      <FormContext>
        <TextField {...initialProps} label="TextField label" helperText="TextField helper text"/>
      </FormContext>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it('should render TextareaField with without any label', () => {
    const wrapper = mount(
      <FormContext>
        <TextareaField {...initialProps}/>
      </FormContext>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it('should render TextareaField with label and helper text', () => {
    const wrapper = mount(
      <FormContext>
        <TextareaField {...initialProps} label="TextareaField label" helperText="TextareaField helper text"/>
      </FormContext>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
  });
});