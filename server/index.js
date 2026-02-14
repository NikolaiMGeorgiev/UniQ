import express from "express";
import { createServer } from 'http';
import { UserController } from "./controllers/users-controller.js";
import { RoomsController } from "./controllers/rooms-controller.js";
import { QueueController } from "./controllers/queue-controller.js";
import { SocketHelper } from "./helpers/socket.helper.js";
import { decodeToken } from "./helpers/reqest-helper.js";

const app = express();
app.use(express.static('.'));
app.use(express.static('client'));
app.use(express.static('node_modules'));
app.use(bodyParser);
app.use("/api", authenticate);
app.use(errorHandler);

const server = createServer(app);
const socketHelper = new SocketHelper(server);
socketHelper.initSocket();

const userController = new UserController();
const roomsController = new RoomsController(socketHelper);
const queueController = new QueueController(socketHelper);

await userController.initEndpoints(app);
await roomsController.initEndpoints(app);
await queueController.initEndpoints(app);

function authenticate(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.split(' ').length) {
        return next(new Error('Missing token'));
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    if (decodedToken) {
        req.auth = decodedToken;
        next();
    } else {
        next(new Error('Invalid token'));
    }
}

function errorHandler(err, req, res, next) {
    let status = 500;
    if (err.message == 'Missing token') {
        status = 401;
    }
    console.error(err);
    return res.status(status).send();
}

function bodyParser(req, res, next) {
    const contentType = req.headers["content-type"];
    let data = "";

    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", () => {
        if (!contentType || contentType == "application/json") {
            req.body = data ? JSON.parse(data) : [];
        } else {
            throw new Error("Invalid content type");
        }
        next();
    });
}

server.listen(8080, () => {
    console.log('server is listening');
});
