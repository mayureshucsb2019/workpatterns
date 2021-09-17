const { md5Secret } = require("../utils/constants");
const MessageSchema = require("../models/messageSchema");
const EmailResponseTimeSchema = require("../models/emailResponseTimeSchema");
const fs = require("fs");
const crypto = require("crypto");

const emailTimeStampMap = {};
const emailTimeStampArrayObj = [];

const sleep = function (msec) {
    return new Promise(resolve => setTimeout(resolve, msec * 1000));
}

const storeJsonToDb = function () {
    fileContent = JSON.parse(fs.readFileSync("./emails_aug_4.json"));
    console.log(fileContent[0]);
    console.log(fileContent.length);
    MessageSchema.insertMany(fileContent, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
        }
    });
}

const buildKeyValueStore = async function () {
    let fileContent = JSON.parse(fs.readFileSync("./emails_aug_4.json"));
    let receivers = [];
    let sender = "";
    let time = 0;
    let hash_of_string = "";
    let senders_map = {};
    for (let i = 0; i < fileContent.length; i++) {
        // get the list of addresses
        addresses = fileContent[i].addresses;
        // there is only one sender, that is what I am assuming here unless changed
        sender = "";
        // can be multiple receivers, unless something changes
        receivers = [];
        // get the time stamp
        time = fileContent[i].time;
        // Extract the receivers and the senders
        addresses.forEach(person => {
            if (person.role == "sender") {
                sender = person.address;
                if(!senders_map.hasOwnProperty(sender)){
                    senders_map[sender] = 1
                }else{
                    senders_map[sender] +=1
                }
            } else {
                receivers.push(person.address);
            }
        });
        // make hash(sender_receiver) map for all times
        receivers.forEach(receiver => {
            string_to_hash = sender + receiver
            console.log("-->", string_to_hash)
            // hash the string
            const md5Hasher = crypto.createHmac("md5", md5Secret);
            hash_of_string = md5Hasher.update(string_to_hash).digest("hex");
            // console.log("Hash and string:", hash_of_string)
            if (emailTimeStampMap.hasOwnProperty(hash_of_string)) {
                // console.log("Map value for ", hash_of_string, emailTimeStampMap[hash_of_string])
                emailTimeStampMap[hash_of_string].push(time)
            } else {
                emailTimeStampMap[hash_of_string] = [time];
            }
        })
    }

    // write the parsed data to the file to be processed by schema for multiple entry input
    for (let [key, value] of Object.entries(emailTimeStampMap)) {
        emailTimeStampArrayObj.push({ key: key, times: value })
    }
    fs.writeFileSync("./emailTimeStampArrayObj.json", JSON.stringify(emailTimeStampArrayObj));
    console.log(senders_map, "\n", Object.keys(senders_map),Object.keys(senders_map).length)
}

const buildOrgResponseTimeMap = async function(){
    
}

const storeKeyValueToDb = function () {
    // insert the values into the database
    const fileContent = JSON.parse(fs.readFileSync("./emailTimeStampArrayObj.json"));
    EmailResponseTimeSchema.insertMany(fileContent, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
        }
    });
}

const fetchEmailReplyTimes = function (emailId) {

}

exports.storeKeyValueToDb = storeKeyValueToDb;
exports.buildKeyValueStore = buildKeyValueStore;
exports.storeJsonToDb = storeJsonToDb;
exports.sleep = sleep;