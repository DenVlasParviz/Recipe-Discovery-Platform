# Recipe-Discovery-Platform

## Contents
- [Environment Variables (.env)](#environment-variables-env)
- [Local Installation and Running](#local-installation-and-running)
- [Database Schema](#database-schema)
- [Video Example](#video-example)

## Environment Variables (.env)

```
# Server
# Database
DATABASE_URL="postgresql://<DB_USERNAME>:<DB_PASSWORD>@localhost:5432/<DB_NAME>?schema=public"

JWT_SECRET="Secret"
JWT_EXPIRATION=3600s
```
## Local Installation and Running

- Install dependencies and run server and client in two separate terminals:
```bash
# backend
cd backend
npm install

# migrates tables
npx prisma db pull

#start the server
 npm run start:dev

# frontend
cd frontend
npm install
npm run dev
```
---
## Database Schema
---
```mermaid
erDiagram
   Recipe {
        string id PK
        string title
        string ingredients
        string instructions
        string authorId FK
        datetime createdAt
        float avgRating
    }

    Rating {
        string id PK
        string userId FK
        string recipeId FK
        int value
        datetime createdAt
    }

    User {
        string id PK
        string email
        string password
        string name
        datetime createdAt
    }
---
```
## Video Example
https://youtu.be/cFSn1JrUDOY



