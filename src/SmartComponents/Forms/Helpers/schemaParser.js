import setWith from 'lodash/setWith';

/**Fields component placeholders */
const TEXT_FIELD = 'text-field';
const TEXTAREA_FIELD = 'textarea-field';
const FIELD_ARRAY = 'field-array';
const SELECT_COMPONENT = 'select-field';
const FIXED_LIST = 'fixed-list';
const CHECKBOX = 'checkbox-field';
const SUB_FORM = 'sub-form';
const RADIO = 'radio-field';

/**Validator functions placeholder */
const REQUIRED = 'required-validator';
/**
 * min length if the input value
 */
const MIN_LENGTH = 'min-length-validator';
/**
 * minimum count of fileds in some dynamic list of fields
 */
const MIN_ITEMS_VALIDATOR = 'min-items-validator';
/**
 * Minimum value of number input
 */
const MIN_NUMBER_VALUE = 'min-number-value';
/**
 * Maximum value of number inpuy
 */
const MAX_NUMBER_VALUE = 'max-number-value';

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
 * Function that creates field level validation
 * @param {Object} param0
 * @param {Object} param0.schema - Form schema definition
 * @param {Object} param0.fields - Form fields definition
 * @param {Object} param0.key - current field identifier
 * @returns {Array<Object>} list of fields validators definitions
 */
const validatorBuilder = ({ schema, fields = {}, key }) => {
    const result = [];
    if (schema.required && schema.required.includes(key)) {
        result.push({ type: REQUIRED });
    }

    if (fields[key] && fields[key].minLength) {
        result.push({ type: MIN_LENGTH, treshold: fields[key].minLength });
        delete fields[key].minLength;
    }

    if (schema.minItems) {
        result.push({ type: MIN_ITEMS_VALIDATOR, treshold: schema.minItems });
    }

    return result;
};

/**
 * @typedef {Object} ComponentDefinition
 * @property {string} component string key of component type
 * @property {string} type type of input-like component
 * @property {string} dataType allowed data type of input values
 */

/**
 * Maps schema field types to react field types
 * @param {string} type mozilla field tpe
 * @param {string} dataType mozilla data type
 * @returns {ComponentDefinition}
 */
const componentMapper = (type, dataType) => ({
    string: { component: TEXT_FIELD, type: 'text', dataType },
    color: { component: TEXT_FIELD, type: 'color', dataType },
    hidden: { component: TEXT_FIELD, type: 'hidden', dataType },
    tel: { component: TEXT_FIELD, type: 'tel', dataType },
    email: { component: TEXT_FIELD, type: 'email', dataType },
    password: { component: TEXT_FIELD, type: 'password', dataType },
    integer: { component: TEXT_FIELD, type: 'number', step: 1, dataType },
    updown: { component: TEXT_FIELD, type: 'number', dataType },
    number: { component: TEXT_FIELD, type: 'number', dataType },
    range: { component: TEXT_FIELD, type: 'range', dataType },
    textarea: { component: TEXTAREA_FIELD, dataType },
    select: { component: SELECT_COMPONENT, dataType },
    boolean: { component: CHECKBOX, type: 'checkbox', dataType },
    checkbox: { component: CHECKBOX, type: 'checkbox', dataType },
    checkboxes: { component: CHECKBOX, type: 'checkbox', dataType },
    radio: { component: RADIO, type: 'radio', dataType }
})[type];

/**
 * Maps mozilla input options to PF4 interface
 * @param {Object} options mozilla ui:options definitions
 * @returns {Object} PF4 input props
 */
