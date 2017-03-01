'use strict';

const Module = require('module');
const plugin = require('..');
const spec = require('./support/index-spec.json');

describe('hapi-swagger-rbac', () => {
  let routingTable;

  beforeEach(() => {
    routingTable = [
      {
        public: {
          method: 'get',
          path: '/bae/path/path1'
        },
        settings: {
          plugins: {}
        }
      },
      {
        public: {
          method: 'post',
          path: '/bae/path/path1'
        },
        settings: {
          plugins: {}
        }
      }
    ];
  });

  it('should load hapi-rbac and add config to routing table', (done) => {
    let registerOptions;

    spyOn(Module, '_load').and.callFake((name) => {
      return name;
    });

    let server = {
      register: (options, cb) => {
        registerOptions = options;
        cb();
      },
      connections: [{table: () => routingTable}]
    };

    let options = {
      spec: spec,
      hapiRbac: 'hapi rbac options'
    };

    plugin.register(server, options, () => {
      expect(registerOptions).toEqual({register: 'hapi-rbac', options: 'hapi rbac options'});

      expect(routingTable[0].settings.plugins.rbac).toEqual({
        rules: [
          {
            target: [{'credentials:roles': 'admin'}],
            effect: 'permit'
          }
        ]
      });

      expect(routingTable[1].settings.plugins.rbac).toEqual({
        rules: [
          {
            target: [{'credentials:roles': 'user'}],
            effect: 'deny'
          }
        ]
      });

      done()
    });
  });

  it('should handle hapi-rbac registration error and keep routing table untouched', done => {
    let server = {
      register: (options, callback) => {
        callback('unable to load hapi-rbac');
      },
      connections: [{table: () => routingTable}]
    };

    let options = {
      spec: spec
    };

    plugin.register(server, options, (err) => {
      expect(err).toEqual('unable to load hapi-rbac');
      expect(routingTable[0].settings.plugins.rbac).not.toBeDefined();
      expect(routingTable[1].settings.plugins.rbac).not.toBeDefined();
      done();
    });
  });
});
