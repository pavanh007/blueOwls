
## How to run this on your machine

1. [CLONE](git clone git@github.com:pavanh007/blueOwlsAssign.git) the repository.

2. Clone the repository to your machine.

   ```bash
   $ git clone git@github.com:pavanh007/blueOwlsAssign.git
   ```

3. Install node_modules.

   1. We're working with older systems or libraries that require compatibility with OpenSSL 1.0.x. 
   2. We encounter errors related to OpenSSL when running your Node.js application, especially when dealing with SSL/TLS connections.

   ```bash
   $  export NODE_OPTIONS=--openssl-legacy-provider && yarn install
   ```

4. Run Front end

   ```bash
   $ yarn start
   ```
5. change directory

   ```bash
   $ cd server
   ```
6. install dependencies for server.

   ```bash
   $ pip install reqirements.txt
   ```
6. run FE server.

   ```bash
   $ uvicorn main:App --reload
   ```
   
## LOGIN

   ```bash
   $ DOCTOR: Id: 7892419605, pwd: 12345, PATIENT: Id: 9876543210, pwd: 12345
   ```
![Screenshot 1](https://i.ibb.co/ysrjF3Y/Screenshot-2024-05-10-at-1-36-00-PM.png)

## REGISTER
![Screenshot 2](https://i.ibb.co/LJm9dXV/Screenshot-2024-05-10-at-1-39-30-PM.png)

## DOCTOR VIEW
![Screenshot 3](https://i.ibb.co/wKYLQfW/Screenshot-2024-05-10-at-1-40-46-PM.png)

## PATIENT VIEW
![Screenshot 4](https://i.ibb.co/QpfnnNk/Screenshot-2024-05-10-at-1-41-20-PM.png)

## BOOK APPOINTMENT
![Screenshot 5](https://i.ibb.co/Hhn5w7Y/Screenshot-2024-05-10-at-1-41-33-PM.png)

## EDIT APPOINTMENT
![Screenshot 6](https://i.ibb.co/m8VwQjX/Screenshot-2024-05-10-at-1-41-48-PM.png)

## STRIPE
![Screenshot 7](https://i.ibb.co/gV8SVvW/Screenshot-2024-05-10-at-1-42-00-PM.png)
