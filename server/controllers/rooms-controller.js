import { addRoom, editRoom, removeRoom, getRoomsById, getRoomsByTeacher, getRoom } from "../models/rooms-model.js";
import { USER_TYPE } from "../models/users-model.js";
import { 
    addToShcedule, 
    getScheduleByUser, 
    removeSchedulesForRoom, 
    getUserRoomSchedule, 
    getScheduleByRoom
} from "../models/schedule-model.js";
import { getReqestData, handleResponse } from "../helpers/reqest-helper.js";
import { ObjectId } from "mongodb";
import { QueueModel } from "../models/queue-model.js";

class RoomsController {
    
    constructor(db, socketHelper) {
        this.db = db;
        this.socketHelper = socketHelper;
        this.queueModel = new QueueModel(db);
    }

    async initEndpoints(app) {
        app.get('/api/rooms', async (req, res) => {
            const data = await getReqestData(this.db, req, true);
            const result = await this.getRoomsData(data);
            handleResponse(res, result);
        });

        app.get('/api/rooms/:roomId', async (req, res) => {
            const requestData = await getReqestData(this.db, req, true);
            let result = await this.getRoomData(requestData);

            if (!result.data || !result.data.roomData) {
                return handleResponse(res, result);
            }

            const resultData = result.data;
            const roomData = resultData.roomData;
            const isTeacher = data.userId.toString() == roomData.creatorId.toString();
            if (isTeacher) {
                const roomUpdateData = { 
                    _id: roomData._id, 
                    status: "started" 
                };
                if (roomData.status == "not-started") {
                    this.socketHelper.updateRoomStatus(roomData._id.toString(), "started");
                }
                roomData.status = "started";
                result = await this.db.querySingle("rooms", roomUpdateData, editRoom);
            } else {
                const queueData = {
                    roomId: roomData._id, 
                    studentId: requestData.userId
                };
                result = await this.queueModel.add(queueData);
            }
            // TODO: remove the if statement
            result.data = resultData;
            
            handleResponse(res, result);
        });
        
        app.post('/api/rooms', async (req, res) => {
            const requestData = await getReqestData(this.db, req);
            const roomData = requestData.data;
            const studentIds = roomData.students ? roomData.students.split(',') : [];
            roomData.creatorId = requestData.userId;

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
            const requestData = await getReqestData(this.db, req);
            const updatedRoomData = requestData.data;
            const roomId = new ObjectId(updatedRoomData.id);
            const roomData = await this.db.querySingle("rooms", roomId, getRoom);

            if (roomData.creatorId.toString() != requestData.userId.toString()) {
                return handleResponse(res, { status: 403, message: "Invalid operation" });
            }

            if (updatedRoomData.status && roomData.status == updatedRoomData.status) {
                console.log('update', roomData._id.toString(), updatedRoomData.status);
                this.socketHelper.updateRoomStatus(roomData._id.toString(), updatedRoomData.status);
            }

            updatedRoomData._id = roomId;
            const result = await this.db.querySingle("rooms", updatedRoomData, editRoom);
            handleResponse(res, result);
        });

        app.delete('/api/rooms/:id', async (req, res) => {
            const requestData = await getReqestData(this.db, req);
            const roomId = new ObjectId(requestData.data.id);
            const roomData = await this.db.querySingle("rooms", roomId, getRoom);

            if (roomData.creatorId.toString() != requestData.userId.toString()) {
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
        const roomId = requestData.data.roomId;
        const roomData = await this.db.querySingle("rooms", roomId, getRoom);
        const data = { roomData };
        
        if (requestData.userData.role == USER_TYPE.student) {
            data.schedule = await this.db.querySingle(
                "schedule", 
                { roomId, studentId: requestData.userId }, 
                getUserRoomSchedule
            );
        } else {
            const schedule = await this.db.querySingle("schedule", roomData, getScheduleByRoom);
            data.schedule = this.db.formatResult(schedule)
        }

        return { data };
    }
}

export {
    RoomsController
}
