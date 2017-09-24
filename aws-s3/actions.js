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

function getObject(predef, key) {
    return S3.getObject({ Key: predef+key }).promise().then((data) => {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }).catch((error) => {
        return new Promise((resolve, reject) => {
            reject(error.message);
        });
    });
}

module.exports = { listAllObjects, getObject };
