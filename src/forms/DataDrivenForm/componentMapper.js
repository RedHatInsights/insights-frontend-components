import { TextField, TextareaField, SwitchField } from '../FormFields/formFields';

const typeMapper = (type = 'string') => ({
  string: { component: TextField, type: 'text' },
  integer: { component: TextField, type: 'number' },
  boolean: { component: SwitchField },
})[type];

const widgetMapper = (type, component) => ({
  updown: { ...component, type: 'number' },
  password: { ...component, type: 'password' },
})[type];

export default (type, widget) => {
  let component = typeMapper(type);
  if (widget !== undefined) {
    component = widgetMapper(widget, component);
  }
  return component;
};