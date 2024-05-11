
## How to run this on your machine

1. [CLONE](git clone git@github.com:pavanh007/blueOwlsAssign.git) the repository.
2. FE: https://blue-owls-assign-4gff.vercel.app/  && NOTE: BE not deployed

3. Clone the repository to your machine.

   ```bash
   $ git clone git@github.com:pavanh007/blueOwlsAssign.git
   ```

4. Install node_modules.

   1. We're working with older systems or libraries that require compatibility with OpenSSL 1.0.x. 
   2. We encounter errors related to OpenSSL when running your Node.js application, especially when dealing with SSL/TLS connections.

   ```bash
   $  export NODE_OPTIONS=--openssl-legacy-provider && yarn install
   ```

5. Run Front end

   ```bash
   $ yarn start
   ```
6. change directory

   ```bash
   $ cd server
   ```
7. install dependencies for server.

   ```bash
   $ pip install reqirements.txt
   ```
6. run FE server.

   ```bash
   $ uvicorn main:App --reload
   ```
## Core Functionalities:

   1. Login as a patient or practitioner.
   2. Log out using the "logout" button in the profile navigation.
   3. Practitioners and patients have distinct views.
   4. Practitioners can create appointments for patients, which are visible in the patient's view.
   5. Prevention of conflicting appointments by disallowing appointment creation for the same date and time.
   6. Practitioners can view and edit appointments.
   7. patients can use the payment button integrated with Stripe.

   
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


## Future Enhancement

# Front-end

1. Add react-redux and redux-saga for state management.
2. Split the bigger components into chunks.
3. use vite.js as a bundler.
4. Few design improvements.
5. Optimize the flow.

# Backend-end

1. Adding Security for login.
2. Microservice design.
3. BD Shradding.
4. Use HL7 and HIPAA standards for managing the database and security.
5. Error handler.
6. Middlewares.

   
