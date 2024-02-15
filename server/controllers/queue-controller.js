import { ObjectId } from "mongodb";
import { editRoom, getRoom } from "../models/rooms-model.js";
import { getReqestData, getRoomData, handleResponse } from "../helpers/reqest-helper.js";
import { QueueModel } from "../models/queue-model.js";
import { getScheduleByRoom } from "../models/schedule-model.js";
import { DatabaseHelper } from "../helpers/database-helper.js";
import { getUser } from "../models/users-model.js";

class QueueController {

    constructor(socketHelper) {
        this.db = new DatabaseHelper();
        this.socketHelper = socketHelper;
        this.queueModel = new QueueModel(this.db);
    }

    async initEndpoints(app) {
        app.post('/api/queue/next/:id', async(req, res) => {
            try {
                const requestData = await getReqestData(this.db, req);
                const roomId = new ObjectId(requestData.data.id);
                const roomData = await this.db.querySingle("rooms", roomId, getRoom);

                if (!requestData.data.link || roomData.creatorId.toString() != requestData.userId.toString()) {
                    return handleResponse(res, { status: 403, message: "Invalid operation" });
                }

                const schedule = await this.db.querySingle("schedule", roomData, getScheduleByRoom);
                const currentStudent = schedule.find(student => student.link);
                const nextStudent = schedule.find(student => {
                    return (!currentStudent || student.studentId.toString() != currentStudent.studentId.toString()) && 
                        !parseInt(student.finished) && 
                        student.entryTime
                    }
                );

                if (currentStudent) {
                    const result = await this.queueModel.finished({ roomId, studentId: currentStudent.studentId });
                    if (result.status != 200) {
                        return handleResponse(res, result);
                    }
                }

                if (!nextStudent) {
                    return handleResponse(res, { status: 404, message: "Queue is empty" });
                }

                const userData = await this.db.querySingle("users", nextStudent.studentId, getUser);
                const result = await this.queueModel.next(
                    { roomId, studentId: nextStudent.studentId, link: requestData.data.link }
                );
                if (result && result.status == 200) {
                    this.socketHelper.sendResource(
                        { roomId, token: userData.token, link: requestData.data.link }
                    );
                }
                handleResponse(res, result);
            } catch (error) {
                console.error(error);
                handleResponse(res, { status: 500, message: "Internal server error" });
            }
        });

        app.get('/api/queue/:roomId', async (req, res) => {
            const requestData = await getReqestData(this.db, req, true);
            const roomAndScheduleResult = await getRoomData(this.db, requestData);

            if (!roomAndScheduleResult.data || !roomAndScheduleResult.data.roomData) {
                return handleResponse(res, result);
            }

            const resultData = roomAndScheduleResult.data;
            const roomData = resultData.roomData;
            const isTeacher = requestData.userId.toString() == roomData.creatorId.toString();

            if (new Date(roomData.startTime).getTime() > new Date().getTime()) {
                return handleResponse(res, {status: 406, message: "Start time not reached"});
            }

            let result;
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
            if (result && result.status == 200) {
                result.data = resultData;
            }
            
            handleResponse(res, result);
        });
    }
}

export {
    QueueController
}