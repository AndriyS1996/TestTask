const dns = require('dns');
const fs = require('fs');
const checkEmails = require('./src/smtp_connection');
const generateEmails = require('./src/emails_generate');
require('dotenv').config();

let tld = ['com','uk'];

fs.readFile('./src/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err.message);
        return
    }
    let emailData = data.split(',');
    tld.forEach((d) => {
        let domain = `${emailData[2]}.${d}`;
        //MX DNS lookup
        dns.resolveMx(domain, (err, addresses) => {
            if (err) {
                console.log(err.message + ' in resolveMx');
                return
            };
            // generate process.env.NUNBER_EMAILS random emails
            let emails = generateEmails(emailData[0], emailData[1], domain, process.env.NUMBER_EMAILS);
            // checks emails and writes down available emails in src/output.txt
            checkEmails(emails, addresses[0].exchange);
        });
    });
})

