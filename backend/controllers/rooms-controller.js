import { addRoom, editRoom, removeRoom, getRoomsByUser, getRoom } from "../models/rooms-model.js";
import { getUserByToken, USER_TYPE } from "../models/users-model.js";
import { handleResponse } from "../helpers/reqest-helper.js";
import { ObjectId } from "mongodb";
import { 
    addToShcedule, 
    getScheduleByUser, 
    removeSchedulesForRoom, 
    getUserRoomSchedule, 
    getScheduleByRoom 
} from "../models/schedule-model.js";

const ID_DATABASE_COLUMNS = ["userId", "roomId"];

class RoomsController {
    
    constructor(db) {
        this.db = db;
    }

    async initEndpoints(app) {
        app.get('/rooms', async (req, res) => {
            await this.roomGetRequestHandler(req, res, this.getRoomsData);
        });

        app.get('/rooms/room/:roomId', async (req, res) => {
            await this.roomGetRequestHandler(req, res, this.getRoomData);
        });
        
        app.post('/rooms', async (req, res) => {
            await this.roomHandler(req, res, addRoom);
        });

        app.put('/rooms', async (req, res) => {
            // TODO: make it possible to edit schedule as well
            await this.roomHandler(req, res, editRoom);
        });

        app.delete('/rooms', async (req, res) => {
            await this.roomHandler(req, res, removeRoom);
        });
    }
    
    async getRoomsData(userData) {
        const db = this.db;
        if (userData.type == USER_TYPE.student) {
            userData.schedule = await db.querySingle("schedule", userData.userId, getScheduleByUser);
        }
        const data = await db.querySingle("rooms", userData, getRoomsByUser);
        return { data };
    }

    async getRoomData(userData, reqestParams) {
        const db = this.db;
        const roomId = reqestParams.roomId;
        const userId = userData._id;
        const data = {
            roomData: await db.querySingle("rooms", roomId, getRoom)
        };
        if (userData.type == USER_TYPE.student) {
            const userRoomSchedule = await db.querySingle(
                "schedule", 
                {roomId, studentId: userId}, 
                getUserRoomSchedule
            );
            data.schedule = userRoomSchedule ? userRoomSchedule.startTime : null;
        } else {
            data.schedule = await db.querySingle("schedule", roomId, getScheduleByRoom);
        }
        return { data };
    }

    async roomGetRequestHandler(req, res, cb) {
        const reqestParams = Object.entries(req.params)
            .reduce((acc, curr) => {
                acc[curr[0]] = ID_DATABASE_COLUMNS.indexOf(curr[0]) > -1 ? new ObjectId(curr[1]) : curr[1];
                return acc;
            }, {});
        const userToken = req.body.userToken;
        const userData = await this.db.querySingle("users", userToken, getUserByToken);
        let result = {};

        if (!userData) {
            result.status = 404;
            result.message = "No scuh user";
        } else {
            try {
                result = await cb.apply(this, [userData, reqestParams]);
            } catch (err) {
                console.error(err);
                result.status = 500;
                result.message = "Server error";
            }
        }

        handleResponse(res, result);
    }

    async roomHandler(req, res, cb) {
        const db = this.db;
        let roomData = req.body.roomData;
        const userToken = req.body.userToken;
        const userData = await db.querySingle("users", userToken, getUserByToken);
        roomData._id = new ObjectId(roomData._id);

        let result = userData && roomData.creatorId == userData._id ? 
            await db.querySingle("rooms", roomData, cb) :
            { status: 403, message: "Invalid operation" };

        if (result.status == 200) {
            if (cb == addRoom) {
                await db.querySingle("schedule", roomData, addToShcedule);
            } else if (cb == removeRoom) {
                await db.querySingle("schedule", roomData, removeSchedulesForRoom);
            }
        }

        handleResponse(res, result);
    }
}

export {
    RoomsController
}
