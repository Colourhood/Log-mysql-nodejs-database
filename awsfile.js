var AWSS3 = require('aws-sdk/clients/s3');
const untildify = require('untildify');
const credentialPath = untildify('~/.aws/credentials.json');
const credentials = require(credentialPath);

const { aws_access_key_id, aws_secret_access_key } = credentials;

var s3 = new AWSS3({
    region: 'us-west-2', 
    s3: '2006-03-01',
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
    params: { Bucket: 'logmessenger' }
});

s3.listObjects((error, data) => {
    if (error) {
        console.log(`There was an error: ${error}`);
    } else {
        console.log(`Succesful data fetch: ${JSON.stringify(data)}`);
    }
})

module.exports = s3;