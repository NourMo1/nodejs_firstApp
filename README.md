# NodeJS FirstApp

**First node.js application** built with **Express**, **MongoDB**, **Mongoose**, and other libraries.  
It provides REST APIs for **courses** and **users**, with authentication and authorization.

---

## 📦 Features

- JWT authentication (sign up, login)  
- Role-based authorization (e.g. **admin**)  
- CRUD operations for **Courses**  
- CRUD / read operations for **Users**  
- File upload support (e.g. user avatar)  
- Data validation  
- Organized project structure (controllers, models, routes, middlewares, utils, uploads)

---

## 🚀 API Endpoints

Base URL: [`Preview`](https://nodejs-firstapp-fpsx.onrender.com/api)  

### Courses Endpoints

| Method | Route             | Description                        | Access            |
|---|---|---|---|
| `GET` | `/courses`         | Get all courses                   | Public / Authenticated |
| `POST` | `/courses`         | Create a new course                | **Admin only**     |
| `GET` | `/courses/:id`     | Get a single course by ID          | Public / Authenticated |
| `PATCH` | `/courses/:id`     | Update a course                    | **Admin only**     |
| `DELETE` | `/courses/:id`     | Delete a course                    | **Admin only**     |

### Users Endpoints

| Method | Route             | Description                         | Access            |
|---|---|---|---|
| `GET` | `/users`           | Get all users                      | **Admin only**     |
| `POST` | `/users/register`  | Register a new user (with avatar)  | Public            |
| `POST` | `/users/login`     | Login and obtain a JWT token        | Public            |

---

## 🔐 Authentication

- Uses **JSON Web Tokens (JWT)**.  
- After login, the client receives a token which should be sent on protected routes via the `Authorization` header:  

