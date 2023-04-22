
const VideosDB = require('./mogoose')

async function start(page){

await page.goto('https://www.tiktok.com/@nassaumgck?lang=en')
await page.waitForTimeout(5000)
await page.click('#main-content-others_homepage > div > div.tiktok-833rgq-DivShareLayoutMain.ee7zj8d4 > div.tiktok-1ilo35b-DivVideoFeedTab.e1jjp0pq0 > p.tiktok-g8sazn-PLike.e1jjp0pq3')
await autoScroll(page)
await page.waitForTimeout(5000)
let currentVideos = await VideosDB.find({})

 

let videoNames = await page.evaluate(()=>{
    let count = 0
   return Array.from(document.querySelectorAll('div.tiktok-x6f6za-DivContainer-StyledDivContainerV2.eq741c50 > div > div > a')).map(x=>{ 
        let obj = {}
        obj.id = count
        obj.src = x.href
        obj.downloaded = 'no'
        obj.title = `Funny tiktok by ${x.href.split('/')[3].split('?')[0]}`
        obj.uploaded = 'no'
        obj.des = x.title
        obj.filepath= ''
        count++
        return obj
    })
})

if(videoNames.length > currentVideos.length && currentVideos.length > 3){ 
    let cutNum = videoNames.length - currentVideos.length
    
    videoNames =  videoNames.sort((a,b)=>b.id-a.id)
    videoNames = videoNames.slice(videoNames.length - (cutNum+1),videoNames.length+1)
    await VideosDB.insertMany(videoNames)

    console.log('new vids!')
    console.log(cutNum)
}else if(videoNames.length == currentVideos.length){
    console.log('Same Array')
}else if(currentVideos.length <=0){
    videoNames = await videoNames.sort((a,b)=> b.id-a.id)
     await VideosDB.insertMany(videoNames)
     
     console.log('new')
}

console.log(videoNames.length)
console.log(currentVideos.length)
console.log('done')



}


    
    
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

 module.exports = start