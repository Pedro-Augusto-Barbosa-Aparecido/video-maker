const readLine = require('readline-sync')
const robots = {
    robotText: require('./robots/text-robot/robot-text'),
}

async function start() {

    const content = {
        maximumSentences: 7,
    } 

    content.searchTerm = askAndReturnSearchTerm().replace(/\s/g, '')
    console.log(content.searchTerm)

    content.prefix = askAndReturnPrefix()

    await robots.robotText(content)

    function askAndReturnSearchTerm() {
        return readLine.question('Type a term to search on wikipedia: ')
    }

    function askAndReturnPrefix(searchTerm) {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefix = prefixes[readLine.keyInSelect(prefixes, 'Choose your prefix to ' + searchTerm + ': ')]

        return selectedPrefix
    }

    console.log(JSON.stringify(content, null, 4))

}

start()
