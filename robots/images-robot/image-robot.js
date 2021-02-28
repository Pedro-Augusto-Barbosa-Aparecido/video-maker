const state = require('../save-robot/save-robot')
const googleSearchCredentials = require('../../src/credentials/apiKey_google_cloud.json')

const google = require('googleapis').google
const customSearch = google.customsearch('v1')

async function robotImage() {
    const content = state.load()

    const response = await customSearch.cse.list({
        auth: googleSearchCredentials.apiKey,
        cx: googleSearchCredentials.searchEngine,
        q: 'Paul Walker',
        num: 2
    })

    console.dir(response, { depth: null })
    process.exit(0)
}

module.exports = robotImage