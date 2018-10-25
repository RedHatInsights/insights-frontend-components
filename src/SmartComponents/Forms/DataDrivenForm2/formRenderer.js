import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import {
    Form as PfForm,
    Button,
    ActionGroup,
    ToolbarGroup,
    ToolbarItem,
    Title,
    Text,
    TextVariants,
    TextContent
} from '@patternfly/react-core';
import arrayMutators from 'final-form-arrays';
import { TextField, TextareaField, CheckboxGroup, RadioGroup, SelectField } from './formFields';
import { mozillaSchemaParser } from '../SchemaParsers/';
import { components, validators } from '../SchemaParsers/constants';
import { required, minLength, dataTypeValidator, patternValidator, minValue, maxValue } from '../Validators/validators';
import { renderArrayField } from './arrayFormComponent';

const SubForm = ({ renderForm, fields, title, description, ...rest }) => (
    <Fragment>
        { title && <Title size="lg">{ title }</Title> }
        { description && <TextContent><Text component={ TextVariants.p }>{ description }</Text></TextContent> }
        { renderForm(fields) }
    </Fragment>
);

SubForm.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderForm: PropTypes.func.isRequired
};

const componentMapper = (componentType, formOptions) => ({
    [components.TEXT_FIELD]: props => <TextField { ...props } key={ props.name }/>, // eslint-disable-line react/display-name
    [components.TEXTAREA_FIELD]: props => <TextareaField { ...props }key={ props.name }/>, // eslint-disable-line react/display-name
    [components.SELECT_COMPONENT]: props => <SelectField { ...props } key={ props.name }/>, // eslint-disable-line react/display-name
    [components.CHECKBOX]: props => <CheckboxGroup { ...props } key={ props.name }/>, // eslint-disable-line react/display-name
    [components.RADIO]: props => <RadioGroup { ...props } key={ props.name }/>, // eslint-disable-line react/display-name
    [components.FIELD_ARRAY]: props => renderArrayField(props, formOptions),
    [components.FIXED_LIST]: props => renderArrayField(props, { ...formOptions, hasFixedItems: true }),
    [components.SUB_FORM]: props => // eslint-disable-line react/display-name
        <SubForm key={ props.key } fieldKey={ props.key } { ...props } renderForm={ formOptions.renderForm }/>
})[componentType];

const validatorMapper = validatorType => ({
    [validators.REQUIRED]: required,
    [validators.MIN_LENGTH]: minLength,
    [validators.MIN_ITEMS_VALIDATOR]: minLength,
    [validators.PATTERN_VALIDATOR]: patternValidator,
    [validators.MAX_NUMBER_VALUE]: maxValue,
    [validators.MIN_NUMBER_VALUE]: minValue
})[validatorType];

const renderSingleField = ({ component, ...rest }, formOptions) => componentMapper(component, formOptions)(rest);

const renderForm = (fields, formOptions) => fields.map(field => Array.isArray(field)
    ? renderForm(field, formOptions)
    : renderSingleField({ ...field, dataType: undefined, validate: field.validate && [ ...field.validate.map(({ type, ...options }) => {
        return Object.keys(options).length === 0 ? validatorMapper(type) : validatorMapper(type)(options);
    }), field.dataType && dataTypeValidator(field.dataType)()  ]}, { renderForm, ...formOptions }));

const FormRenderer = ({ schemaType, schema, uiSchema, onSubmit, onCancel }) => { // eslint-disable-line
    let inputSchema = schema;
    let initialValues = {};
    if (schemaType === 'mozilla' || schema) {
        const input = mozillaSchemaParser(schema, uiSchema);
        inputSchema = input.schema;
        initialValues = input.defaultValues;
    }

    return (
        <Form
            onSubmit={ onSubmit }
            initialValues={ initialValues }
            mutators={ { ...arrayMutators } }
            subscription={ { submitting: true, pristine: true } }
            render={ ({ handleSubmit, pristine, form: { mutators, change }}) => {
                return (
                    <PfForm>
                        { inputSchema.title && <Title size="lg">{ inputSchema.title }</Title> }
                        { inputSchema.description && (
                            <TextContent><Text component={ TextVariants.p }>{ inputSchema.description }</Text></TextContent>
                        ) }
                        { renderForm(inputSchema.fields, { push: mutators.push, change, pristine }) }
                        <ActionGroup>
                            <ToolbarGroup>
                                <ToolbarItem>
                                    <Button type="button" variant="primary" onClick={ handleSubmit }>Submit</Button>
                                    { onCancel && <Button type="button" variant="secondary" onClick={ onCancel }>Cancel</Button> }
                                </ToolbarItem>
                            </ToolbarGroup>
                        </ActionGroup>
                    </PfForm>
                );
            } }
        />
    );
};

FormRenderer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    schemaType: (props, propName, componentName) => {
        if (props[propName] && ![ 'mozilla' ].includes(props[propName])) {
            return new Error(`Invalida prop ${propName} of value ${props[propName]} in ${componentName} component. Expected one of ['mozilla'] `);
        }

        if (!props[propName]) {
            return console.warn(`Form renderer is using new API. Please specify schemaType prop for your form schema. This prop will be required in future release.`); // eslint-disable-line
        }
    }
};

export default FormRenderer;

