import { simple, uiSchemaSimple, nestedSchema, nestedUiSchema, arraySchema, uiArraySchema, numberSchema, numberUiSchema, widgetSchema, uiWidgetSchema, orderingSchema, uiOrderingSchema, referencesSchema, uiReferencesSchema } from "../../demoData/formSchemas";
import { simpleSchemaResult, nestedSchemaResult, arraySchemaResult, numbersSchemaResult, widgetsExpectedResult } from './expectedParserResults';
import convertSchema from '../../Helpers/schemaParser';

describe('Mozilla json schema parser', () => {
  it('should parse simple form example', () => {
    const schema = simple;
    const uiSchema = uiSchemaSimple;
    const result = convertSchema(schema, uiSchema);
    expect(result).toEqual(simpleSchemaResult);
  });

  it('should parse nested schema', () => {
    const schema = nestedSchema;
    const uiSchema = nestedUiSchema;
    const result = convertSchema(schema, uiSchema);
    expect(result).toEqual(nestedSchemaResult);
  });

  it('should parse array schema', () => {
    const schema = arraySchema;
    const uiSchema = uiArraySchema;
    const result = convertSchema(schema, uiSchema);
    expect(result).toEqual(arraySchemaResult);
  });

  it('should parse numbers schema', () => {
    const schema = numberSchema;
    const uiSchema = numberUiSchema;
    const result = convertSchema(schema, uiSchema);
    expect(result).toEqual(numbersSchemaResult);
  });

  it('should parse widgets schema', () => {
    const schema = widgetSchema;
    const uiSchema = uiWidgetSchema;
    const result = convertSchema(schema, uiSchema);
    expect(result).toEqual(widgetsExpectedResult);
  });

  it('should parse ordered schema', () => {
    const schema = orderingSchema;
    const uiSchema = uiOrderingSchema;
    const result = convertSchema(schema, uiSchema);
    const expectedResult =  {
      title: 'A registration form',
      fields: [
        expect.objectContaining({
          name: 'firstName'
        }),
        expect.objectContaining({
          name: 'lastName'
        }),
        expect.objectContaining({
          name: 'bio'
        }), 
        expect.objectContaining({
          name: 'age'
        }), 
        expect.objectContaining({
          name: 'password'
        })
      ]
    };
    expect(result).toEqual(expectedResult);
  });

  it('should parse references schema', () => {
    const schema = referencesSchema;
    const uiSchema = uiReferencesSchema;
    const result = convertSchema(schema, uiSchema);
    const expectedResult = {
      fields: [
        expect.objectContaining({
          name: 'shipping_address',
          title: 'Shipping address',
          fields: [
            expect.objectContaining({
              name: 'street_address',
              component: 'text-field',
              type: 'text',
            }),
            expect.objectContaining({
              name: 'city',
              component: 'text-field',
              type: 'text',
            }),
            expect.objectContaining({
              name: 'state',
              component: 'text-field',
              type: 'text',
            })
          ]
        }),
        expect.objectContaining({
          name: 'billing_address',
          title: 'Billing address',
          fields: [
            expect.objectContaining({
              name: 'street_address',
              component: 'text-field',
              type: 'text',
            }),
            expect.objectContaining({
              name: 'city',
              component: 'text-field',
              type: 'text',
            }),
            expect.objectContaining({
              name: 'state',
              component: 'text-field',
              type: 'text',
            })
          ]
        }),

        expect.objectContaining({
          name: 'tree',
          component: 'sub-form',
          fields: [
            expect.objectContaining({
              name: 'name',
            }),
            expect.objectContaining({
              component: 'field-array',
            })
          ]
        }),
      ]
    }
    expect(result).toEqual(expectedResult);
  });
});