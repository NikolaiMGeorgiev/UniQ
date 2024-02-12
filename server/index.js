import express from "express";
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

import { DatabaseHelper } from "./helpers/database-helper.js";
import { UserController } from "./controllers/users-controller.js";
import { RoomsController } from "./controllers/rooms-controller.js";
import { QueueController } from "./controllers/queue-controller.js";
import { SocketHelper } from "./helpers/socket.helper.js";
import { JWT_SECRET } from './../config.js';

function bodyParser(req, res, next) {
    const contentType = req.headers["content-type"];
    let data = "";

    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", () => {
        if (!contentType || contentType == "application/json") {
            req.body = data ? JSON.parse(data) : [];
        }
        next();
    });
}

const app = express();

app.use(express.static('.'));
app.use(express.static('client'));

app.use(bodyParser);
app.use("/api", authenticate);
app.use(errorHandler);

const db = new DatabaseHelper();
const server = createServer(app);
const socketHelper = new SocketHelper(server, db);
socketHelper.initSocket();

const userController = new UserController(db);
const roomsController = new RoomsController(db, socketHelper.io);
const queueController = new QueueController(db);

await userController.initEndpoints(app);
await roomsController.initEndpoints(app);
await queueController.initEndpoints(app);

server.listen(8080, () => {
    console.log('server is listening');
});

function authenticate(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.split(' ').length) {
        return next(new Error('Missing token'));
    }
    
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            return next(error);
        }
        req.auth = decoded;
        next();
    });
}

function errorHandler(err, req, res, next) {
    console.error(err);

    let status = 500;

    if (err.message == 'Missing token') {
        status = 401;
    }

    return res.status(status).send();
}
