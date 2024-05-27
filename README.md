# Final Project

This repository contains the full code for the Bookings project.

## How to get started

You can clone the repo, install and run the app with the following commands:

```plaintext
npm install
npm run dev
```

## Setting up Prisma

To setup prisma, follow these steps:

1. Create a `.env` file in the root directory.
2. Add the values for `DATABASE_URL` and `JWT_SECRET` (use an existing MySQL database e.g. "mysql://user:password@localhost:3306/databaseName").
3. Run prisma `npx prisma`, `npx prisma init` and `npx prisma migrate dev` (running seeder separate: `node ./prisma/seed.js`)

## Running Postman Tests

To run postman collection test (positive + negtive), follow these steps:
1. Run `npx prisma migrate reset`, choose `yes`clear
2. Run `npm run test` (both tests will run)