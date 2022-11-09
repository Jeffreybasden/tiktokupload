
const fs = require('fs')

async function start(page){

await page.goto('https://www.tiktok.com/@nassaumgck?lang=en')
await page.waitForTimeout(5000)
await page.click('#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-w4ewjk-DivShareLayoutV2.elmjn4l0 > div > div.tiktok-xuns3v-DivShareLayoutMain.ee7zj8d4 > div.tiktok-1k5e4nr-DivVideoFeedTab-StyledDivVideoFeedTabV2.e9uh1830 ')
await autoScroll(page)
await page.waitForTimeout(5000)
let currentVideos = fs.readFileSync('./videos.json')
currentVideos = await JSON.parse(currentVideos)


let videoNames = await page.evaluate(()=>{
    let count = 0
   return Array.from(document.querySelectorAll('#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-w4ewjk-DivShareLayoutV2.elmjn4l0 > div > div.tiktok-xuns3v-DivShareLayoutMain.ee7zj8d4 > div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div.tiktok-x6f6za-DivContainer-StyledDivContainerV2.e1gitlwo0 > div > div > a')).map(x=>{ 
        let obj = {}
        obj.id = count
        obj.src = x.href
        obj.downloaded = 'no'
        obj.title = `Funny tiktok by ${x.href.split('/')[3].split('?')[0]}`
        obj.uploaded = 'no'
        obj.des = "Subscribe to this channel for more funny tiktoks"
        obj.filepath= ''
        count++
        return obj
    })
})
if(videoNames.length > currentVideos.length &&currentVideos.length > 3){
    
    let cutNum = videoNames.length - currentVideos.length
    videoNames = videoNames.sort((a,b)=>b.id-a.id)
    videoNames = videoNames.splice(cutNum,videoNames.length)
    
    videoNames.forEach(v=>{
        currentVideos.push(v)
        console.log(v)
    })

    fs.writeFile('./videos.json',JSON.stringify(currentVideos),()=>console.log('written'))
    
}else if(videoNames.length == currentVideos.length){
    console.log('Same Array')

    fs.writeFile('./videos.json',JSON.stringify(currentVideos),()=>console.log('written'))
   
}else{
    
    videoNames = videoNames.sort((a,b)=> b.id-a.id)
    fs.writeFile('./videos.json',JSON.stringify(videoNames),()=>console.log('written'))
    
}

await console.log(videoNames.length)
await console.log(currentVideos.length)
await console.log('done')



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