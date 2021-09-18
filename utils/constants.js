require('dotenv').config();
exports.port = process.env.APPLICATION_PORT;
exports.mongoURI = process.env.MONGO_URI;
exports.md5Secret = process.env.MD_5_SECRET;
exports.monthMapString = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "July", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" };
exports.monthMapNum = { 1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06", 7: "07", 8: "08", 9: "09", 10: "10", 11: "11", 12: "12" };