import React from 'react';
import { FormGroup, TextInput, TextArea, Select, SelectOption, Checkbox, Radio, Text, TextVariants, TextContent } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { components } from '../SchemaParsers/constants';
import { Field } from 'react-final-form';
import { composeValidators } from '../Helpers/helpers';

const selectComponent = ({ componentType, input, options, isReadOnly, isDisabled, ...rest }) => ({
    [components.TEXT_FIELD]: () => (  // eslint-disable-line react/display-name
        <TextInput
            { ...input }
            { ...rest }
            isReadOnly={ isReadOnly }
            isDisabled={ isDisabled }
        />
    ),
    [components.TEXTAREA_FIELD]: () => <TextArea { ...input } { ...rest } />, // eslint-disable-line react/display-name
    [components.SELECT_COMPONENT]: () => ( // eslint-disable-line react/display-name
        <Select { ...input } { ...rest }>
            { options.map(props => (<SelectOption key={ props.value || props.label } { ...props } label={ props.label.toString() }/>)) }
        </Select>
    ),
    [components.CHECKBOX]: () =>  <Checkbox { ...input } { ...rest }/>, // eslint-disable-line react/display-name
    [components.RADIO]: () => ( // eslint-disable-line react/display-name
        <Radio
            { ...input }
            { ...rest }
            value={ !!input.value }
            onChange={ () => input.onChange(input.value) }
        />
    )
})[componentType];

const FinalFormField = ({
    componentType,
    label,
    isRequired,
    helperText,
    meta,
    description,
    ...rest
}) => {
    const { error, touched } = meta;
    const showError = touched && error;
    return (
        <FormGroup
            isRequired={ isRequired }
            label={ label }
            fieldId={ rest.id }
            isValid={ !showError }
            helperText={ helperText }
            helperTextInvalid={ meta.error }
        >
            { description && <TextContent><Text component={ TextVariants.small }>{ description }</Text></TextContent> }
            { selectComponent({ componentType, ...rest, isValid: !showError })() }
        </FormGroup>
    );
};

FinalFormField.propTypes = {
    componentType: PropTypes.string.isRequired,
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object.isRequired,
    description: PropTypes.string
};

FinalFormField.defaultProps = {
    isRequired: false,
    description: undefined
};

const FormGroupWrapper = props =>
    <Field { ...props } validate={ composeValidators(...props.validate || []) } component={ FinalFormField } />;

export const Condition = ({ when, is, children }) => {
    const shouldRender = value => Array.isArray(is) ? !!is.find(item => item === value) : value === is;
    return (
        <Field name={ when } subscription={ { value: true } }>
            { ({ input: { value }}) => shouldRender(value) ? children : null }
        </Field>
    );
};

