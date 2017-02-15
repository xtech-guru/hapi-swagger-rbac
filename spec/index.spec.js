'use strict';

const util = require('util');
const plugin = require('../lib/index');
const Module = require('module');

describe('hapi-swagger-rbac', () => {
  let routingTable;
  let spec = {
    'paths':{
      '/things':{
        'get':{
          'x-rbac':{
            'rules': [
              {
                'target':[{ 'credentials:roles': 'admin'}],
                'effect': 'permit'
              }
            ]
          }
        },
        'post':{
          'x-rbac':{
            'rules': [{
                'target':[{ 'credentials:roles': 'regularUser'}],
                'effect': 'deny'
              }
            ]
          }
        }
      }
    }
  };

  beforeEach(() =>  {
    routingTable = [
        {
          'public': {
            'method': 'get',
            'path': '/things'
          },
          'settings':{
            'plugins': {}
          }
        },
        {
          'public': {
            'method': 'post',
            'path': '/things'
          },
          'settings':{
            'plugins': {}
          }
        }
      ];
  });

  it('should load hapi-rbac and add config to routing table ', (done) => {
    let registerOptions;

    let load = spyOn(Module, '_load').and.callFake((name) => {
      return name;
    });

    let server = {
      register: (options, cb) => {
        registerOptions = options;
        cb();
      },
      'connections':[
          {
            table: () => {
              return routingTable;
            }
          }
        ]
      };

    let options = {
      spec: spec,
      hapiRbac: 'hapi rbac options'
    };

    plugin.register(server, options, () =>  {
      expect(registerOptions).toEqual({register: 'hapi-rbac', options: 'hapi rbac options'});

      expect(server.connections[0].table()[0].settings.plugins.rbac).toEqual({
        'rules': [
          {
            'target':[{ 'credentials:roles': 'admin'}],
            'effect': 'permit'
          }
        ]
      });

      expect(server.connections[0].table()[1].settings.plugins.rbac).toEqual({
        'rules': [{
            'target':[{ 'credentials:roles': 'regularUser'}],
            'effect': 'deny'
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
      'connections':[
          {
             table(){
              return routingTable;
            }
          }
        ]
      };
    let options = {
      spec: spec
    };

    plugin.register(server, options, (err) =>  {
      expect(err).toEqual('unable to load hapi-rbac')
      expect(server.connections[0].table()[0].settings.plugins.rbac).not.toBeDefined();
      expect(server.connections[0].table()[1].settings.plugins.rbac).not.toBeDefined();
      done()
    });
  });
});
