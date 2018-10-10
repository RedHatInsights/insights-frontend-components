export const simpleSchemaResult = {
    title: 'A registration form',
    description: 'A simple form example.',
    fields: [{
        name: 'firstName',
        label: 'First name',
        title: 'First name',
        dataType: 'string',
        component: 'text-field',
        type: 'text',
        autofocus: true,
        validate: [{
            type: 'required-validator'
        }]
    }, {
        name: 'lastName',
        dataType: 'string',
        component: 'text-field',
        label: 'Last name',
        title: 'Last name',
        validate: [{
            type: 'required-validator'
        }],
        type: 'text',
        autofocus: false
    }, {
        name: 'age',
        dataType: 'integer',
        label: 'Age of person',
        title: 'Age',
        description: '(earthian year)',
        component: 'text-field',
        type: 'number',
        autofocus: false,
        validate: []
    }, {
        name: 'bio',
        dataType: 'string',
        component: 'textarea-field',
        label: 'Bio',
        title: 'Bio',
        autofocus: false,
        validate: [],
        type: 'string'
    }, {
        name: 'password',
        label: 'Password',
        title: 'Password',
        dataType: 'string',
        component: 'text-field',
        type: 'password',
        autofocus: false,
        helperText: 'Hint: Make it strong!',
        validate: [{
            type: 'min-length-validator',
            treshold: 3
        }]
    }, {
        name: 'telephone',
        dataType: 'string',
        label: 'Telephone',
        title: 'Telephone',
        autofocus: false,
        component: 'text-field',
        type: 'tel',
        validate: [{
            type: 'min-length-validator',
            treshold: 10
        }]
    }]
};

export const nestedSchemaResult = {
    title: 'A list of tasks',
    fields: [{
        name: 'title',
        dataType: 'string',
        autofocus: false,
        validate: [{
            type: 'required-validator'
        }],
        label: 'Task list title',
        title: 'Task list title',
        component: 'text-field',
        type: 'text'
    }, {
        component: 'field-array',
        validate: [],
        title: 'Tasks',
        key: 'tasks',
        fields: [{
            dataType: 'string',
            name: 'tasks.title',
            label: 'Title',
            title: 'Title',
            type: 'text',
            description: 'A sample title',
            component: 'text-field',
            validate: [{
                type: 'required-validator'
            }],
            autofocus: false
        }, {
            name: 'tasks.details',
            dataType: 'string',
            label: 'Task details',
            title: 'Task details',
            description: 'Enter the task details',
            component: 'textarea-field',
            type: 'string',
            validate: [],
            autofocus: false
        }, {
            name: 'tasks.done',
            dataType: 'boolean',
            label: 'Done?',
            title: 'Done?',
            default: false,
            component: 'checkbox-field',
            type: 'checkbox',
            autofocus: false,
            validate: []
        }]
    }]
};

