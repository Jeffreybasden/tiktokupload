const puppeteer = require('puppeteer')
const fs = require('fs')
const mongoose = require('mongoose')
const VideosDB = require('./mogoose')
const start = require('./linkfinder')
const VideosDir = fs.readdirSync("./noWaterMarkVideos")
let counts = 0


const Server = async() =>{
    await mongoose.connect('mongodb://127.0.0.1:27017/videos')
}
Server()

uploadVideo()

async function uploadVideo(){
    const browser = await puppeteer.launch({headless:false,args:[
        '--user-data-dir=%userprofile%\\AppData\\Local\\Chrome\\UserData',
        '--profile-directory=Profile 1' 
    ],
    executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
})
const page = await browser.newPage()
await page.setViewport({width:1000,height:900})
await start(page)
let currentVideos = await VideosDB.find({})
    currentVideos = await downloadSnap(page,currentVideos) 
    await new Promise(r=> setTimeout(r,5000))
     for(let video of currentVideos){
         try{
         if(video.uploaded === 'no' && VideosDir.includes(video.filepath.split('/')[2])){

                await page.goto('https://studio.youtube.com/channel/UCp-G873UKXHFFThwYvrjN_g/videos/upload?d=ud&filter=%5B%5D&sort=%7B%22columnType%22%3A%22date%22%2C%22sortOrder%22%3A%22DESCENDING%22%7D')
                await page.waitForSelector('#select-files-button')
                let [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    page.click('#select-files-button')
                ])
                console.log(video.src)
                await fileChooser.accept([video.filepath])
                await new Promise(r => setTimeout(r, 10000));
                await page.click('#title-textarea')
                await page.keyboard.press('End', {delay:1000})
                for(let i = 0; i<=video.filepath.length; i++){
                    await page.keyboard.press('Backspace')
                }
                await new Promise(r => setTimeout(r, 10000));
                await page.type('#title-textarea','Subscribe for more funny shorts! #shorts #funny #fyp')
                await new Promise(r => setTimeout(r, 10000));
                await page.click('#description-textarea')
                await page.type('#description',`${video.des}  #shorts #funny #tiktok`)
                await new Promise(r => setTimeout(r, 8000));
                autoScroll(page)
                await page.click('#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(2)')
                await new Promise(r => setTimeout(r, 9000));
                await page.click('#next-button')
                await new Promise(r => setTimeout(r, 9000));
                await page.click('#next-button')
                await new Promise(r => setTimeout(r, 8000));
                await page.click('#next-button')
                await new Promise(r => setTimeout(r, 7000));
                await page.click('#privacy-radios > tp-yt-paper-radio-button:nth-child(19)')
                await page.waitForSelector('#done-button')
                await page.click('#done-button')
                video.uploaded = 'yes'
                await new Promise(r => setTimeout(r, 10000));
                await page.waitForNetworkIdle({idleTime:1})
                console.log(counts)
                if(video.uploaded === 'yes'){
                    fs.unlinkSync(video.filepath)
                    console.log('video deleted')
                    counts++
                }
             }
        }catch(err){
            if(err){
                console.log(err)
                continue;
            }     
        }
        if(counts >= 1){
            break;
        }
    }
        currentVideos.forEach(async(vid)=>{
            await VideosDB.findByIdAndUpdate({_id:vid._id}, vid)
        })
        console.log('Uploaded done for the day!')
        browser.close()
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


async function downloadSnap(page, vidobj){
    for( video of vidobj){
        if(video.downloaded ==='no'){
            await page.goto('https://snaptik.app/en')
            await page.waitForTimeout(6000)
            await page.type('#url',video.src)
            await page.click('div.hero-input-right > button')
            await page.waitForTimeout(9000)
            await page.waitForSelector('#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.active.mb-2')
            await page.click('#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.active.mb-2')
            await page.waitForTimeout(9000)
            
        }
    }
        let files = fs.readdirSync('./noWaterMarkVideos')
        if(files.length > 0){
            vidobj = vidobj.map(videos=>{
        
                filePath = files.filter(file=> file.split('_')[1].split('.')[0] === videos.src.split('/')[5])
                if(filePath.length > 0){
                    videos.filepath = `./noWaterMarkVideos/${filePath[0]}`
                    console.log("file path added")
                    console.log(videos.filepath)
                } 
                videos.downloaded = 'yes'
                console.log(videos.filepath)
                return videos
            })
        }
    
    return vidobj
    
}










    
