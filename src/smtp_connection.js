const net = require('net');
const fs = require('fs');

function checkEmails(emails, smtpHost){
    let conn = net.createConnection(25, smtpHost);
    let i = 0; //emails counter
    let j = 0;// comands counter
    conn.setEncoding('ascii');
    //set timeout inactivity on the socket
    conn.setTimeout(10000, () => {
        conn.end();
        conn.destroy();
    });
    // handle connect event
    conn.on('connect', () => {
        console.log('connected');
        conn.on('close', (err) => {
            if (err) {
                console.log('transmission error')
            } else {
                console.log('socket is closed')
            }
        });
        conn.on('error', () => {
            console.log(err.message);
        })
        //in case of an unrecognisable response
        conn.on('undetermined', (data) => {
            console.log('unrecognisable response');
            console.log(data);
            conn.end();
            conn.destroy();
        });
    });
    conn.on('data', (data) => {
        if (data.indexOf('220') === 0 && (j === 0)) {
            conn.write('EHLO ' + smtpHost);
            conn.write('\r\n');
            j++;
            return
        } else if (j === 0){
            conn.emit('undetermined', data)
        };
        // check if command "EHLO smtphost" was successful and then sends "mail from: <' + emails[0] + '>'"
        if (data.indexOf('250') === 0 && j === 1){
            conn.write('mail from: <' + emails[0] + '>');
            conn.write('\r\n');
            j++;
            return
        }  else if (j === 1){
            conn.emit('undetermined', data)
        };
        //check if command "in mail from" was successful and then sends first command"rcpt to: <' + emails[i] + '>'"
        if (j === 2 && data.indexOf('250') === 0) {
            conn.write('rcpt to:<' + emails[i] + '>');
            conn.write('\r\n');
            i++;
            j++;
            return
        } else if (j === 2 && (data.indexOf('550') === 0 ||  data.indexOf('553') === 0)){
            console.log("bad comand 'mail from: < + emails[0] + >' or email");
            conn.end();
            conn.destroy();
            return
        } else if (j === 2){
            conn.emit('undetermined', data);
        }
        // sends commands "rcpt to: <' + emails[i] + '>' to check for emails
        if ((data.indexOf('250') === 0 || data.indexOf('\n250') != -1) && (i <= emails.length) && (j >= 3)){
            if (i >= emails.length){
                conn.end();
                conn.destroy();
                return
            }
            conn.write('rcpt to:<' + emails[i] + '>');
            conn.write('\r\n');
            i++;
            return;
            //handle response if no such email
        } else if (data.indexOf('550') === 0 || data.indexOf('553') === 0 || data.indexOf('\n550') != -1){
            fs.appendFile(__dirname + '/output.txt', emails[i - 1] + '\n', (err) => {
                if (err) console.log(err.message);
            });
            conn.write('rcpt to:<' + emails[i] + '>');
            conn.write('\r\n');
            if (i >= emails.length){
                conn.end();
                conn.destroy();
                return
            }
            i++;
            return
        } else if ((i <= emails.length) && (j >= 3)) {
            conn.emit('undetermined', data)
        }
    });
}

module.exports = checkEmails;
