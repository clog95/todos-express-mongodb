# Overview

Todos app - an app for keeping track of tasks that need to get done. People access their individual to-do list by signing in to their existing account, or signing up for a new account.

This app is built using the [Express](https://expressjs.com/) web framework, along with [EJS](https://ejs.co/) as a template engine. [MongoDB](https://www.mongodb.com/) as a database for storing data.

The sign in functionality using [Passport](https://www.passportjs.org/), and the [passport-local](https://www.passportjs.org/packages/passport-local/) strategy.

When a user first arrives at this app, they are prompted to sign in. Once authenticated, a login session is established and maintained between the server and the user's browser with a cookie.

After signing in, the user can view, create, and edit todo items.

# Installation

Assuming you have installed MongoDB and Node.js on your computer.

Clone this repository, then go into the app directory and install dependencies:

```bash
$ git clone https://github.com/clog95/todos-express-mongodb.git
$ cd todos-express-password
$ npm install
```

Start the server:
```bash
$ npm start
```

Navigate to [`http://localhost:3000`](http://localhost:3000).