export const arraySchemaResult = {
    fields: [{
        title: 'A list of strings',
        key: 'listOfStrings',
        component: 'field-array',
        validate: [],
        fields: [{
            component: 'text-field',
            dataType: 'string',
            type: 'text',
            validate: [],
            name: 'listOfStrings.items',
            default: 'bazinga',
            autofocus: false
        }]
    }, {
        key: 'multipleChoicesList',
        title: 'A multiple choices list',
        component: 'checkbox-field',
        dataType: 'string',
        validate: [],
        options: [
            'foo',
            'bar',
            'fuzz',
            'qux'
        ],
        type: 'checkbox'
    }, {
        key: 'fixedItemsList',
        title: 'A list of fixed items',
        component: 'fixed-list',
        fields: [{
            name: 'fixedItemsList.items.0',
            dataType: 'string',
            label: 'A string value',
            component: 'textarea-field',
            default: 'lorem ipsum',
            validate: []
        }, {
            name: 'fixedItemsList.items.1',
            dataType: 'boolean',
            label: 'a boolean value',
            validate: [],
            component: 'select-field',
            options: [{
                disabled: true,
                label: 'Please Choose'
            }, {
                label: 'Yes',
                value: true
            }, {
                label: 'No',
                value: false
            }]
        }],
        additionalItems: {
            key: 'fixedItemsList.additionalItems',
            validate: [],
            component: 'field-array',
            fields: [{
                dataType: 'number',
                label: 'Additional item',
                component: 'text-field',
                type: 'number',
                validate: [],
                autofocus: false,
                name: 'fixedItemsList.additionalItems.items',
                title: 'Additional item'
            }]
        }
    }, {
        key: 'minItemsList',
        component: 'field-array',
        title: 'A list with a minimal number of items',
        validate: [{
            type: 'min-items-validator',
            treshold: 3
        }],
        fields: [{
            name: 'minItemsList.name',
            dataType: 'string',
            default: 'Default name',
            component: 'text-field',
            type: 'text',
            validate: [],
            autofocus: false
        }]
    }, {
        key: 'defaultsAndMinItems',
        component: 'field-array',
        title: 'List and item level defaults',
        validate: [{
            type: 'min-items-validator',
            treshold: 5
        }],
        fields: [{
            dataType: 'string',
            component: 'text-field',
            type: 'text',
            validate: [],
            name: 'defaultsAndMinItems.items',
            default: 'unidentified',
            autofocus: false
        }]
    }, {
        key: 'nestedList',
        title: 'Nested list',
        component: 'field-array',
        fields: [{
            title: 'Inner list',
            component: 'field-array',
            validate: [],
            key: 'nestedList',
            fields: [{
                dataType: 'string',
                component: 'text-field',
                validate: [],
                type: 'text',
                name: 'nestedList.items',
                default: 'lorem ipsum',
                autofocus: false
            }]
        }]
    }, {
        component: 'field-array',
        key: 'unorderable',
        title: 'Unorderable items',
        validate: [],
        fields: [{
            dataType: 'string',
            component: 'text-field',
            type: 'text',
            validate: [],
            name: 'unorderable.items',
            default: 'lorem ipsum',
            autofocus: false
        }]
    }, {
        key: 'unremovable',
        title: 'Unremovable items',
        component: 'field-array',
        validate: [],
        fields: [{
            dataType: 'string',
            component: 'text-field',
            type: 'text',
            validate: [],
            name: 'unremovable.items',
            default: 'lorem ipsum',
            autofocus: false
        }]
    }, {
        key: 'noToolbar',
        title: 'No add, remove and order buttons',
        component: 'field-array',
        validate: [],
        fields: [{
            dataType: 'string',
            component: 'text-field',
            type: 'text',
            validate: [],
            name: 'noToolbar.items',
            default: 'lorem ipsum',
            autofocus: false
        }]
    }, {
        key: 'fixedNoToolbar',
        title: 'Fixed array without buttons',
        component: 'fixed-list',
        fields: [{
            dataType: 'number',
            name: 'fixedNoToolbar.items.0',
            label: 'A number',
            default: 42,
            component: 'text-field',
            type: 'number',
            validate: []
        }, {
            name: 'fixedNoToolbar.items.1',
            dataType: 'boolean',
            label: 'A boolean',
            component: 'checkbox-field',
            type: 'checkbox',
            validate: [],
            default: false
        }],
        additionalItems: {
            component: 'field-array',
            key: 'fixedNoToolbar.additionalItems',
            validate: [],
            fields: [{
                dataType: 'string',
                component: 'text-field',
                label: 'A string',
                title: 'A string',
                name: 'fixedNoToolbar.additionalItems.items',
                autofocus: false,
                default: 'lorem ipsum',
                type: 'text',
                validate: []
            }]
        }
    }]
};

export const numbersSchemaResult = {
    title: 'Number fields & widgets',
    fields: [{
        component: 'text-field',
        dataType: 'number',
        name: 'number',
        type: 'number',
        label: 'Number',
        title: 'Number',
        validate: [],
        autofocus: false
    }, {
        name: 'integer',
        autofocus: false,
        component: 'text-field',
        dataType: 'integer',
        type: 'number',
        title: 'Integer',
        label: 'Integer',
        validate: []
    }, {
        name: 'numberEnum',
        dataType: 'number',
        label: 'Number enum',
        title: 'Number enum',
        autofocus: false,
        component: 'select-field',
        type: 'number',
        options: [{
            label: 'Please Choose',
            disabled: true
        }, {
            label: 1,
            value: 1
        }, {
            label: 2,
            value: 2
        }, {
            label: 3,
            value: 3
        }],
        validate: []
    }, {
        name: 'numberEnumRadio',
        label: 'Number enum',
        title: 'Number enum',
        dataType: 'number',
        autofocus: false,
        options: [ 1, 2, 3 ],
        inline: true,
        component: 'radio-field',
        validate: [],
        type: 'radio'
    }, {
        name: 'integerRange',
        label: 'Integer range',
        title: 'Integer range',
        dataType: 'integer',
        validate: [{
            type: 'min-number-value',
            value: 42
        }, {
            type: 'max-number-value',
            value: 100
        }],
        component: 'text-field',
        type: 'range',
        autofocus: false
    }, {
        name: 'integerRangeSteps',
        dataType: 'integer',
        label: 'Integer range (by 10)',
        title: 'Integer range (by 10)',
        step: 10,
        validate: [{
            type: 'min-number-value',
            value: 50
        }, {
            type: 'max-number-value',
            value: 100
        }],
        component: 'text-field',
        type: 'range',
        autofocus: false
    }]
};

