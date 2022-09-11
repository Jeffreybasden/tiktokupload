const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
let currentVideos = fs.readFileSync('./videos.json')
currentVideos = JSON.parse(currentVideos)

async function downloadSnap(page){
   
    

        for( obj of currentVideos){
            if(obj.downloaded ==='no'){
                await page.goto('https://snaptik.app/en')
                await page.waitForTimeout(6000)
                await page.type('#url',obj.src)
                await page.click('#submiturl')
                await page.waitForSelector('#download-block > div > a:nth-child(2)')
                await page.click('#download-block > div > a:nth-child(2)')
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


 module.exports = downloadSnap()
