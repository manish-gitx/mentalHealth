# Hotel Booking Chatbot

**Deployed Link:** [https://bot9-5hfw.onrender.com/](https://bot9-5hfw.onrender.com/)


**Preview Link:** [https://drive.google.com/drive/folders/1Mporz-wwMKHAia_fgpMT9K5c6VCZNYPP?usp=sharing]

## Overview

This project implements a hotel booking chatbot using Express.js and OpenAI's API. The chatbot can handle natural language queries about hotel bookings, fetch room information, and simulate room bookings.

## Features

- **Conversation History Storage:** Utilizes SQLite and Sequelize to store conversation history.
- **Booking Information Storage:** Stores check-in date, checkout date, price, booking ID, and username.
- **Visual Appealing Frontend:** An intuitive and user-friendly interface for interacting with the chatbot.
- **Email Notifications:** Uses Nodemailer to send booking confirmation emails.
- **Basic Error Handling:** Ensures smooth operation and user experience.
- **Function Calling with OpenAI:** Uses OpenAI's function calling feature to handle various hotel booking-related tasks.

## Technical Stack

- Backend: Node.js with Express.js
- Database: SQLite with Sequelize ORM
- NLP: OpenAI API
- Frontend: HTML, CSS, JavaScript

## Database Structure

This project uses SQLite with Sequelize ORM to store conversation history and booking information. The database includes the following models:

1. User
   - userId (primary key): String
   - fullName: String
   - email: String
   - lastInteraction: Date

2. Conversation
   - userId: String
   - messages: Text (stores JSON stringified conversation history)

3. Booking
   - bookingId (primary key): String
   - userId: String
   - roomId: Integer
   - checkInDate: Date
   - checkOutDate: Date
   - totalAmount: Float

The database stores:
- User information for each unique user interacting with the chatbot
- Conversation history to maintain context across user sessions
- Booking details for each successful room reservation


## External API Simulation

The project simulates external API calls for room data and bookings:

1. Get rooms: `GET https://bot9assignement.deno.dev/rooms`
2. Book room: `POST https://bot9assignement.deno.dev/book`


Certainly. Here's an overall README.md file for your hotel booking chatbot project:
markdownCopy# Hotel Booking Chatbot

## Setup

1. Clone the repository:
    ```
    git clone [repository-url]
    cd hotel-booking-chatbot
    ```
    
2. Install dependencies:
    ```
    npm install
    ```
    
3. Set up environment variables:
    Create a `.env` file in the root directory and add:
    ```
    OPEN_API_KEY=your_openai_api_key_here
    PORT=3000
    ```
    
4. Start the server:
    ```
    npm start