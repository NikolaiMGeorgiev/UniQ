const MONGO_PASSWORD = "aysB6eO4OsGX0jBf";
const MONGO_USER = "admin";
const CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@uniq.aianeda.mongodb.net/?retryWrites=true&w=majority`;
const DATABASE_NAME = "uniq";
const SERVER_URL = "http://localhost:8080";
const JWT_SECRET = "sdfo238cgb320hdfgv87t68t3gr";
const DATABASE_ID_COLUMNS = ["userId", "roomId"];

export {
    CONNECTION_STRING,
    DATABASE_NAME,
    SERVER_URL,
    JWT_SECRET,
    DATABASE_ID_COLUMNS
};