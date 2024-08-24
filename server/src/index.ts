// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  sender: string;
  content: string;
}

interface Room {
  id: string;
  name: string;
  messages: Message[];
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let rooms: Record<string, Room> = {};

io.on('connection', (socket: Socket) => {
  console.log('A user connected', socket.id);

  socket.emit('roomsList', Object.values(rooms).map(({ id, name }) => ({ id, name })));

  socket.on('createRoom', (roomName: string) => {
    const roomId = uuidv4();
    rooms[roomId] = { id: roomId, name: roomName, messages: [] };
    io.emit('roomsList', Object.values(rooms).map(({ id, name }) => ({ id, name })));
    console.log(`Room ${roomName} created with ID: ${roomId}`);
  });

  socket.on('findRoom', (roomId: string) => {
    const room = rooms[roomId];
    if (room) {
      socket.join(roomId);  // Ensure the user joins the room
      socket.emit('foundRoom', room.messages);
    }
  });

  socket.on('newMessage', ({ room_id, content, sender }: { room_id: string; content: string; sender: string }) => {
    const room = rooms[room_id];
    if (room) {
      const newMessage: Message = { sender, content };
      room.messages.push(newMessage);
      io.to(room_id).emit('roomMessage', newMessage); // Broadcast the message to the room
      console.log(`Message sent to room ${room.name}: ${content} by ${sender}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log('Server listening on port 4000');
});
