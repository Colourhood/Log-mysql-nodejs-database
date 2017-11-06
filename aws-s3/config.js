const AWSS3 = require('aws-sdk/clients/s3');
const untildify = require('untildify');
const credentialPath = untildify('~/.aws/credentials.json');
const credentials = require(credentialPath);

const { aws_access_key_id, aws_secret_access_key } = credentials;

const S3 = new AWSS3({
	region: 'us-west-2', 
	s3: '2006-03-01',
	accessKeyId: aws_access_key_id,
	secretAccessKey: aws_secret_access_key,
	params: { Bucket: 'logmessenger' }
});

module.exports = S3;