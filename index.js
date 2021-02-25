const readLine = require('readline-sync')

function start() {
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm() {
        return readLine.question('Type a term to search on wikipedia: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefix = prefixes[readLine.keyInSelect(prefixes, 'Choose your prefix: ')]

        return selectedPrefix
    }

    console.log(content)
}

start()