const createFieldOptions = (options = {}) => {
    const result = {};
    const uiOption = options['ui:options'] || {};
    if (options['ui:disabled']) {
        result.isDisabled = true;
    }

    if (options['ui:readonly']) {
        result.isReadOnly = true;
    }

    if (uiOption.inline) {
        result.inline = true;
    }

    if (uiOption.rows) {
        result.rows = uiOption.rows;
    }

    return result;
};

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
     * Redirect to initial schema conversion when the field format is defined using references
     * https://github.com/mozilla-services/react-jsonschema-form#schema-definitions-and-references
     */
    if (fields[key].items && fields[key].items.$ref) {
        const definition = definitions[fields[key].items.$ref.split('#/definitions/').pop()];
        const field = { ...fields[key] };
        delete fields[key].items.$ref;
        return convertSchema(
            {
                ...field,
                items: definition
            },
            uiSchema[key],
            key
        );
    } else if (fields[key] && fields[key].$ref) {
        const definition = definitions[fields[key].$ref.split('#/definitions/').pop()];
        delete fields[key].$ref;
        return createFieldsFromObject({
            properties: { [key]: { ...fields[key], ...definition }}
        }, uiSchema).pop();

    }

    /**
     * Create new schema if field is actually a SUB form
     * https://github.com/mozilla-services/react-jsonschema-form#array-item-options
     */
    if (fields[key].type === 'array' && fields[key].items && fields[key].items.type === 'object') {
        return {
            title: fields[key].title,
            component: SUB_FORM,
            ...convertSchema({ ...fields[key] }, uiSchema[key], key)
        };
    /**
     * Create new schema if a field is a dynamic list for adding/removing fields and there are some fixed form fields
     * https://github.com/mozilla-services/react-jsonschema-form#addable-option
     */
    } else if (fields[key].type === 'array' && Array.isArray(fields[key].items) && fields[key].additionalItems) {
        return {
            title: fields[key].title,
            component: FIXED_LIST,
            ...convertSchema(
                { ...fields[key], type: 'array', items: fields[key].items, additionalItems: fields[key].additionalItems },
                uiSchema[key], key
            )
        };
    /**
     * Create new schema if a field is another type of SUB form
     */
    } else if (fields[key].type === 'array' && fields[key].items && typeof fields[key].items === 'object') {
        return {
            ...convertSchema(
                { ...fields[key], items: fields[key].items, type: 'array', title: fields[key].title },
                uiSchema[key],
                key
            )
        };
    /**
     * Yet another definition for SUB form
     */
    } else if (fields[key].properties && typeof fields[key].properties === 'object') {
        return {
            name: key,
            title: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
            component: SUB_FORM,
            autofocus: autofocusField === key,
            validate: validatorBuilder({ schema, fields, key }),
            description: uiSchema[key] && uiSchema[key]['ui:description'],
            helperText: uiSchema[key] && uiSchema[key]['ui:help'],
            ...convertSchema({
                properties: fields[key].properties,
                type: 'object'
            },  uiSchema[key], key)
        };
    }

    /**
     * New instance of a form field
     */
    const field = {
        name: keyPrefix ? `${keyPrefix}.${key}` : key,
        label: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
        autofocus: autofocusField === key,
        validate: validatorBuilder({ schema, fields, key }),
        description: uiSchema[key] && uiSchema[key]['ui:description'],
        helperText: uiSchema[key] && uiSchema[key]['ui:help'],
        ...fields[key],
        ...componentMapper(
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
                type: MIN_NUMBER_VALUE,
                value: field.minimum
            }];
            delete field.minimum;
        }

        if (field.maximum) {
            field.validate = [ ...field.validate, {
                type: MAX_NUMBER_VALUE,
                value: field.maximum
            }];
            delete field.maximum;
        }

        if (field.multipleOf) {
            field.step = field.multipleOf;
            delete field.multipleOf;
        }
    }

    /**
     * Create propper value, label options for enum fields like radio, checkboxes etc.
     */
    if (field.hasOwnProperty('enum')) {
        // TODO determine enum option object
    }

    if (field.component === SELECT_COMPONENT) {
        if (!field.enum) {
            field.enum = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
            field.options = [ ...field.enum ];
        } else {
            field.options = field.enum.map((item, index) => ({
                value: item,
                label: field.enumNames && field.enumNames[index] || item
            }));
        }

        /**
         * Adding empty option that is not selectable
         * TO DO: Should be based on required property of field
         */
        field.options.unshift({
            label: 'Please Choose',
            disabled: true
        });
        delete field.enum;
        delete field.enumNames;
    }

    // FIX ME should be replaced by proper options mapper after the format is known
    if (field.enum) {
        if (field.component === SELECT_COMPONENT) {
            console.log('select');
        } else {
            field.options = field.enum;
            delete field.enum;
        }
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

    return field;
});

