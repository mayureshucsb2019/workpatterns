const { fetchEmailReplyTimes } = require("../utils/utils");

const getEmailReplyTimeForUser = async function (req, res) {
    console.log("Request received in getEmailReplyTimeForUser");
    res.status(200).send({ status: 200, message: fetchEmailReplyTimes() });
}

exports.getEmailReplyTimeForUser = getEmailReplyTimeForUser;