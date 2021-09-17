require('dotenv').config();
exports.port = process.env.APPLICATION_PORT;
exports.mongoURI = process.env.MONGO_URI;
exports.md5Secret = process.env.MD_5_SECRET;
