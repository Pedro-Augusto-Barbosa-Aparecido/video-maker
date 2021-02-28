const algorithmia = require('algorithmia')
const apikey = require('../../src/api/keys.json').apiKey

async function robotText(content){
    await fetchContentFromWikipedia(content)
    await sanitizeContent(content)
    //breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content){
        try {
            const algorithmiaAlthenticated = algorithmia(apikey)
            const wikipediaAlgorithm = algorithmiaAlthenticated.algo('web/WikipediaParser/0.1.2')
            const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
            const wikipediaContent = wikipediaResponse.get()
            
            content.sourceContentOriginal = wikipediaContent.content

        } catch {
            console.log("ERRR")
        }

    }

    async function sanitizeContent(content){
        const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(content.sourceContentOriginal)
        const withoutDateInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkDown)
        console.log(withoutDateInParentheses)

        function removeBlankLinesAndMarkDown(text){
            const allLines = text.split('\n')

            const _withoutBlankLinesAndMarkDown = allLines.filter(line => {
                if (line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }

                return true
            })

            return _withoutBlankLinesAndMarkDown.join(' ')
        }

        //function removeMarkdown(lines){
        //    const withoutMarkdown = lines.filter(line => {
        //        if (line.trim().startsWith('=')){
        //            return false
        //        }
        //
        //        return true
        //    })
        //
        //    return withoutMarkdown
        //}

        function removeDatesInParentheses(text){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }
    }

}

module.exports = robotText
