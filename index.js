const dns = require('dns');
const fs = require('fs');
const checkEmails = require('./src/smtp_connection');
const generateEmails = require('./src/emails_generate');
require('dotenv').config();

let tld = ['com','uk'];


