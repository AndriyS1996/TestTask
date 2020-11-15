

function generateEmails(name, surname, domain, numberOfEmails){
    let result = new Set();
    let specialСharacters = ['!', '~', '#', '|', '&', '.', '-', '_', ''];
    while (result.size < numberOfEmails){
        let rname = getRandomInt(0, 4) ? name : ''; // email with name or without (1/4 probability that email will not have a name)
        let rsurname = rname ? [surname, surname.slice(0, 1), ''][getRandomInt(0, 3)] : surname; // generate surname
        let specialChar = rname && rsurname ? specialСharacters[Math.floor(Math.sqrt(Math.random() * 81))] : ''; // select the special symbol using function rule sqrt(x)
        let rnumber = getRandomInt(0, 4) ? getRandomInt(1, 100) : ''; // add random number to email (in 3/4 probability number will be added)
        result.add(rname + specialChar + rsurname + rnumber + '@' + domain)
    }
    function getRandomInt(minInt, maxInt) {
        return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
    }
    return Array.from(result)
}

module.exports = generateEmails;