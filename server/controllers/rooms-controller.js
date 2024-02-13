import { addRoom, editRoom, removeRoom, getRoomsById, getRoomsByTeacher, getRoom } from "../models/rooms-model.js";
import { getUser, USER_TYPE } from "../models/users-model.js";
import { 
    addToShcedule, 
    getScheduleByUser, 
    removeSchedulesForRoom, 
    getUserRoomSchedule, 
    getScheduleByRoom 
} from "../models/schedule-model.js";
import { handleResponse } from "../helpers/reqest-helper.js";
import { ObjectId } from "mongodb";
import { DATABASE_ID_COLUMNS } from "../../config.js";
import { addToQueue, removeFromRoomQueue } from "../models/queue-model.js";

class RoomsController {
    
    constructor(db, io) {
        this.db = db;
        this.io = io;
    }

    async initEndpoints(app) {
        app.get('/api/rooms', async (req, res) => {
            const data = await this.getReqestData(req, true);
            const result = await this.getRoomsData(data);
            handleResponse(res, result);
        });

        app.get('/api/rooms/:roomId', async (req, res) => {
            const data = await this.getReqestData(req, true);
            let result = await this.getRoomData(data);

            if (!result.data || !result.data.roomData) {
                return handleResponse(res, result);
            }

            const resultData = result.data;
            const isTeacher = data.userId.toString() == resultData.roomData.creatorId.toString();
            if (isTeacher) {
                const roomUpdateData = { 
                    _id: resultData.roomData._id, 
                    status: "started" 
                };
                resultData.roomData.status = "started";
                result = await this.db.querySingle("rooms", roomUpdateData, editRoom);
            } else {
                const queueData = {
                    roomId: data.roomData.roomId, 
                    userId: data.userId
                };
                await this.db.querySingle("queue", queueData, removeFromRoomQueue);
                result = await this.db.querySingle("queue", queueData, addToQueue);
            }
            if (result.status == 200) {
                result.data = resultData;
            }
            
            handleResponse(res, result);
        });
        
        app.post('/api/rooms', async (req, res) => {
            const data = await this.getReqestData(req);
            const roomData = data.roomData;
            const studentIds = roomData.students ? roomData.students.split(',') : [];
            roomData.creatorId = data.userId;

            let result = await this.db.querySingle("rooms", roomData, addRoom);
            if (result.status == 200 && studentIds.length) {
                roomData._id = result.roomId;
                roomData.students = studentIds;
                result = await this.db.querySingle("schedule", roomData, addToShcedule);
            }

            handleResponse(res, result);
        });

        app.put('/api/rooms/:id', async (req, res) => {
            // TODO: make it possible to edit schedule as well
            const data = await this.getReqestData(req);
            const updatedRoomData = data.roomData;
            const roomId = new ObjectId(updatedRoomData.id);
            const roomData = await this.db.querySingle("rooms", roomId, getRoom);

            if (roomData.creatorId.toString() != data.userId.toString()) {
                return handleResponse(res, { status: 403, message: "Invalid operation" });
            }

            updatedRoomData._id = roomId;
            const result = await this.db.querySingle("rooms", updatedRoomData, editRoom);
            handleResponse(res, result);
        });

        app.delete('/api/rooms/:id', async (req, res) => {
            const data = await this.getReqestData(req);
            const roomId = new ObjectId(data.roomData.id);
            const roomData = await this.db.querySingle("rooms", roomId, getRoom);

            if (roomData.creatorId.toString() != data.userId.toString()) {
                return handleResponse(res, { status: 403, message: "Invalid operation" });
            }

            let result = await this.db.querySingle("schedule", roomId, removeSchedulesForRoom);
            if (!result) {
                return handleResponse(res, result);
            }

            result = await this.db.querySingle("rooms", roomId, removeRoom);
            handleResponse(res, result);
        });
    }
    
    async getRoomsData(requestData) {
        const db = this.db;
        const userId = requestData.userId;
        
        if (requestData.userData.role == USER_TYPE.teacher) {
            const data = await db.querySingle("rooms", userId, getRoomsByTeacher);
            return { data };
        }

        const schedules = await db.querySingle("schedule", userId, getScheduleByUser);
        const roomIds = schedules.map(schedule => schedule.room_id);
        const data = await db.querySingle("rooms", roomIds, getRoomsById);
   
        return { data };
    }

    async getRoomData(requestData) {
        const db = this.db;
        const roomId = requestData.roomData.roomId;
        const roomData = await db.querySingle("rooms", roomId, getRoom);
        const data = { roomData};

        if (requestData.userData.role == USER_TYPE.student) {
            const userRoomSchedule = await db.querySingle(
                "schedule", 
                { roomId, studentId: requestData.userId }, 
                getUserRoomSchedule
            );
            data.schedule = userRoomSchedule ? userRoomSchedule.position : null;
        } else {
            data.schedule = await db.querySingle("schedule", roomId, getScheduleByRoom);
        }

        return { data };
    }

    async getReqestData(req, getUserData = false) {
        const data = { roomData: req.body && Object.keys(req.body).length ? req.body : {} };
        const userId = req.auth && req.auth.id ? new ObjectId(req.auth.id) : null;
        data.userId = userId;

        if (userId && getUserData) {
            const userData =  await this.db.querySingle("users", userId, getUser);
            data.userData = userData;
        }

        const paramsRoomData = Object.entries(req.params)
            .reduce((acc, curr) => {
                const [ key, value ] = curr;
                acc[key] = DATABASE_ID_COLUMNS.indexOf(key) > -1 ? new ObjectId(value) : value;
                return acc;
            }, {});
        Object.assign(data.roomData, paramsRoomData);

        return data;
    }
}

export {
    RoomsController
}
