JWT keys
```openssl ecparam -name prime256v1 -genkey -noout -out jwt_private_key.pem```
```openssl ec -in jwt_private_key.pem -pubout -out jwt_public_key.pem``` 

You need to create own .env file example in .env.md

Then run ```npm run start:docker``` command