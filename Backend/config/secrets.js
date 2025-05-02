const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

let cache = null;


const client = new SecretsManagerClient({  region: process.env.REGION });

async function getSecretValue(name) {
  const command = new GetSecretValueCommand({ SecretId: name });
  const data = await client.send(command);
  const secretString = data.SecretString ?? Buffer.from(data.SecretBinary, 'base64').toString('ascii');
  return JSON.parse(secretString);
}

async function loadSecrets() {
  if (cache) return cache;
  
  const secretName = process.env.SECRET_NAME; // כאן אנחנו שולפים את שם הסוד מתוך משתני סביבה (במקום קוד סטטי)
  cache = await getSecretValue(secretName);
  return cache;
}

module.exports = { loadSecrets };
