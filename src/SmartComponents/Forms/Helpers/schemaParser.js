/**Fields component placeholders */
const TEXT_FIELD = 'text-field';
const TEXTAREA_FIELD = 'textarea-field';
const FIELD_ARRAY = 'field-array';
const CHOICES = 'choices-component';
const SELECT_COMPONENT = 'select-component';
const FIXED_LIST = 'fixed-list';
const CHECKBOX = 'checkbox';
const SUB_FORM = 'sub-form';
const RADIO = 'radio-component';

/**Validator functions placeholder */
const REQUIRED = 'required-validator';
const MIN_LENGTH = 'min-length-validator';
const MIN_ITEMS_VALIDATOR = 'min-items-validator';

let autofocusField = undefined;
let definitions = undefined;
let defaultValues = {};

const validatorBuilder = ({ schema, fields = {}, key }) => {
    const result = [];
    if (schema.required && schema.required.includes(key)) {
        result.push({ type: REQUIRED });
    }

    if (fields[key] && fields[key].minLength) {
        result.push({ type: MIN_LENGTH, treshold: fields[key].minLength });
    }

    if (schema.minItems) {
        result.push({ type: MIN_ITEMS_VALIDATOR, treshold: schema.minItems });
    }

    return result;
};

const componentMapper = type => ({
    string: { component: TEXT_FIELD, type: 'text' },
    tel: { component: TEXT_FIELD, type: 'tel' },
    password: { component: TEXT_FIELD, type: 'password' },
    integer: { component: TEXT_FIELD, type: 'number', step: 1 },
    updown: { component: TEXT_FIELD, type: 'number' },
    number: { component: TEXT_FIELD, type: 'number' },
    range: { component: TEXT_FIELD, type: 'range' },
    textarea: { component: TEXTAREA_FIELD },
    choices: { component: CHOICES },
    select: { component: SELECT_COMPONENT },
    boolean: { component: CHECKBOX, type: 'checkbox' },
    radio: { component: RADIO, type: 'radio' }
})[type];

/**create fields from object */
const createFieldsFromObject = (schema, uiSchema) => Object.keys(schema.properties).map(key => {
    const fields = schema.properties;
    /**
     * redirect to definitions if fielas have external definition
     */
    if (fields[key].items && fields[key].items.$ref) {
        return convertSchema(
            {
                ...fields[key],
                items: definitions[fields[key].items.$ref.split('#/definitions/').pop()]
            },
            uiSchema[key],
            key
        );
    }

    if (fields[key].type === 'array' && fields[key].items && fields[key].items.type === 'object') {
        return {
            title: fields[key].title,
            component: SUB_FORM,
            ...convertSchema({ ...fields[key] }, uiSchema[key], key)
        };
    } else if (fields[key].type === 'array' && Array.isArray(fields[key].items) && fields[key].additionalItems) {
        return {
            title: fields[key].title,
            component: FIXED_LIST,
            ...convertSchema(
                { ...fields[key], type: 'array', items: fields[key].items, additionalItems: fields[key].additionalItems },
                uiSchema[key], key
            )
        };
    } else if (fields[key].type === 'array' && fields[key].items && typeof fields[key].items === 'object') {
        return {
            ...convertSchema(
                { ...fields[key], items: fields[key].items, type: 'array', title: fields[key].title },
                uiSchema[key],
                key
            )
        };
    }

    return {
        name: key,
        label: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
        autofocus: autofocusField === key,
        validate: validatorBuilder({ schema, fields, key }),
        description: uiSchema[key] && uiSchema[key]['ui:description'],
        helperText: uiSchema[key] && uiSchema[key]['ui:help'],
        ...fields[key],
        ...componentMapper(
            (uiSchema[key] && uiSchema[key]['ui:widget'])
            || (uiSchema[key] && uiSchema[key]['ui:options'] && uiSchema[key]['ui:options'].inputType)
            || fields[key].enum && 'select' || fields[key].type
        )
    };
});

const widgetMapper = type => ({
    checkboxes: 'choices'
})[type];

const choiceMapper = type => ({
    checkboxes: 'checkbox'
})[type];

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
                ...componentMapper(widgetMapper(uiSchema['ui:widget']) || schema.items.type),
                validate: validatorBuilder({ schema, key }),
                options: schema.items.enum,
                type: choiceMapper(uiSchema['ui:widget'])
            };
        } else if (schema.items && Array.isArray(schema.items) && schema.additionalItems) {
            nestedSchema.fields = [
                ...schema.items.map(({ type, title, ...rest }, index) => {
                    const options = rest;
                    if (type === 'boolean') {
                        if (!(!rest.enum && uiSchema.items && !uiSchema.items[index] || !rest.enum && !uiSchema.items)) {
                            options.options = rest.enum || uiSchema.items && uiSchema.items[index]['ui:widget'] === 'select' ? [{
                                label: 'Please Choose',
                                value: undefined,
                                disabled: true
                            }, { label: 'Yes', value: true }, { label: 'No', value: false }] : [ 'Yes', 'No' ];
                        }
                    }

                    return {
                        validate: validatorBuilder({ schema, key: `${key}.items` }),
                        label: title,
                        name: `${key}.items.${index}`,
                        ...componentMapper(uiSchema.items && uiSchema.items[index]['ui:widget'] || type),
                        ...options
                    };
                })
            ];
            nestedSchema.additionalItems = convertSchema(
                { type: 'array', items: schema.additionalItems },
                { items: uiSchema.additionalItems }, `${key}.additionalItems`
            );
            nestedSchema.component = FIXED_LIST;
        } else if (schema.items && typeof schema.items === 'object' && schema.items.type === 'array') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.fields = [ convertSchema({
                ...schema.items
            }, uiSchema && uiSchema.items, `${key}.items`) ];
        } else if (schema.items && typeof schema.items === 'object') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items, key: `${key}` }),
            nestedSchema.fields = [{
                label: schema.items.title,
                ...componentMapper(uiSchema.items && uiSchema.items['ui:widget'] || schema.items.type),
                validate: validatorBuilder({ schema: schema.items, fields: schema.items, key: `${key}.items` })
            }];
        }

        return {
            ...meta,
            ...nestedSchema,
            ...result,
            key
        };
    }

    if (schema.type === 'object') {
        autofocusField = Object.keys(uiSchema).filter(key => uiSchema[key] && uiSchema[key]['ui:autofocus']).pop();
        result.fields = createFieldsFromObject(schema, uiSchema, key);
        return {
            ...meta,
            ...result,
            key
        };
    }
};

const initialize = (schema, uiSchema) => {
    autofocusField = undefined;
    definitions = undefined;
    defaultValues = {};
    return convertSchema(schema, uiSchema);
};

export default initialize;