const convertSchema = (schema, uiSchema = {}, key) => {
    let result = {};
    const meta = {};
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
            nestedSchema.component = FIELD_ARRAY;
        /**
         * Multiple choice list
         */
        } else if (schema.items && schema.items.enum) {
            nestedSchema = {
                ...componentMapper(uiSchema['ui:widget'] || schema.items.type, schema.items.type),
                validate: validatorBuilder({ schema, key }),
                options: schema.items.enum
            };
        /**
         * Dynamic items list with fixed elements
         */
        } else if (schema.items && Array.isArray(schema.items) && schema.additionalItems) {
            nestedSchema.fields = [
                ...schema.items.map(({ type, title, ...rest }, index) => {
                    let options;
                    if (type === 'boolean') {
                        if (!(!rest.enum && uiSchema.items && !uiSchema.items[index] || !rest.enum && !uiSchema.items)) {
                            options = rest.enum || uiSchema.items && uiSchema.items[index]['ui:widget'] === 'select' ? [{
                                label: 'Please Choose',
                                value: undefined,
                                disabled: true
                            }, { label: 'Yes', value: true }, { label: 'No', value: false }] : [ 'Yes', 'No' ];
                        }
                    }

                    return {
                        validate: validatorBuilder({ schema, key: `${key}` }),
                        label: title,
                        name: `${key}.items.${index}`,
                        ...componentMapper(uiSchema.items && uiSchema.items[index]['ui:widget'] || type, type),
                        options,
                        ...rest
                    };
                })
            ];
            nestedSchema.additionalItems = convertSchema(
                { type: 'array', items: schema.additionalItems },
                { items: uiSchema.additionalItems }, `${key}.additionalItems`
            );
            nestedSchema.component = FIXED_LIST;
        /**
         * Another condition for dynamic form fields
         */
        } else if (schema.items && typeof schema.items === 'object' && schema.items.type === 'array') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.fields = [ convertSchema({
                ...schema.items
            }, uiSchema && uiSchema.items, `${key}`) ];

        /**
         * Another condition for dynamic form fields
         */
        } else if (schema.items && typeof schema.items === 'object') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items, key: `${key}` }),
            nestedSchema.fields = createFieldsFromObject({ properties: { items: schema.items }}, uiSchema, key);
        }

        return {
            ...meta,
            ...nestedSchema,
            ...result,
            key
        };
    }

    /**
     * Create an actual form field
     */
    if (schema.type === 'object') {
        /**
         * Find the first autofocused field in schema
         */
        autofocusField = Object.keys(uiSchema).filter(key => uiSchema[key] && uiSchema[key]['ui:autofocus']).pop();
        result.fields = createFieldsFromObject(schema, uiSchema, key);
        return {
            ...meta,
            ...result,
            key
        };
    }
};

/**
 * Function that will re order the schema fields based on explicit definition
 * @param {Object} schema fields schema
 * @param {Array} order Array with form fields in their rendering order
 * @returns {Object} ordered form fields schema
 */
const orderSchema = (schema, order) => {
    let orderedSchema = schema;
    let orderedProperties = {};
    const initialOrder = Object.keys(schema.properties);
    /**
     * find index of splitter in order
     */
    const endingIndex = order.indexOf('*');

    const startingFields = [ ...order.slice(0, endingIndex) ];
    const endingFields = [ ...order.slice(endingIndex + 1) ];
    const unOrdered = initialOrder.filter(item => !order.find(orderedItem => item === orderedItem));
    /**
     * Order starting fields
     */
    startingFields.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });
    /**
     * Insert unordered fields into middle
     */
    unOrdered.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });
    /**
     * append ending fields to the end
     */
    endingFields.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });

    return { ...orderedSchema, properties: { ...orderedProperties }};
};

/**
 * Resets additional information about form
 * @param {Object} schema form schema
 * @param {Object} uiSchema form ui schema
 * @returns {Object} parsed mozilla json schema
 */
const initialize = (schema, uiSchema) => {
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
