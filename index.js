const dns = require('dns');
const fs = require('fs');
const checkEmails = require('./src/smtp_connection');
let generateEmails = require('./src/emails_generate');

let tld = ['com','uk'];

