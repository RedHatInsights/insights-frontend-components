import setWith from 'lodash/setWith';
import { components, validators } from './constants';
import {
    validatorBuilder,
    componentMapper,
    createFieldOptions,
    isNestedReference,
    isDefinedByReference,
    isAddableSubForm,
    isAddableWithFixedFields,
    isAddableWithOneField,
    ifFullSubForm,
    replaceKeys,
    orderSchema,
    createDynamicListWithFixed,
    buildConditionalFields
} from './mozillaHelpers';

const keyReplacements = {
    multipleOf: 'step',
    anyOf: 'options',
    enum: 'options',
    format: 'type'
};

/**
 * autofocused field
 */
let autofocusField = undefined;
/**
 * field reference definitions
 */
let definitions = undefined;
/**
 * Form default values
 */
let defaultValues = {};

/**
 * Prepares schema for subForm
 * @param {Object} param0
 * @returns {Object} subForm schema
 */
const prepareSubForm = ({ schema, fields, uiSchema, key }) => ({ name: key,
    title: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
    component: components.SUB_FORM,
    autofocus: autofocusField === key,
    validate: validatorBuilder({ schema, fields, key }),
    description: uiSchema[key] && uiSchema[key]['ui:description'],
    helperText: uiSchema[key] && uiSchema[key]['ui:help'],
    ...convertSchema({ // eslint-disable-line no-use-before-define
        properties: fields[key].properties,
        type: 'object'
    },  uiSchema[key], key)
});

/**
 * Function that creates form field definition object
 * @param {Object} schema object of all fields in given form or its part
 * @param {Object} uiSchema object of additional field modifications in form or its part
 * @param {string} keyPrefix special prefix for nested fields. Is reqiured to create unique field names and proper form data structure
 * @returns {Object} object representing one Form field
 */
const createFieldsFromObject = (schema, uiSchema = {}, keyPrefix) => Object.keys(schema.properties).map(key => {
    const fields = schema.properties;

    /**
     * build conditional fields
     * Follows pattern when field 'x' has value 'y' show field 'z'
     */
    if (schema.dependencies && schema.dependencies[key] && schema.dependencies[key].oneOf) {
        const { dependencies, ...rest } = schema;
        return createFieldsFromObject({ // eslint-disable-line no-use-before-define
            type: 'object',
            properties: buildConditionalFields(fields, dependencies, key)
        }, uiSchema, keyPrefix);
    }

    /**
     * Redirect to initial schema conversion when the field format is defined using references
     * https://github.com/mozilla-services/react-jsonschema-form#schema-definitions-and-references
     */
    if (isNestedReference(fields, key)) {
        /** get form field definition from reference */
        const definition = definitions[fields[key].items.$ref.split('#/definitions/').pop()];
        const field = { ...fields[key] };
        /** remove key to avoid infinite loop */
        delete fields[key].items.$ref;
        return convertSchema({ ...field, items: definition }, uiSchema[key], key); // eslint-disable-line no-use-before-define
    } else if (isDefinedByReference(fields, key)) {
        /** get form field definition from reference */
        const definition = definitions[fields[key].$ref.split('#/definitions/').pop()];
        /** remove key to avoid infinite loop */
        delete fields[key].$ref;
        return createFieldsFromObject({ properties: { [key]: { ...fields[key], ...definition }}}, uiSchema).pop();
    }

    /**
     * Create new schema if field is actually a SUB form
     * https://github.com/mozilla-services/react-jsonschema-form#array-item-options
     */
    if (isAddableSubForm(fields, key)) {
        return {
            title: fields[key].title,
            component: components.SUB_FORM,
            ...convertSchema({ ...fields[key] },  // eslint-disable-line no-use-before-define
                uiSchema[key],
                key)
        };
    /**
     * Create new schema if a field is a dynamic list for adding/removing fields and there are some fixed form fields
     * https://github.com/mozilla-services/react-jsonschema-form#addable-option
     */
    } else if (isAddableWithFixedFields(fields, key)) {
        return { title: fields[key].title, component: components.FIXED_LIST,
            ...convertSchema( // eslint-disable-line no-use-before-define
                { ...fields[key], type: 'array', items: fields[key].items, additionalItems: fields[key].additionalItems },
                uiSchema[key], key
            ) };
    /**
     * Create new schema if a field is another type of SUB form
     */
    } else if (isAddableWithOneField(fields, key)) {
        return { ...convertSchema( // eslint-disable-line no-use-before-define
            { ...fields[key], items: fields[key].items, type: 'array', title: fields[key].title },
            uiSchema[key],
            key
        ) };
    /**
     * Yet another definition for SUB form
     */
    } else if (ifFullSubForm(fields, key)) {
        return prepareSubForm({ schema, fields, uiSchema, key });
    }

    /**
     * New instance of a form field
     */
    let field = {
        name: keyPrefix ? `${keyPrefix}.${key}` : key,
        label: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
        autofocus: autofocusField === key,
        validate: validatorBuilder({ schema, fields, key }),
        description: uiSchema[key] && uiSchema[key]['ui:description'],
        helperText: uiSchema[key] && uiSchema[key]['ui:help'],
        ...fields[key],
        ...componentMapper(
            fields[key].format ||
            (uiSchema[key] && uiSchema[key]['ui:widget'])
            || (uiSchema[key] && uiSchema[key]['ui:options'] && uiSchema[key]['ui:options'].inputType)
            || (fields[key].enum && 'select') || fields[key].type, fields[key].type
        ),
        ...createFieldOptions(uiSchema[key])
    };

    /**
     * Adding validator for minimum and maximum number value
     */
    if (field.dataType === 'number' || field.dataType === 'integer') {
        if (field.minimum) {
            field.validate = [ ...field.validate, {
                type: validators.MIN_NUMBER_VALUE,
                value: field.minimum
            }];
            delete field.minimum;
        }

        if (field.maximum) {
            field.validate = [ ...field.validate, {
                type: validators.MAX_NUMBER_VALUE,
                value: field.maximum
            }];
            delete field.maximum;
        }
    }

    /**
     * Create propper value, label options for enum fields like radio, checkboxes etc.
     */
    if (field.hasOwnProperty('enum')) {
        field.enum = field.enum.map((item, index) => ({
            value: item,
            label: field.enumNames && field.enumNames[index] || item
        }));
        delete field.enumNames;
    }

    /**
     * Alternative way to define select field
     * https://github.com/mozilla-services/react-jsonschema-form#alternative-json-schema-compliant-approach
     */
    if (field.anyOf) {
        field.enum = field.anyOf.map(({ title, ...rest }) => ({ label: title, value: rest.enum[0] }));
        field.component = components.SELECT_COMPONENT;
        delete field.anyOf;
    }

    /**
     * Add default option for select and define options if none were defined
     */
    if (field.component === components.SELECT_COMPONENT) {
        if (!field.enum) {
            field.enum = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
        }

        field.enum.unshift({
            label: 'Please Choose',
            disabled: field.isRequired
        });
    }

    /**
     * Map a form default value
     * Key must match the field name
     * If the field is in some nested structure, it must use prefixed name to avoid name collisions.
     * The default value must be in the same object structure.
     */
    if (field.hasOwnProperty('default')) {
        setWith(defaultValues, keyPrefix ? `${keyPrefix}.${key}` : key, field.default, Object);
    }

    /**
     * Replace key names to match PF4 prop types.
     */
    field = replaceKeys(field, keyReplacements);
    /**
     * Delete unused fields properties
     */
    delete field.pattern;
    return field;
});

