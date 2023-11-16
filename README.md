# CariCare App Setup Guide

The CariCare App is a patient management application built using React and Express. Follow these steps to set up the application.

## Live Demo
frontend: http://54.146.158.220
backend: http://54.147.35.79:3000

## Environment Configuration

### API

1. Add the following environment variables to a `.env` file in the `./api` directory:

   ```plaintext
   EMAIL="caricare1995@gmail.com"
   EMAIL_PASSWORD="jevo pfwa xsnf fwmi"
   JWT_SECRET=CariCareApp
   ```

**App**

Add the following environment variables to a .env file in the ./app directory.


# Run Project

Ensure that the Docker client is running.

Navigate to the root directory of the CariCare application.

Run the following command to start the project:

```plaintext
./build-dev.sh
```

Front-End: Access the front-end application at http://localhost:5173/.

API: Access the API at http://localhost:3000/.


# Database

To connect to the local database, use the following connection string:

```
postgresql://postgres:password@db:5432/caricare
```