Condition.propTypes = {
    when: PropTypes.string.isRequired,
    is: PropTypes.any,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

const FormConditionWrapper = ({ condition, children }) => condition ? (
    <Condition { ...condition }>
        { children }
    </Condition>
) : children;

const SingleCheckboxField = ({ isReadOnly, helperText, ...props }) => (
    <Field
        { ...props }
        validate={ composeValidators(...props.validate || []) }
        type="checkbox"
        render={ rest => selectComponent({ ...rest })() }
    />
);

const MultipleChoiceList = ({ validate, ...props }) => <Field { ...props } validate={ composeValidators(...props.validate || []) }>
    { ({ label, isRequired, helperText, meta, options, ...rest }) => {
        const { error, touched } = meta;
        const showError = touched && error;
        const groupValues = rest.input.value;
        return (
            <FormGroup
                label={ label }
                isRequired={ isRequired }
                fieldId={ rest.id }
                helperText={ helperText }
                helperTextInvalid= { meta.error }
                isValid={ !showError }
            >
                { options.map(option =>
                    <Field
                        id={ `${rest.id}-${option.value}` }
                        key={ option.value }
                        { ...option }
                        name={ props.name }
                        type="checkbox"
                        render={ ({ input, meta, ...rest }) => {
                            const indexValue = groupValues.indexOf(input.value);
                            return (
                                <Checkbox
                                    aria-label={ option['aria-label'] || option.label }
                                    { ...input }
                                    { ...rest }
                                    onChange={ () => indexValue === -1
                                        ? input.onChange([ ...groupValues, input.value ])
                                        : input.onChange([ ...groupValues.slice(0, indexValue), ...groupValues.slice(indexValue + 1) ]) }
                                />
                            );} } />) }
            </FormGroup>
        );
    } }
</Field>;

const SingleChoiceList = ({ validate, ...props }) => (
    <Field
        { ...props }
        validate={ composeValidators(...props.validate || []) }
        render={ ({ input, meta, options, label, isRequired, helperText, ...rest }) => {
            const { error, touched } = meta;
            const showError = touched && error;
            return (
                <FormGroup
                    label={ label }
                    isRequired={ isRequired }
                    fieldId={ rest.id }
                    helperText={ helperText }
                    helperTextInvalid= { meta.error }
                    isValid={ !showError }
                >
                    { options.map(option => (
                        <Field
                            id={ `${rest.id}-${option.value}` }
                            key={ `${props.name}-${option.value}` }
                            name={ props.name }
                            label={ option.label }
                            value={ option.value }
                            aria-label={ option['aria-label'] || option.label }
                            type="radio"
                            componentType={ components.RADIO }
                            render={ props => selectComponent(props)() }
                        />
                    )) }
                </FormGroup>
            );} } />);

const CheckboxGroupField = ({ options, ...rest }) =>
    options ? <MultipleChoiceList options={ options } { ...rest }/>
        : (
            <SingleCheckboxField
                aria-label={ rest['aria-label'] || rest.label }
                { ...rest }
                componentType={ components.CHECKBOX }
            />
        );

const fieldMapper = type => ({
    // eslint-disable-next-line react/display-name
    [components.RADIO]: props => <SingleChoiceList { ...props }/>,
    // eslint-disable-next-line react/display-name
    [components.CHECKBOX]: props => <CheckboxGroupField { ...props }/>,
    // eslint-disable-next-line react/display-name
    [components.SELECT_COMPONENT]: props => <FormGroupWrapper componentType={ components.SELECT_COMPONENT } { ...props } />,
    // eslint-disable-next-line react/display-name
    [components.TEXTAREA_FIELD]: props => <FormGroupWrapper componentType={ components.TEXTAREA_FIELD } { ...props } />,
    // eslint-disable-next-line react/display-name
    [components.TEXT_FIELD]: props => <FormGroupWrapper componentType={ components.TEXT_FIELD } { ...props } />
})[type];

const FieldInterface = ({ meta, dataType, condition, validate, componentType, initialKey, ...props }) => (
    <FormConditionWrapper condition={ condition }>
        { fieldMapper(componentType)({
            ...props,
            validate: Array.isArray(validate) ? validate : [ validate ],
            componentType,
            id: props.id || props.name
        }) }
    </FormConditionWrapper>
);

FieldInterface.propTypes = {
    meta: PropTypes.object,
    condition: PropTypes.shape({
        when: PropTypes.string.isRequired,
        is: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]).isRequired
    }),
    validate: PropTypes.oneOfType([ PropTypes.array, PropTypes.func ]),
    componentType: PropTypes.oneOf([
        components.RADIO,
        components.CHECKBOX,
        components.SELECT_COMPONENT,
        components.TEXTAREA_FIELD,
        components.TEXT_FIELD
    ]).isRequired,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    dataType: PropTypes.any,
    initialKey: PropTypes.any
};

export const TextField = props => <FieldInterface { ...props } componentType={ components.TEXT_FIELD }  />;

export const TextareaField = props => <FieldInterface { ...props }  componentType={ components.TEXTAREA_FIELD } />;

export const SelectField = props=> <FieldInterface { ...props } componentType={ components.SELECT_COMPONENT } />;

export const RadioGroup = props => <FieldInterface { ...props } componentType={ components.RADIO }/>;

export const CheckboxGroup = props => <FieldInterface { ...props } componentType={ components.CHECKBOX }/>;
