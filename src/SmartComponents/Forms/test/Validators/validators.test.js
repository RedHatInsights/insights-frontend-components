import { required, minLength, minValue, maxValue, dataTypeValidator, patternValidator } from '../../Validators/validators';

describe('Form validators', () => {
  describe('required validator', () => {
    it('should pass the validation', () => {
      expect(required('foo')).toBeUndefined();
    });

    it('should return default error message', () => {
      expect(required(undefined)).toEqual('Required');
    });

    it('should return custom error message', () => {
      expect(required({ message: 'Foo' })(undefined)).toEqual('Foo');
    });
  });

  describe('min length validator', () => {
    it('should pass the validation', () => {
      expect(minLength({ treshold: 5})('Some longer text')).toBeUndefined();
    })

    it('should return default error message', () => {
      expect(minLength({ treshold: 99})('Foo')).toEqual('Should be atleast 99 long');
    });
  });

  describe('min value validator', () => {
    it('should pass the validation', () => {
      expect(minValue({ value: 99 })(123)).toBeUndefined();
    });

    it('should pass the validation if no input given', () => {
      expect(minValue({ value: 99 })()).toBeUndefined();
    });
  
    it('should not pass the validation', () => {
      expect(minValue({ value: 99 })(1)).toEqual('Should be greater or equal to: 99');
    });
  
    it('should not pass the validation and return custom message', () => {
      expect(minValue({ value: 99, message: 'Foo' })(1)).toEqual('Foo 99');
    });

    describe('max value validator', () => {
      it('should pass the validation', () => {
        expect(maxValue({ value: 99 })(1)).toBeUndefined();
      });

      it('should pass the validation if no input given', () => {
        expect(maxValue({ value: 99 })()).toBeUndefined();
      });

      it('should not pass the validation', () => {
        expect(maxValue({ value: 99 })(123)).toEqual('Should be less or equal to: 99');
      });

      it('should not pass the validation and return custom validation', () => {
        expect(maxValue({ value: 99, message: 'Foo' })(123)).toEqual('Foo 99');
      });
    });
  });

  describe('pattern validator', () => {
    it('should pass pattern validation with no configuration', () => {
      expect(patternValidator('Foo')).toBeUndefined();
    });

    it('should pass pattern validation with configured regexp pattern', () => {
      expect(patternValidator({ pattern: /^Foo$/ })('Foo')).toBeUndefined();
    });

    it('should pass pattern validation with configured error message', () => {
      expect(patternValidator({ message: 'Regexp pattern' })()).toBeUndefined();
    });

    it('should fail pattern validation and return default message', () => {
      expect(patternValidator({ pattern: /^Foo$/ })('Bar')).toEqual('Value must match pattern: /^Foo$/');
    });

    it('should fail pattern validation and return custom message', () => {
      expect(patternValidator({ pattern: /^Foo$/, message: 'Custom message' })('Bar')).toEqual('Custom message: /^Foo$/');
    });

    it('should fail pattern validation and return custom message but not show pattern', () => {
      expect(patternValidator({ pattern: /^Foo$/, message: 'Custom message', showPattern: false })('Bar')).toEqual('Custom message');
    });

    it('should pass pattern validation with configured regexp pattern as string', () => {
      expect(patternValidator({ pattern: '^Foo$' })('Foo')).toBeUndefined();
    });
  });

  describe('data type validator', () => {
    it('should return string validator and pass', () => {
      expect(dataTypeValidator('string')({ message: 'String message' })('Foo')).toBeUndefined()
    });

    it('should return string validator and pass if no value is given', () => {
      expect(dataTypeValidator('string')({ message: 'String message' })()).toBeUndefined()
    });

    it('should return string validator and fail', () => {
      expect(dataTypeValidator('string')({ message: 'Should be string' })(123)).toEqual('Should be string')
    });

    it('should return return integerValidator and pass', () => {
      expect(dataTypeValidator('integer')()(123)).toBeUndefined()
    });

    it('should return return integerValidator and pass if no value given', () => {
      expect(dataTypeValidator('integer')()()).toBeUndefined()
    });

    it('should return return integerValidator and fail', () => {
      expect(dataTypeValidator('integer')({ message: 'Should be integer' })('Foo')).toEqual('Should be integer')
    });

    it('should return return integerValidator and fail if decimal nuber given', () => {
      expect(dataTypeValidator('integer')({ message: 'Should be integer' })(123.456)).toEqual('Should be integer')
    });
    
    it('should return boolean validator and pass', () => {
      expect(dataTypeValidator('boolean')()(false)).toBeUndefined()
    });
    
    it('should return boolean validator and pass if no value given', () => {
      expect(dataTypeValidator('boolean')()()).toBeUndefined()
    });
    
    it('should return boolean validator and pass fail', () => {
      expect(dataTypeValidator('boolean')({ message: 'Value should be boolean' })('Foo')).toEqual('Value should be boolean')
    });

    it('should return return numberValidator and pass', () => {
      expect(dataTypeValidator('number')()(123.33)).toBeUndefined()
    });

    it('should return return numberValidator and pass if no value given', () => {
      expect(dataTypeValidator('number')()()).toBeUndefined()
    });

    it('should return return numberValidator and fail', () => {
      expect(dataTypeValidator('integer')({ message: 'Should be number' })('Foo')).toEqual('Should be number')
    });
  });
});