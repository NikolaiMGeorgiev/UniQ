export class QueueModel {
    constructor(db) {
        this.db = db;
    }

    async add(data) {
        return await this.updateQueue(data, { entryTime: new Date().getTime() });
    }

    async remove(data) {
        return await this.updateQueue(data, { entryTime: null });
    }

    async next(data) {
        return await this.updateQueue(data, { link: data.link });
    }

    async finished(data) {
        return await this.updateQueue(data, { finished: 1, link: null });
    }

    async updateQueue(data, newData) {
        return await this.db.querySingle("schedule", data, async (collection) => {
            const { roomId, studentId } = data;
            const result =  await collection.updateOne(
                { room_id: roomId, studentId },
                { $set: newData }
            );
            return result && result.matchedCount === 1 ? { status: 200 } : { status: 404, message: "No such student found" };
        });
    }
}