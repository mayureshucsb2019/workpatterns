const { md5Secret } = require("../utils/constants");
const MessageSchema = require("../models/messageSchema");
const EmailResponseTimeSchema = require("../models/emailResponseTimeSchema");
const fs = require("fs");
const crypto = require("crypto");

const domainTimeStampMap = {};

const sleep = function (msec) {
    return new Promise(resolve => setTimeout(resolve, msec * 1000));
}

const sortByAbsoluteValue = function (numbers) {
    numbers.sort(function (a, b) {
        return Math.abs(a) - Math.abs(b);
    })
    return numbers
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

const buildKeyValueStore = async function (userEmail) {
    // console.log("USER: ", userEmail);
    let fileContent = JSON.parse(fs.readFileSync("./emails_aug_4.json"));
    let receivers = [];
    let sender = "";
    let time = 0;
    for (let i = 0; i < fileContent.length; i++) {
        // console.log(fileContent[i])
        // get the list of addresses
        addresses = fileContent[i].addresses;
        // there is only one sender, that is what I am assuming here unless changed
        sender = "";
        // can be multiple receivers, unless something changes
        receivers = [];
        // get the time stamp
        time = fileContent[i].time;
        // Extract the receivers and the sender
        addresses.forEach(person => {
            if (person.role == "sender") {
                sender = person.address;
            } else {
                receivers.push(person.address);
            }
        });
        // console.log(`SENDER: ${sender} :: RECEIVERS: ${receivers}`);
        // if sender is the user in question then push the time stamp value 
        // store the timestamp value only once for the organisation map.. use set
        if (sender == userEmail) {
            // console.log("Sender is USER.")
            receivers.forEach(receiver => {
                receiver = receiver.split("@")[1];
                // if (receiver == "company_3646739100.com") {
                //     console.log(`receiver--> ${time}`)
                // }
                // console.log(`${i}: USER --> ${receiver}`);
                if (domainTimeStampMap.hasOwnProperty(receiver)) {
                    domainTimeStampMap[receiver].add(time);
                } else {
                    domainTimeStampMap[receiver] = new Set([time]);
                }
            })
        } else {
            // other party is sender and user is one of the receiver, then it interacts with all org
            let senderIndex = receivers.indexOf(userEmail);
            if (senderIndex != -1) {
                // console.log("Receiver is USER.")
                // console.log(`${i}: ${sender} --> USER`);
                sender = sender.split("@")[1];
                // if (sender == "company_3646739100.com") {
                //     console.log(`sender--> ${time}`)
                // }
                if (domainTimeStampMap.hasOwnProperty(sender)) {
                    domainTimeStampMap[sender].add(-time);
                } else {
                    domainTimeStampMap[sender] = new Set([-time]);
                }
                receivers.forEach(receiver => {
                    if (receiver != userEmail) {
                        receiver = receiver.split("@")[1];
                        // if (receiver == "company_3646739100.com") {
                        //     console.log(`sender<-->receiver ${time}`)
                        // }
                        // console.log(`${i}: USER --> ${receiver}`);
                        if (domainTimeStampMap.hasOwnProperty(receiver)) {
                            domainTimeStampMap[receiver].add(-time);
                        } else {
                            domainTimeStampMap[receiver] = new Set([-time]);
                        }
                    }
                })
            }
        }
    }
    console.log(Object.keys(domainTimeStampMap).length);
    const domainTimeStampMapObj = [];
    // write the parsed data to the file to be processed by schema for multiple entry input
    for (let [key, value] of Object.entries(domainTimeStampMap)) {
        domainTimeStampMapObj.push({ key: key, times: [...value] })
    }
    fs.writeFileSync("./emailTimeStampArrayObj.json", JSON.stringify(domainTimeStampMapObj));
    // console.log(senders_map, "\n", Object.keys(senders_map), Object.keys(senders_map).length)
}

// buildKeyValueStore("noah@workpatterns.ai")

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
    const fileContent = JSON.parse(fs.readFileSync("./emailTimeStampArrayObj.json"));
    console.log(fileContent);
}

fetchEmailReplyTimes();

exports.storeKeyValueToDb = storeKeyValueToDb;
exports.buildKeyValueStore = buildKeyValueStore;
exports.storeJsonToDb = storeJsonToDb;
exports.sortByAbsoluteValue = sortByAbsoluteValue;
exports.sleep = sleep;