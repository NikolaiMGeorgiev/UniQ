import { ObjectId } from "mongodb";
import { getRoom } from "../models/rooms-model.js";
import { getReqestData, handleResponse } from "../helpers/reqest-helper.js";
import { QueueModel } from "../models/queue-model.js";

class QueueController {

    constructor(db, socketHelper) {
        this.db = db;
        this.socketHelper = socketHelper;
        this.queueModel = new QueueModel(db);
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
                const nextStudent = schedule.find(student => 
                    (!currentStudent || student.studentId.toString() != currentStudent.studentId.toString()) && 
                    !parseInt(student.finished) && 
                    student.entryTime
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

                const resourceData = { roomId, studentId: nextStudent.studentId, link: requestData.data.link }
                const result = await this.queueModel.next(resourceData);
                if (result && result.status == 200) {
                    this.socketHelper.sendResource(resourceData);
                }
                handleResponse(res, result);
            } catch (error) {
                console.error(error);
                handleResponse(res, { status: 500, message: "Internal server error" });
            }
        });
    }
}

export {
    QueueController
}