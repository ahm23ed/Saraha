# Sarahah-Like Backend Project

## Project Overview

This project is a backend application designed for a Sarahah-like platform, where users can send and receive anonymous messages. It is built using Node.js, Express, and MongoDB. The application includes user authentication, email confirmation, password management, and message handling features.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Authentication Middleware](#authentication-middleware)
- [Validation Middleware](#validation-middleware)
- [User Registration and Login](#user-registration-and-login)
- [Message Handling](#message-handling)
- [User Profile Management](#user-profile-management)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ahm23ed/Saraha.git
    ```

2. Navigate to the project directory:

    ```bash
    cd sarahah-backend/sarahaa
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
TOKENSIGNATURE=your_jwt_signature
BearerKey=your_bearer_key
confirmEmailToken=your_email_confirmation_signature
saltRound=your_salt_rounds_for_password_hashing
baseURL=/api/v1
senderEmail=
senderPassword=
BearerKey=
confirmEmailToken='
cloud_name=
api_key=
api_secret=


