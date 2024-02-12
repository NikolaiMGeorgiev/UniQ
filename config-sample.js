const MONGO_PASSWORD = "";
const MONGO_USER = "";
const CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@uniq.aianeda.mongodb.net/?retryWrites=true&w=majority`;
const DATABASE_NAME = "uniq";

export {
    CONNECTION_STRING,
    DATABASE_NAME
};