# Northcoders News API

# Summary

I was tasked with creating a news API in a style similar to that of Reddit. This included creating the database, seeding it and then creating the endpoints, all with TDD.

# Accessing the API

Follow the link below to access the API, you will see a list of the available endpoints.
https://northcoders-nc-news.herokuapp.com/api/

# Cloning the Repository

To clone the repository, follow the link below.
https://github.com/AndyRobotsNC/nc-news-app

# Installing dependencies

The following dependencies are required to execute the code. Install through npm install.

- dotenv
- express
- fs
- pg
- pg-format

The following development dependencies are required for testing.

- jest
- jest-sorted
- supertest

# Creating and Seeding the Database

Two files need to be created in the repository for the database.
`env.development` and `env.test`. These will specify which database
to create. Below is an example of `env.development`

PGDATABASE=databaseName
PGPASSWORD=databasePassword

Running `npm setup-dbs` will create the database tables.

Running `npm seed` will seed the database with the development data.

Running `npm test` will seed the database with the test data and also run all of the tests.

# Minimum Version Requirements for Running the Project

- Node.js v17.1.0
- Postgres 12.9
