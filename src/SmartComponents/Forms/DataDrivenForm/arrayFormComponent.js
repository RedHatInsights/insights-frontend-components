import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { composeValidators } from '../Helpers/helpers';
import { FieldArray } from 'react-final-form-arrays';
import { TextContent, Text, TextVariants, Grid, Title, GridItem, ActionGroup, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { CloseIcon, PlusIcon } from '@patternfly/react-icons';
import { Field } from 'react-final-form';

const ArrayItem = ({ renderForm, fields, fieldKey, fieldIndex, name, remove }) => {
    return (
        <Grid sm={ 10 } md={ 12 }>
            <GridItem span={ 11 }>
                { renderForm(fields.map(field => {
                    const itemName = field.name
                        ? field.name.substring(field.name.lastIndexOf('.') + 1)
                        : `${fieldKey}[${fieldIndex}]`;
                    const fieldName = `${name}${itemName && itemName !== 'items' ? itemName : ''}`;
                    return { ...field, name: fieldName, key: name };
                })) }
            </GridItem>
            <GridItem span={ 1 }>
                <Button type="button" variant="danger" onClick={ () => remove(fieldIndex) }><CloseIcon/></Button>
            </GridItem>
        </Grid>
    );
};

ArrayItem.propTypes = {
    renderForm: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object),
    remove: PropTypes.func.isRequired
};

const DynamicArray = ({ fieldKey, validate, title, description, renderForm, fields, itemDefault }) => (
    <FieldArray key={ fieldKey } validate={ validate } name={ fieldKey }>
        { ({ fields: { map, remove, push }, meta: { error, dirty }}) => (
            <Fragment>
                { title && <Title size="lg">{ title }</Title> }
                { description && <TextContent><Text component={ TextVariants.p }>{ description }</Text></TextContent> }
                { map((name, index) =>(
                    <ArrayItem
                        key={ `${name}-${index}` }
                        fields={ fields }
                        name={ name }
                        fieldKey={ fieldKey }
                        fieldIndex={ index }
                        renderForm={ renderForm }
                        remove={ remove }
                    />)
                ) }
                { dirty && error && typeof error === 'string' && <p>{ error }</p> }
                <ActionGroup>
                    <ToolbarGroup className="pf-u-display-flex pf-u-justify-content-flex-end">
                        <ToolbarItem>
                            <Button type="button" variant="link" onClick={ () => push(itemDefault) }>
                                <PlusIcon /> Add { title }
                            </Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ActionGroup>
            </Fragment>
        ) }
    </FieldArray>
);

DynamicArray.propTypes = {
    fieldKey: PropTypes.string,
    validate: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    renderForm: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object),
    itemDefault: PropTypes.any
};

const FixedArrayField = ({ title, description, fields, renderForm, additionalItems }) => {
    return (
        <Fragment>
            { title && <Title size="lg">{ title }</Title> }
            { description && <TextContent><Text component={ TextVariants.p }>{ description }</Text></TextContent> }
            { renderForm(fields) }
            { renderForm([ additionalItems ]) }
        </Fragment>
    );
};

FixedArrayField.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    renderForm: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    additionalItems: PropTypes.object.isRequired
};

export const renderArrayField = (props, { hasFixedItems, renderForm }) => {
    const { key, validate, ...rest } = props;
    return (
        <Field name={ key } key={ key } subscription={ { pristine: true, error: true } }>
            { () => hasFixedItems ? <FixedArrayField { ...props } renderForm={ renderForm } /> : (
                <DynamicArray
                    renderForm={ renderForm }
                    validate={ composeValidators(...validate || []) }
                    fieldKey={ key }
                    { ...rest }
                />
            ) }
        </Field>
    );
};

renderArrayField.propTypes = {
    key: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    fields: PropTypes.array.isRequired,
    validate: PropTypes.array,
    itemDefault: PropTypes.any
};

renderArrayField.defaultProps = {
    validate: []
};
