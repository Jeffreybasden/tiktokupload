const puppeteer = require('puppeteer')
const fs = require('fs')
const mongoose = require('mongoose')
const VideosDB = require('./mogoose')
const start = require('./linkfinder')
const VideosDir = fs.readdirSync("./noWaterMarkVideos")
let counts = 0
var browser
var page
var interval = 14400000
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
const Server = async() =>{
    await mongoose.connect('mongodb://127.0.0.1:27017/videos')
}
Server()

setInterval(uploadVideo,interval)
async function uploadVideo(){
        browser = await puppeteer.launch({headless:false,args:[
            '--user-data-dir=C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data'
    ],
    executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
})
page = await browser.newPage()
await page.setViewport({width:1050,height:900})   
await start(page)
await downloadSnap(page, await VideosDB.find({})) 
let currentVideos = await VideosDB.find({})
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
                await page.waitForSelector('#next-button')
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
               
                if(video.uploaded === 'yes'){
                    fs.unlinkSync(video.filepath)
                    console.log('video deleted')
                    console.log('Uploaded done for the day!')
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
            
            console.log(counts)
            break;

        }
    }
    currentVideos.forEach(async(vid)=>{
        
        await VideosDB.findByIdAndUpdate({_id:vid._id}, vid)

    })
    counts--
    console.log('upload done')
    await browser.close()
    
  
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
            await  await new Promise(r => setTimeout(r, 10000));
            await page.type('#url',video.src)
            await page.click('#hero > div > form > button')
            await  await new Promise(r => setTimeout(r, 10000));
            await  await new Promise(r => setTimeout(r, 10000));
            await page.click('#download > div > div.video-links > a:nth-child(1)')
            await  await new Promise(r => setTimeout(r, 10000)); 
        }
    }
        let files = fs.readdirSync('./noWaterMarkVideos')
        if(files.length > 0){
             vidobj.map(async videos=>{
                filePath = files.filter(file=> file.split('_')[1].split('.')[0] === videos.src.split('/')[5])
                if(filePath.length > 0){
                    videos.filepath = `./noWaterMarkVideos/${filePath[0]}`
                    console.log("file path added")
                    videos.downloaded = 'yes'
                    await videos.save()
                    console.log(videos.filepath)
                } 
                
            })
        }
   
    
}










    
