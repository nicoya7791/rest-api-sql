# Rest API to manage courses and user
This Rest API allow all CRUD operations

## How to get started with the files provided
1. Run `npm install` to get all the project dependencies.
2. Run `npm run seed` to initialize the table with the data provided in the files.
3. Run `npm start` to run the application.
4. If you have nodemon install in your computer, simply type `nodemon` in the terminal to run the application.

### How to access a course
1. Do not try to edit any of the courses provided because the password is not available.
2. Create your own user and password then create courses and associate them to the user you created.
3. To edit or delete a course you must enter your credentials, email and password. In postman open a new tab, then in the menu choose authorization, in the type drop down menu select BASIC AUTH.
4. Go to the body tab and execute the task you desire.


## How to run use this application using postman
### Create a user. 
1. Using **POST*** method go to route api/users and provide the user information. See example below
```json
{
    "firstName": "Alex",
    "lastName": "Thomas",
    "emailAddress": "alex@yahoo.com",
    "password": "alexthomas"
}
```

### Create a course. 
1. Using **post** method go to route api/courses and provide the course information. See exaple below.
**Note:** when you create a course you need to add the userId of the user associated with the course. You can look at the user table to find the user id.  
```json
{
    "title": "How to draw a house",
    "description": "You will learn to draw a house using two-point perspective",
    "estimatedTime": "1 hour",
    "materialsNeeded": "pen, paper, eraser",
    "userId": 2
}
```

### Courses routes
1. using PUT method. Got to route api/courses/:id. This will update a course using course ID.
2. using DELETE method. Gto to route api/courses/:id. This will delete a course using course ID.
3. using GET method. Got to route api/courses/:id. This will select a course using course ID.


