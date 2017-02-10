'use strict';

const traverse = require('../lib/traverse');

describe('traverse', function() {
  let callBack;
  let spec = {
              'pattern': {
                'fisrtKey': 'firstValue',
                'secondKey': 'secondValue'
              },
              'element':{
                'pattern':{
                  'key': 'value'
                }
              },
              'parentElement':{
                'otherElement':{
                  'noPattern':{
                    'key': 'value'
                  }
                },
                'childElement': {
                  'pattern':{
                    'key': 'value'
                  }
                },
                'otherChildElement': {
                  'pattern':{
                    'otherKey': 'otherValue'
                  }
                }
              }
            };

  beforeEach(function() {
    callBack = jasmine.createSpy('callBack');
  });

  it('does not call the callback for empty objects', function() {
    traverse(null, null, null, callBack);
    expect(callBack.calls.count()).toEqual(0);
  });

  it('it should return an array of objects ', function() {
    traverse(spec, 'pattern', null, callBack);
    expect(callBack.calls.count()).toEqual(4);
    expect(callBack.calls.argsFor(0)).toEqual([{'fisrtKey': 'firstValue', 'secondKey': 'secondValue'}, []]);
    expect(callBack.calls.argsFor(1)).toEqual([{key: 'value'}, ['element']]);
    expect(callBack.calls.argsFor(2)).toEqual([{'key': 'value'}, ['parentElement', 'childElement']]);
    expect(callBack.calls.argsFor(3)).toEqual([{'otherKey': 'otherValue'}, ['parentElement', 'otherChildElement']]);
  });
});
