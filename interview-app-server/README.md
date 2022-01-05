# Ignite API

Ignite backend platform and REST API. Provides users, user roles and endpoints containing business logic.

This repository contains source code for:

- Generic REST API
- REST API building framework based on [fortune.js](https://fortune.js.org)
- API Administration panel
- UI for REST API endpoint builder

## Technologies

- Node.js
- Database (one of: MongoDB, ElasticSearch, file system and more)

## Instalation

- make sure you have installed `nodejs`, `npm` and one of the [databases](#databases)
- clone this repository
- run `npm install`
- to start the server run `node server`
- open application in your browser http://localhost:1337
- to login find the credentials in `noadmin` section in [config.js](config/config.js)

## Databases

REST server is using [fortune.js](https://fortune.js.org) as database abstraction layer and so it supports any database which has fortune.js adapter
By default the REST server is set up to use ElasticSearch running on port 9299. Setup for each supported database follows.

### MongoDB
- install MongoDB
- edit [server.js](server.js)
- look for `adapters` object, more precisely `adapters.mongoDB`
- edit properties to match your databse
- set your adapter: `masterConfig.storeConfig.adapter = adapters.mongoDB`

### ElasticSearch
- install ElasticSearch
- edit [server.js](server.js)
- look for `adapters` object, more precisely `adapters.elasticSearch`
- edit properties to match your databse
- set your adapter: `masterConfig.storeConfig.adapter = adapters.elasticSearch`

### File System
If you just want to test out the app and not use any database then
- edit [server.js](server.js)
- look for `masterConfig.storeConfig.adapter` and change that line to `masterConfig.storeConfig.adapter = adapters.fileSystem` and you're ready to run the server

## Creating endpoints

Two ways of creating REST API endpoints is supported: 
- dynamic endpoints - can be created with provided UI or by using REST API methods without coding. The UI for creating endpoints is at http://localhost:1337/endpoint
- static endpoints - can only be created by writing a controller class that extends Controller base class ot some other controller ([example controller](controllers/v1/default.js))

## User Roles

By default there are two roles: `admin` and `user`.
If during instalation no admin account is found, one will be created by using `noadmin` section in [config.js](config.js)
Custom user roles support is built in and each user can have more than one role.
Each endpoint in the REST API can have different roles for record Creation, Reading, Deletion, Modifying.
Additionally it can be set that only owner of the record can delete it, read it or modify it.

For example, take a look at this example access configuration:
```
"access":{
    "create":{"roles":["admin"]},
    "update":{"roles":["admin","user"],"owner":true},
    "read":{"roles":["admin","user"],"owner":false},
    "delete":{"roles":["admin","user"],"owner":true}
}
```
It means:
- only admins can create records in this endpoint
- both admins and users are able to update records but only the ones they created
- admins and users can read the records
- admins and users can delete their own records

This is record level access control. For more granular field level access, the correct controller rules must be coded.

## JSON Schemas

System internaly represents each endpoint's data structure with JSON Schema.
Schemas are available via this url: `http://localhost:1337/schema/{endpointName}`. 
For example `user` schema is here: http://localhost:1337/schema/user

## Authorization

Bearer token authorization is supported.
This means that after successful login, the authorization token is obtained. Every subsequent API call should have this token inside the "Authorization" header field like so:
```
Authorization: Bearer 12345
```
where 12345 is the obtained token.

## API Documentation

API documentation is auto generated and can be found here: http://localhost:1337/docs

## Postman support

Postman is popular collaboration platform for API development.

To import the API definitions into Postman:
- click `Import`
- select `Import From Link` tab
- paste `http://localhost:1337/raml/0.8`
- press `Import` button