export const widgetsExpectedResult = {
    title: 'Widgets',
    fields: [{
        autofocus: false,
        name: 'stringFormats',
        validate: [],
        key: 'stringFormats',
        title: 'String formats',
        component: 'sub-form',
        fields: [{
            name: 'stringFormats.email',
            component: 'text-field',
            type: 'text',
            dataType: 'string',
            format: 'email',
            validate: [],
            autofocus: false
        }, {
            name: 'stringFormats.uri',
            component: 'text-field',
            type: 'text',
            dataType: 'string',
            format: 'uri',
            validate: [],
            autofocus: false
        }]
    }, {
        autofocus: false,
        name: 'boolean',
        title: 'Boolean field',
        validate: [],
        key: 'boolean',
        component: 'sub-form',
        fields: [{
            name: 'boolean.default',
            title: 'checkbox (default)',
            label: 'checkbox (default)',
            validate: [],
            autofocus: false,
            description: 'This is the checkbox-description',
            component: 'checkbox-field',
            type: 'checkbox',
            dataType: 'boolean'
        }, {
            name: 'boolean.radio',
            title: 'radio buttons',
            label: 'radio buttons',
            validate: [],
            autofocus: false,
            description: 'This is the radio-description',
            component: 'radio-field',
            type: 'radio',
            dataType: 'boolean'
        }, {
            autofocus: false,
            validate: [],
            name: 'boolean.select',
            title: 'select box',
            label: 'select box',
            component: 'select-field',
            type: 'boolean',
            dataType: 'boolean',
            description: 'This is the select-description',
            options: [{
                label: 'Please Choose',
                disabled: true
            }, {
                value: true,
                label: 'Yes'
            }, {
                value: false,
                label: 'No'
            }]
        }]
    }, {
        autofocus: false,
        name: 'string',
        title: 'String field',
        validate: [],
        component: 'sub-form',
        key: 'string',
        fields: [{
            autofocus: false,
            validate: [],
            name: 'string.default',
            type: 'text',
            dataType: 'string',
            component: 'text-field',
            title: 'text input (default)',
            label: 'text input (default)'
        }, {
            autofocus: false,
            validate: [],
            name: 'string.textarea',
            rows: 5,
            type: 'string',
            dataType: 'string',
            component: 'textarea-field',
            title: 'textarea',
            label: 'textarea'
        }, {
            autofocus: false,
            validate: [],
            name: 'string.color',
            type: 'color',
            dataType: 'string',
            component: 'text-field',
            title: 'color picker',
            label: 'color picker',
            default: '#151ce6'
        }]
    }, {
        autofocus: false,
        validate: [],
        name: 'secret',
        type: 'hidden',
        dataType: 'string',
        component: 'text-field',
        default: 'I\'m a hidden string.'
    }, {
        autofocus: false,
        validate: [],
        name: 'disabled',
        type: 'text',
        dataType: 'string',
        component: 'text-field',
        title: 'A disabled field',
        label: 'A disabled field',
        default: 'I am disabled.',
        isDisabled: true
    }, {
        autofocus: false,
        validate: [],
        name: 'readonly',
        type: 'text',
        dataType: 'string',
        component: 'text-field',
        title: 'A readonly field',
        label: 'A readonly field',
        default: 'I am read-only.',
        isReadOnly: true
    }, {
        autofocus: false,
        validate: [],
        name: 'widgetOptions',
        type: 'text',
        dataType: 'string',
        component: 'text-field',
        title: 'Custom widget with options',
        label: 'Custom widget with options',
        default: 'I am yellow'
    }, {
        autofocus: false,
        validate: [],
        name: 'selectWidgetOptions',
        type: 'string',
        dataType: 'string',
        component: 'select-field',
        title: 'Custom select widget with options',
        label: 'Custom select widget with options',
        options: [{
            label: 'Please Choose',
            disabled: true
        }, {
            value: 'foo',
            label: 'Foo'
        }, {
            value: 'bar',
            label: 'Bar'
        }]
    }]
};
