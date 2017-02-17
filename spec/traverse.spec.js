'use strict';

const traverse = require('../lib/traverse');
const spec = require('./support/traverse-spec.json');

describe('traverse', () => {
  let callBack;

  beforeEach(() => {
    callBack = jasmine.createSpy('callBack');
  });

  it('does not call the callback for empty objects', () => {
    traverse(null, null, callBack);
    expect(callBack.calls.count()).toEqual(0);
  });

  it('it should call the callback for every occurrence of the pattern', () => {
    traverse(spec, 'pattern', callBack);
    expect(callBack.calls.count()).toEqual(4);
    expect(callBack.calls.allArgs()).toEqual([
      [{key1: 'value1', key2: 'value2'}, []],
      [{key3: 'value3'}, ['element']],
      [{key5: 'value5'}, ['parentElement', 'childElement']],
      [{key6: 'value6'}, ['parentElement', 'otherChildElement']]
    ]);
  });
});
