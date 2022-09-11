const puppeteer = require('puppeteer')
const fs = require('fs')
const start = require('./linkfinder')
currentVideos =  fs.readFileSync('./videos.json')
currentVideos =  JSON.parse(currentVideos)
let counts = 0


uploadVideo()
   

async function uploadVideo(){
   
    const browser = await puppeteer.launch({headless:false,args:[
        '--user-data-dir=%userprofile%\\AppData\\Local\\Chrome\\User Data',
        '--profile-directory=Profile 1' ],
        executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    })
    const page = await browser.newPage()
    page.setViewport({width:1300,height:1000})
    await start(page)
    await downloadSnap(page)
    
     for(let video of currentVideos){
         try{
         if(video.uploaded === 'no'){

                await page.goto('https://studio.youtube.com/channel/UCp-G873UKXHFFThwYvrjN_g/videos/upload?d=ud&filter=%5B%5D&sort=%7B%22columnType%22%3A%22date%22%2C%22sortOrder%22%3A%22DESCENDING%22%7D')
                await page.waitForSelector('#select-files-button')
                let [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    page.click('#select-files-button')
                ])
                console.log(video.src)
                await fileChooser.accept([video.filepath])
                await page.waitForSelector('#textbox')
                await page.waitForTimeout(5000)
                await page.type('#textbox',video.title)
                await page.type('#description-textarea',video.des)
                await page.waitForTimeout(5000)
                autoScroll(page)
                await page.click('#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(2)')
                await page.waitForTimeout(9000)
                await page.click('#next-button > div')
                await page.waitForTimeout(9000)
                await page.click('#next-button')
                await page.waitForTimeout(9000)
                await page.click('#next-button')
                await page.waitForTimeout(9000)
                await page.click('#privacy-radios > tp-yt-paper-radio-button:nth-child(19)')
                await page.click('#done-button')
                video.uploaded = 'yes'
                await page.waitForTimeout(70000)
                console.log(counts)
                if(video.uploaded === 'yes'){
                    fs.unlinkSync(video.filepath)
                    console.log('video deleted')
                    counts++
                }
             }
        }catch(err){
            if(err){
                continue;
            }
               
        }
        if(counts >= 1){
            break;
        }
    }
        currentVideos = JSON.stringify(currentVideos)
        fs.writeFileSync('./videos.json', currentVideos)
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


async function downloadSnap(page){
   
    

    for( obj of currentVideos){
        if(obj.downloaded ==='no'){
            await page.goto('https://snaptik.app/en')
            await page.waitForTimeout(6000)
            await page.type('#url',obj.src)
            await page.click('#submiturl')
            await page.waitForSelector('#snaptik-video > article > div.snaptik-right > div > a:nth-child(2)')
            await page.click('#snaptik-video > article > div.snaptik-right > div > a:nth-child(2)')
            await page.waitForTimeout(9000)
            obj.downloaded = 'yes'
            console.log(obj.src)
        }
    }

    let final = sortVideos(currentVideos)
    final = JSON.stringify(final)
    fs.writeFileSync('./videos.json',final)
    console.log('videos downloaded with no errors')
   
}





const sortVideos = (videosArr)=>{
let files = fs.readdirSync('./nowatermarkvideos')
videosArr.forEach(video=>{
    filePath = files.filter(file=> file.split('_')[1] === video.src.split('/')[5])
    if(filePath.length > 0){
        video.filepath = `./nowatermarkvideos/${filePath[0]}`
        console.log(video.filepath)
    } 
})
return videosArr    
}




    
