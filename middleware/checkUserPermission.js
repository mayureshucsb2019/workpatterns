// middleware to capture user permission after fetch user data 
// const Profile = require('../sz-db-models/userProfileSchema');
/*
    Permission Numbers is an array of numbers
*/

/*
const checkUserPermission = function (permissionNumbers) {
    console.log("Fetch User Permission hit");
    return async (req, res, next) => {
        const email = req.email;
        Profile.findOne({ email: email })
            .then(userProfile => {
                console.log("User profile is:", userProfile);
                const allowedPermission = userProfile.permissions;
                // if sought permissions are present then go to next
                for (let i = 0; i < permissionNumbers.length; i++) {
                    if (allowedPermission.indexOf(permissionNumbers[i]) == -1) {
                        return res.status(403).send({ status: 403, message: 'You do not have the required permission. Please contact the Blockchain administrator.' });
                    }
                };
                next();
            }).catch(err => {
                console.log("Error is: ", err);
                return res.status(403).send({ status: 403, message: 'Error retrieving your permission. Please contact the Blockchain administrator.' });
            })
    }
}

exports.checkUserPermission = checkUserPermission;
*/