const robots = {
    robotText: require('./robots/text-robot/robot-text'),
    robotInput: require('./robots/input-robot/input-robot'),
    robotSave: require('./robots/save-robot/save-robot'),
    robotImage: require('./robots/images-robot/image-robot'),
}

async function start() {
    //robots.robotInput()
    //await robots.robotText()
    await robots.robotImage()

    const content = robots.robotSave.load()
    console.dir(content, { depth: null })

}

start()
