JWT keys
```openssl ecparam -name prime256v1 -genkey -noout -out jwt_private_key.pem```
```openssl ec -in jwt_private_key.pem -pubout -out jwt_public_key.pem``` 

You need to create your own .env file (see example in .env.md).

Then run ```npm run start:docker``` command to launch the project.

To access the Swagger API docs you can open the http://localhost:3001/docs/#/ (instead of 3001 you can use your port of choice) once you run the project, or use the AssignmentForDownshiftLLC.postman_collection.json collection file if you want to use Postman instead.