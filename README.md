### Phonebook Management Backend (API)

#### API Documentation
- https://documenter.getpostman.com/view/254034/Uz5Ardp7

#### Database Schema.
- https://github.com/muhdfaiz/ivs-backend-assessment/blob/master/db-schema.zip

#### Database Diagram
- https://github.com/muhdfaiz/ivs-backend-assessment/blob/master/db-diagram.png

<br>

#### URL
```
Deployed URL
https://phonebook-backend.muhdfaiz.com/

Local URL
http://localhost:3000/
```

#### Description
- Use JWT for API authentication.
- Use Express JS for the Node.js framework.
- Use MongoDB as a database.
- Use Nginx as a reverse proxy.
- Use Jest as a testing tool.

#### Setup Instruction

1. Clone the repo.
<br>
2. Install NPM packages.
```
npm install
```

3. Rename `.env.example` to `.env`. Update config like MongoDB host, port and database name/
<br>

4. Create MongoDB database. Connect to MongoDB CLI and run command below
```
use phonebook_management
db.createCollection("users")
db.createCollection("phonebooks")
```

5. Run application
```
Dev Mode
npm run dev

Prod Mode
npm run prod
```

6. Run test
```
npm run test
```