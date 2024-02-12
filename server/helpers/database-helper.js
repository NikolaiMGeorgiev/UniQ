import { CONNECTION_STRING, DATABASE_NAME } from "../../config.js";
import { MongoClient, ServerApiVersion } from 'mongodb';

class DatabaseHelper {
    constructor() {
        this.client = new MongoClient(CONNECTION_STRING, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
        });
    }

    async querySingle(collectionName, data, callback) {
        try {
          await this.client.connect();
          const database = this.client.db(DATABASE_NAME);
          const collection = database.collection(collectionName);
          const callbackResult = await callback(collection, data);
          return callbackResult;
        } finally {
          await this.client.close();
        }
    }

    // async queryJoin(collectionName, match, joinBy) {
    //   try {
    //     await this.client.connect();
    //     const database = this.client.db(DATABASE_NAME);
    //     const collection = database.collection(collectionName);
    //     return await collection.aggregate([
    //       { $match: match },
    //       { $lookup: joinBy }
    //     ]).toArray();
    //   } finally {
    //     await this.client.close();
    //   }
    // }

    // async queryMutliple(data, callbacks) {
    //     try {
    //         await this.client.connect();
    //         const database = this.client.db(DATABASE_NAME);
    //         for (let i in callbacks) {
    //             let callback = callbacks[i];
    //             let callbackData = data[i];
    //             await callback(database, callbackData);
    //         }
    //       } finally {
    //         await this.client.close();
    //       }
    // }
}

export { DatabaseHelper };