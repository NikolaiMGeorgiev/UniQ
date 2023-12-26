import { ObjectId } from "mongodb";
import { getRoom, editRoom, ROOM_STATUSES, ROOM_TYPES } from "../models/rooms-model.js";
import { getUserByToken } from "../models/users-model.js";
import { handleResponse } from "../helpers/reqest-helper.js";
import { 
    getRemainingScheduleByRoom, 
    markAsFinished, 
    updateStartTimeByRoom 
} from "../models/schedule-model.js";
import { 
    addToQueue, 
    addUserLink, 
    emptyQueueByRoom, 
    getRoomQueue, 
    removeFromRoomQueue 
} from "../models/queue-model.js";

class QueueController {

    constructor(db) {
        this.db = db;
    }

    async initEndpoints(app) {
        
        app.get('/status/:roomId', async (req, res) => {
            const roomId = new ObjectId(req.params.roomId);
            const data = await this.db.querySingle("queue", roomId, getRoomQueue);
            handleResponse(res, { data });
        });

        app.post('/queue', async (req, res) => {
            this.queueHandler(req, res, async (data) => {
                return await this.db.querySingle("queue", data, addToQueue);
            });
        });

        app.put('/room/next', async(req, res) => {
            await this.queueHandler(req, res, this.callNextInQueue, true);
        });

        app.put('/update', async (req, res) => {
            await this.queueHandler(req, res, this.updateStatus, true);
        });
    }

    async callNextInQueue(data) {
        const db = this.db;
        const roomId = data.roomId;
        const roomData = data.roomData;
        const userLinkData = {
            roomId, link: data.link
        };
        const queueData = await db.querySingle("queue", roomId, getRoomQueue);
        let nextStudent;
        let currentStudent;
        queueData.find((studentData, index) => {
            if (studentData.link) {
                currentStudent = studentData;
                nextStudent = index < queueData.length - 1 ? queueData[index + 1] : null;
                return true;
            }
            return false;
        });

        if (currentStudent) {
            const currentStudentData = {roomId, studentId: currentStudent.studentId};
            await db.querySingle("schedule", currentStudentData, markAsFinished);
            await db.querySingle("queue", currentStudentData, removeFromRoomQueue);
        } else {
            nextStudent = queueData[0];
        }
        if (!nextStudent) {
            return;
        }

        if (+roomData.type == ROOM_TYPES.normal) {
            userLinkData.studentId = nextStudent.studentId;
            await db.querySingle("queue", userLinkData, addUserLink);
        } else if (+roomData.type == ROOM_TYPES.scheduled) {
            let roomSchedule = await db.querySingle("schedule", roomId, getRemainingScheduleByRoom);
            const usersInQueue = queueData
                .map(userData => userData.studentId.toString());
            const nextStudentSchedule = roomSchedule
                .find(scheduleItem => usersInQueue.indexOf(scheduleItem.studentId.toString()) > -1);
            const timeOffset = new Date().getTime() - parseInt(nextStudentSchedule.startTime);
            userLinkData.studentId = nextStudentSchedule.studentId;

            await db.querySingle("schedule", { roomId, timeOffset }, updateStartTimeByRoom);
            await db.querySingle("queue", userLinkData, addUserLink);
        }
    }

    async updateStatus(data) {
        const roomData = data.roomData;
        const updateData = { 
            _id: data.roomId,
            status: data.status,
            lastUpdated: new Date().getTime()
        };
        const newRoomStatus = +data.status;

        const roomUpdateResult = await this.db.querySingle("rooms", updateData, editRoom);
        if (roomUpdateResult.status != 200) {
            return roomUpdateResult;
        }

        if (newRoomStatus === ROOM_STATUSES.inactive) {
            await this.db.querySingle("queue", data.roomId, emptyQueueByRoom);
        } else if (
            newRoomStatus === ROOM_STATUSES.active && 
            roomData.status == ROOM_STATUSES.break &&
            roomData.type == ROOM_TYPES.scheduled
        ) {
            const timeOffset = new Date().getTime() - parseInt(roomData.lastUpdated);
            await this.db.querySingle(
                "schedule", 
                { roomId: data.roomId, timeOffset }, 
                updateStartTimeByRoom
            );
        }
    }

    async queueHandler(req, res, cb, validateUser = false) {
        const data = req.body;
        const userToken = data.userToken;
        const userData = await this.db.querySingle("users", userToken, getUserByToken);
        let result = {};
        data.roomId = new ObjectId(data.roomId);
        data.userId = userData._id;
        data.userData = userData;

        if (!userData) {
            result = { status: 404, message: "No scuh user" };
        } else {
            try {
                if (validateUser) {
                    const roomData = await this.db.querySingle("rooms", data.roomId, getRoom);
                    data.roomData = roomData;
                    if (!roomData.creatorId.equals(userData._id)) {
                        handleResponse(res, { status: 403,  message: "Invalid operation" });
                        return;
                    }
                }
                await cb.apply(this, [data]);
            } catch (err) {
                console.error(err);
                result = { status: 500, message: "Server error" };
            }
        }

        handleResponse(res, result);
    }
}

export {
    QueueController
}