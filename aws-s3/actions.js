const S3 = require('aws-s3/config');
const keys = require('aws-s3/keys');

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
	return S3.getObject({ Key: predef+key }).promise().then((object) => {
		return Promise.resolve({ success: true, object: object.Body.toString('base64') });
	}).catch((error) => {
		return Promise.resolve({ success: false, errorMessage: error.message });
	});
}

function getProfileImage(user_email) {
	return S3.getObject({ Key: keys.pImage+user_email }).promise().then((object) => {
		//console.log(object);
		return Promise.resolve({ image: object.Body.toString('base64') });
	}).catch((error) => {
		console.log('Error fetching object from bucket: '+error);
		return Promise.resolve({ error: error.message });
	});
}

module.exports = { listAllObjects, getObject, getProfileImage };
