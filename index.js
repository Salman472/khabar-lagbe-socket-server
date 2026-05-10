import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import axios from 'axios'

// Load environment variables from .env file
dotenv.config()

// Create express application
const app = express()

// Create HTTP server using express app
const server = http.createServer(app)

// Define server port
const port = process.env.PORT || 5000

// Create socket.io server
const io = new Server(server, {
    cors: {
        // Allow frontend URL
        origin: process.env.NEXT_BASE_URL
    }
})

// Run when a new client connects
io.on("connection", (socket) => {

    // Show connected socket id
    console.log('user connected', socket.id);

    // Listen for identity event from frontend
    socket.on('identity', async (userId) => {

        // Save userId and socketId in database
        await axios.post(
            `${process.env.NEXT_BASE_URL}/api/socket/connect`,
            {
                userId,
                socketId: socket.id
            }
        )
    })

    // Listen for live location updates
    socket.on(
        'update-location',
        async ({ userId, latitude, longitude }) => {

            // Print received location data
            console.log(userId, latitude, longitude);
        }
    )

    // Run when user disconnects
    socket.on('disconnect', () => {

        // Show disconnected socket id
        console.log('user disconnected', socket.id);
    })
})

// Start server
server.listen(port, () => {
    console.log(`app listen : http://localhost:${port}`);
})