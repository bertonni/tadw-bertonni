import { io as ioClient } from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
const socket = ioClient(ENDPOINT);

export const io = socket;