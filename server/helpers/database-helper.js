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

    formatResult(data) {
      if (data._id) {
        return formatId(data);
      }
      if (data.length) {
        return data.map(item => {
          return formatId(item);
        });
      }
      return data;

      function formatId(item) {
        return Object.keys(item).reduce((acc, key) => {
          if (key === "_id") {
            acc.id = item[key].toString();
          } else {
            acc[key] = item[key];
          }
          return acc;
        }, {});
      }
    }
}

export { DatabaseHelper };