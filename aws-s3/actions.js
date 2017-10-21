const S3 = require('aws-s3/config');
const keys = require('aws-s3/keys');
const ext = require('aws-s3/extensions');

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
        //console.log(object);
        return new Promise((resolve, reject) => {
            resolve({ success: true, object: object.Body.toString('base64') });
        });
    }).catch((error) => {
        return new Promise((resolve, reject) => {
            resolve({ success: false, errorMessage: error.message });
        });
    });
}

function getProfileImage(username) {
    return S3.getObject({ Key: keys.pImage+username+ext.PNG }).promise().then((object) => {
        //console.log(object);
        return new Promise((resolve, reject) => {
            resolve({ success: true, image: object.Body.toString('base64') });
        });
    }).catch((error) => {
        return new Promise((resolve, reject) => {
            resolve({ success: false, errorMessage: error.message });
        });
    });
}

module.exports = { listAllObjects, getObject, getProfileImage };
