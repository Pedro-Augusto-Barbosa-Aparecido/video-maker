const readLine = require('readline-sync')
const state = require('../save-robot/save-robot')

function robotInput() {
    const content = {
        maximumSentences: 7,
    } 
    
    content.searchTerm = askAndReturnSearchTerm().replace(/\s/g, '')
    content.prefix = askAndReturnPrefix()
    state.save(content)
    
    function askAndReturnSearchTerm() {
        return readLine.question('Type a term to search on wikipedia: ')
    }
    
    function askAndReturnPrefix(searchTerm) {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefix = prefixes[readLine.keyInSelect(prefixes, 'Choose your prefix to ' + searchTerm + ': ')]
    
        return selectedPrefix
    }

}

module.exports = robotInput