# Hapi Swagger RBAC

A Hapi plugin to configure RBAC in a swagger specification through [hapi-rbac](https://github.com/franciscogouveia/hapi-rbac).

## Usage

### 1. Swagger spec

Add the 'hapi-rbac' rules to the paths of the swagger spec using the property `x-rbac`.

Example:

```json
{
  "basePath": "/bae/path",
  "paths": {
    "/path1": {
      "get": {
        "x-rbac": {
          "rules": [
            {
              "target": [{"credentials:roles": "admin"}],
              "effect": "permit"
            }
          ]
        }
      }
    }
  }
}
```

### 2. Register plugin

Register the plugin with the following options:

* `spec`: swagger spec with all refs resolved
* `hapiRbac`: options to pass to 'hapi-rbac'

Example:

```js
Server.register({
  register: require('hapi-swagger-rbac'),
  options: {
    spec: spec,
    hapiRbac: {
      responseCode: {
        onDeny: 403,
        onUndetermined: 403
      }
    }
  }
});
```
