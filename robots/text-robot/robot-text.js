const apikey = require('../../src/api/keys.json').apiKey
const watsonApiKey = require('../../src/api/keys_watson.json').apikey

const algorithmia = require('algorithmia')
const sentenceBoundaryDeteciton = require('sbd')

const NaturalLanguageUnderstadingV1 = require('watson-developer-cloud/natural-language-understanding/v1')

var nlu = new NaturalLanguageUnderstadingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
})

//nlu.analyze({
//    text: `Hi I'm Michael Jackson and I love music`,
//    features: {
//        keywords: {}
//    }
//}, (error, response) => {
//    if (error){
//        throw error
//    }
//
//    console.log(JSON.stringify(response, null, 4))
//    process.exit(0)
//})

async function robotText(content){
    await fetchContentFromWikipedia(content)
    await sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)

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
       
        content.sourceContentOriginaSanitized = withoutDateInParentheses

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

    function breakContentIntoSentences(content){
        const sentences = sentenceBoundaryDeteciton.sentences(content.sourceContentOriginaSanitized)
        
        content.sentences = []

        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: [],
            })
        })

    }

    function limitMaximumSentences(content){
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchKeywordsOfAllSentences(content){
        for (const sentence of content.sentences){
            sentence.keywords = await fecthWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function fecthWatsonAndReturnKeywords(sentence){
        return new Promise((resolve, reject) => {
            nlu.analyze({
            text: sentence,
            features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error){
                    throw error
                }
    
                const Keywords = response.keywords.map(keywords => {
                    return keywords.text
                })
    
                resolve(Keywords)
            })
        })
    }

}

module.exports = robotText
