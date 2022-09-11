const  Puppeteer = require("puppeteer");
const fs = require('fs')
const path = require('path')
const https = require('https');



async function downloadVideos(){
    let browser = await Puppeteer.launch({
        headless:true,
        executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
         count = 0
        let page = await browser.newPage()
        await page.waitForTimeout(3000)
        let currentVideos =  fs.readFileSync('./videos.json')
        currentVideos = JSON.parse(currentVideos)
       
        for(let video of currentVideos){

            if(video.downloaded === 'no'){
                let videoLink = await video.src
                console.log(videoLink)
                await page.goto(videoLink)
                check = await page.$('video')
                if(check==null)break;
        let videopage = await page.$eval('video', x=>x.src)
        await page.waitForTimeout(6000)
        let file = fs.createWriteStream(`./videos/${videoLink.split('@')[1].split('/').join('-')}.mp4`);
        https.get(videopage,(response)=>{
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                video.downloaded = 'yes'
                video.filepath = file.path
                count++
            });
        });
        
    }
    
           
}

currentVideos = JSON.stringify(currentVideos)
    fs.writeFileSync('videos.json', currentVideos)
    console.log('done')
    
}
                    
            
            
downloadVideos() 
        
        
    
module.exports = downloadVideos()




     

        

    
   




