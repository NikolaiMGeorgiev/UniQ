import express from "express";
import { DatabaseHelper } from "./helpers/database-helper.js";
import { UserController } from "./controllers/users-controller.js";
import { RoomsController } from "./controllers/rooms-controller.js";
import { QueueController } from "./controllers/queue-controller.js";

function bodyParser(req, res, next) {
    const contentType = req.headers["content-type"];
    let data = "";

    req.on("data", chunk => data += chunk.toString());
    req.on("end", () => {
        if (!contentType || contentType == "application/json") {
            req.body = data ? JSON.parse(data) : [];
        } else {
            console.error(contentType);
        }
        next();
    });
}

const app = express();
app.use(bodyParser);
const db = new DatabaseHelper();

const userController = new UserController(db);
const roomsController = new RoomsController(db);
const queueController = new QueueController(db);

await userController.initEndpoints(app);
await roomsController.initEndpoints(app);
await queueController.initEndpoints(app);

app.listen(8080, () => {
    console.log('server is listening');
});
