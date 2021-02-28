const robots = {
    robotText: require('./robots/text-robot/robot-text'),
    robotInput: require('./robots/input-robot/input-robot'),
    robotSave: require('./robots/save-robot/save-robot'),
}

async function start() {
    robots.robotInput()
    await robots.robotText()

    const content = robots.robotSave.load()
    console.dir(content, { depth: null })

}

start()
