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
                await page.click('div.hero-input-right > button')
                await page.click('#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.active.mb-2')
                await page.waitForTimeout(9000)
                let files = fs.readdirSync('./noWaterMarkVideos')
                filePath = files.filter(file=> file.split('_')[1] === obj.src.split('/')[5])
                    if(filePath.length > 0){
                    obj.filepath = `./noWaterMarkVideos/${filePath[0]}`
                    } 
                obj.downloaded = 'yes'
            }
        }
    
        // let files = fs.readdirSync('./noWaterMarkVideos')
        // filePath = files.filter(file=> file.split('_')[1] === obj.src.split('/')[5])
        //     if(filePath.length > 0){
        //     obj.filepath = `./noWaterMarkVideos/${filePath[0]}`
        //     } 
        // obj.downloaded = 'yes'
        // console.log(obj.src)
        final = JSON.stringify(currentVideos)
        fs.writeFileSync('./videos.json',final)
        console.log('videos downloaded with no errors')
        
       
    }


 module.exports = downloadSnap()
