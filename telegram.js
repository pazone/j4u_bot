const { Telegraf } = require('telegraf')

const chatId = 149732957
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.launch()

const toMessage = (job) => {
    return `[${job.position}](${job.link || job.notionUrl})
    Місце: ${job.country}   ${job.city}
    Компанія: [${job.company}](${job.website})`
}

module.exports.publishToChannel = (jobs) => {
    jobs.map(toMessage).forEach((msg) => {
        bot.telegram.sendMessage(chatId, msg, {
            parse_mode: 'markdown',
            disable_web_page_preview: true
        })
    })      
}

process.once('SIGINT', () => {
    bot.stop('SIGINT')
})

process.once('SIGTERM', () => {
    bot.stop('SIGTERM') 
})

