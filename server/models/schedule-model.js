import { ObjectId } from "mongodb";

async function getScheduleByUser(collection, userId) {
    return await collection.find({ studentId: userId }).toArray();   
}

async function getScheduleByRoom(collection, roomId) {
    return await collection.find({ room_id: roomId }).toArray();
}

async function getStudentSchedulePosition(collection, data) {
    const { studentId, roomId } = data;
    const roomSchedule = await getScheduleByRoom(collection, roomId);
    roomSchedule.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
    });
    return roomSchedule.findIndex(schedule => schedule.studentId.toString() == studentId);
}

async function getRemainingScheduleByRoom(collection, roomId) {
    return await collection.find({ room_id: roomId, finished: 0 }).toArray();
}


async function getUserRoomSchedule(collection, data) {
    return await collection.findOne({ room_id: data.roomId, studentId: data.studentId });
}

async function addToShcedule(collection, roomData) {
    let scheduleData = [];
    const students = roomData.students;
    for (let position in students) {
        const student = students[position];
        scheduleData.push({
            room_id: roomData._id,
            studentId: new ObjectId(student),
            position: position,
            finished: 0
        });
    }
    return await collection.insertMany(scheduleData);
}

async function markAsFinished(collection, data) {
    return await collection.updateOne(
        { room_id: data.roomId, studentId: data.studentId },
        { $set: { finished: 1 } }
    );
}

async function removeSchedulesForRoom(collection, roomId) {
    return await collection.deleteMany({ room_id: roomId });
}

async function updateStartTimeByRoom(collection, data) {
    return await collection.updateMany(
        { room_id: data.roomId },
        { $inc: { startTime: data.timeOffset } }
    );
}

export {
    addToShcedule,
    getScheduleByUser,
    removeSchedulesForRoom,
    getScheduleByRoom,
    updateStartTimeByRoom,
    getUserRoomSchedule,
    markAsFinished,
    getRemainingScheduleByRoom,
    getStudentSchedulePosition
}