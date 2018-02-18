# *micrun*
Fastly develop micro services in node.js

## Features
* build in [consul](https://www.consul.io/) support for KV store and health check
* configuration can be stored in consul or locally

## Install
```bash
npm install micrun
```

## Usage
Example usage without Consul
```js
const micrun = require('micrun');

micrun.createServer({
    port: 9000,
    ip: '127.0.0.1',
    useConsul: false,

    postInterfacesDir: '<path to directory>',
    api_key: 'secret',

    getInterfacesDir: '<path to directory>'
});
```

Example usage with Consul as a configuration store.
```js
const micrun = require('micrun');

micrun.createServer({
    useConsul: true,
    consulNamespace: 'my-super-app'
});
```

### Available options:

|name               |description                                        |required                   |
|----               |-------------------------------------              |--------                   |
|port               |Port on which service will be running              | yes                       |
|ip                 |IP of service                                      | yes                       |
|useConsul          |if true Consul will be used as configuration store | no                        |
|consulNamespace    |Name of directory in Consul KV store                | yes if using consul       |
|consulConfig       |Optional configuration for consul ([details](https://github.com/silas/node-consul#consuloptions)) | no |
|postInterfacesDir  |Path to directory where methods are stored          | no                        |
|api_key            |API key for post methods                           | yes if using post methods |
|getInterfacesDir   |Path to directory where methods are stored         | no                        |

## Creating endpoints
All methods are grouped in interfaces, eg. there can be `getSingleUser` method in `users` interface. It could be exposed by service over HTTP GET or POST method.

### Creating POST endpoints
1. Create directory in your project, eg. `my-post-endpoints`
2. In configuration of *micrun* pass absolute path to `my-post-endpoints` as `postInterfacesDir`. For POST methods `api_key` is also required.
3. To create new interface create directory inside `my-post-endpoints`. Name of that directory will be also name of interface.
4. Inside interface directory create `.js` file for every method. Name of the file must include word `Method`.

For example `getSingleUser` method in `users` interface will have file structure:
```
my-post-interfaces
├── users
│   ├── getSingleUserMethod.js
```

getSingleUserMethod.js must export object as below:
```js
const configStore = require('micrun').config;
const config = configStore.getConfig(); // getConfig() can be used to retrieve configuration

module.exports = {
    name: 'getSingleUser', // This is the name of method used in service
    method: function(params) { // This function must return Promise. Params are passed in POST body
        return new Promise((resolve, reject) => {
            // Do something and resolve promise

            return resolve();
        });
    }
};
```
#### Using POST endpoint
Make a POST request to `http://<ip>:<port>`
With JSON body:
```json
{
    "API_KEY": "<api_key>",
    "interface": "<interface>",
    "method": "<method>",
    "additional_data": "some_data"
}
```

### Creating GET endpoints
Creating GET methods is similar to creating POST methods. In configuration of *micrun* pass absolute path to directory with GET interfaces as `getInterfacesDir`.

getSingleUserMethod.js as a GET method:
```js
module.exports = {
    name: 'get_single_user', // This is the name of method used in service
    method: function(req, res) { 
        return res.json({
            // some data
        });
    }
};
```

#### Using GET endpoint
To call GET method simply make request to: `http://<ip>:<port>/:interface/:method

Eg. `http://127.0.0.1:9000/users/get_single_user`

## Example
Example [project](./example) using *micrun*.

## Testing
```
npm run test
```
