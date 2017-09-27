const S3 = require('aws-s3/config');

function listAllObjects() {
    S3.listObjects((error, data) => {
        if (error) {
            console.log(`There was an error: ${error}`);
        } else {
            console.log(`Succesful data fetch: ${JSON.stringify(data)}`);
        }
    });
}

function getObject(predef, key, ext) {
    return S3.getObject({ Key: predef+key+ext }).promise().then((object) => {
        console.log(object);
        const { Body } = object;
        return new Promise((resolve, reject) => {
            resolve({ success: true, image: Body });
        });
    }).catch((error) => {
        return new Promise((resolve, reject) => {
            resolve({ success: false, message: error.message });
        });
    });
}

module.exports = { listAllObjects, getObject };
