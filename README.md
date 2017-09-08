# Places

Web application is built in MEAN (Mongo, Express, Angular Js,Node Js) to add places and calculate distance between them.

## Getting Started

Project is divided into two modules: api and app

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) 

### API Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:
* Install local dependencies (from the project root folder):
    cd api
    npm install
  (This will install the dependencies declared in the api/package.json file)
To start the api server go to the api folder and run node server.js command

server host: http://localhost:8100/

### Client App
Our client app is build in angular js
* Install local dependencies (from the project root folder):
    cd app
    npm install
  (This will install the dependencies declared in the app/package.json file)
To start the Client server go to the app folder and run gulp command
server host: http://localhost:8080/


## Development

### Folders structure
At the top level, the repository is split into a App folder and a Api folder.  The App folder contains all the client-side AngularJS application.  The Api folder contains a very basic Express based webserver that delivers and supports the application.
Within the App folder you have the following structure:
* `node_modules`
* `dist` contains build results
* `src` contains application's sources