const { Client } = require("@notionhq/client")

const notion = new Client({
    auth: process.env.NOTION_TOKEN
})

const names = {
    link: 'Link to the position/ Посилання на позицію / Ссылка на предложение',
    email: 'Email/ Эл. адрес',
    city: 'City/ Місто / Город',
    country: 'Country / Країна / Страна',
    site: 'Website/ Веб-сайт',
    position: 'Position title/ Назва посади / Название должности'
}

const simplify = (row) => {
    var jobUrl = new URL(row.url)
    jobUrl.hostname = 'uaworks.org'
    
    return {
        id: row.id,
        notionUrl: jobUrl.href,
        link: row.properties[names.link]?.url,
        email: row.properties[names.email]?.email,
        city: row.properties[names.city]?.rich_text[0]?.text?.content,
        company: row.properties[names.company]?.rich_text[0]?.text?.content,
        country: row.properties[names.country]?.multi_select.map((e) => e.name),
        website: row.properties[names.site]?.url,
        position: row.properties[names.position]?.title[0].text.content
    }
}

module.exports.fetchNewJobs = async () => {
    const newJobsPage = await notion.databases.query({        
        database_id: process.env.TEST_DATABASE_ID, 
        filter: {
            and: [
                {                    
                    property: "Reviewed",
                    checkbox: {
                        // todo: change to true
                        equals: false,
                    },
                },
                {
                    property: "tg_published",
                    checkbox: {
                        equals: false,
                    }
                }
            ]
            
        },
    })

    return newJobsPage.results.map(simplify)
}

module.exports.markAsPublished = async (jobs) => {
    jobs.forEach(job => {
        notion.pages.update({        
            page_id: job.id, 
            properties: {
                tg_published: { checkbox: true}
            }        
        })
    })    
}
