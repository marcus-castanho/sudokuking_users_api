# Sudoku King users API
An API to register, authenticate and manage users of the [Sudoku King app](https://github.com/marcus-castanho/sudokuking). This API in being developed with NodeJS and a NoSQL database MongoDB.

## Features
- CRUD routines for users of the Sudoku King app
- Score record of users game sessions

## Features in developement
- E-mail validation for new users

## Acess public request
For acessing the list of users and their scores, acces the following URL:

[https://sudokuking-users-api.herokuapp.com/list/users_list](https://sudokuking-users-api.herokuapp.com/list/users_list)

## Stack
- Language/runtime environement: JS/[NodeJS](https://nodejs.org/en/)
- Database: [MongoDB](https://www.mongodb.com/)
- Library to handle database objects: [Mongoose](https://github.com/Automattic/mongoose)
- Framework to handle requests: [Express](https://github.com/expressjs/express)