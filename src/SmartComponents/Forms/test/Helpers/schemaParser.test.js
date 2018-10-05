import { simple, uiSchemaSimple, nestedSchema, nestedUiSchema, arraySchema, uiArraySchema, numberSchema, numberUiSchema, widgetSchema, uiWidgetSchema } from "../../demoData/formSchemas";
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
});