const convertSchema = (schema, uiSchema = {}, key) => {
    const meta = {};

    /**
     * store refenrece field definitions for further use
     */
    if (schema.definitions) {
        definitions = schema.definitions;
    }

    if (schema.title) {
        meta.title = schema.title;
    }

    if (schema.description) {
        meta.description = schema.description;
    }

    if (schema.type === 'array') {
        let nestedSchema = {};
        /**
         * Nested schema
         */
        if (schema.items && schema.items.type === 'object') {
            meta.title = schema.title;
            nestedSchema = convertSchema(schema.items, uiSchema.items, key);
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items.properties, key });
            nestedSchema.component = components.FIELD_ARRAY;
        /**
         * Options list checkboxes/selects/radion buttons
         */
        } else if (schema.items && schema.items.enum) {
            nestedSchema = {
                ...componentMapper(uiSchema['ui:widget'] || schema.items.type, schema.items.type),
                validate: validatorBuilder({ schema, key }),
                options: schema.items.enum.map((value, index) => ({ value, label: schema.items.enumNames && schema.items.enumNames[index] || value }))
            };
        /**
         * Dynamic items list with fixed elements
         */
        } else if (schema.items && Array.isArray(schema.items) && schema.additionalItems) {
            nestedSchema.fields = createDynamicListWithFixed(schema, uiSchema, key);
            nestedSchema.additionalItems = convertSchema(
                { type: 'array', items: schema.additionalItems },
                { items: uiSchema.additionalItems }, `${key}.additionalItems`
            );
            nestedSchema.component = components.FIXED_LIST;
        /**
         * Another condition for dynamic form fields
         */
        } else if (schema.items && typeof schema.items === 'object' && schema.items.type === 'array') {
            nestedSchema.component = components.FIELD_ARRAY;
            nestedSchema.fields = [ convertSchema({
                ...schema.items
            }, uiSchema && uiSchema.items, `${key}`) ];

        /**
         * Another condition for dynamic form fields
         */
        } else if (schema.items && typeof schema.items === 'object') {
            nestedSchema.component = components.FIELD_ARRAY;
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items, key: `${key}` }),
            nestedSchema.fields = createFieldsFromObject({ properties: { items: schema.items }}, uiSchema, key);
        }

        return {
            ...meta,
            ...nestedSchema,
            key
        };
    }

    // render actual form field
    if (schema.type === 'object') {
        autofocusField = Object.keys(uiSchema).filter(key => uiSchema[key] && uiSchema[key]['ui:autofocus']).pop();
        return {
            ...meta,
            fields: createFieldsFromObject(schema, uiSchema, key),
            key
        };
    }
};

/**
 * Resets additional information about form
 * Follows React rendering principles.
 * Creates single array, where each item is equal to one React component, or another array with React components.
 * (That is the same structure, that react is able to render => node / array / array of array of nodes etc.)
 * @param {Object} schema form schema
 * @param {Object} [uiSchema = {}] form ui schema
 * @returns {Object} parsed mozilla json schema
 */
const initialize = (schema, uiSchema = {}) => {
    autofocusField = undefined;
    definitions = undefined;
    defaultValues = {};
    let inputSchema = schema;
    if (uiSchema['ui:order']) {
        inputSchema = orderSchema(schema, uiSchema['ui:order']);
    }

    return {
        schema: convertSchema(inputSchema, uiSchema),
        defaultValues
    };
};

export default initialize;
