const fs = require('fs')

let Videos = fs.readFileSync('./videos.json')
Videos = JSON.parse(Videos)

Videos.forEach((vid,ind)=>{
    if(ind>=300 && ind <=320 ){
        vid.uploaded = 'no'
        vid.downloaded ='no'
    }
})

Videos = JSON.stringify(Videos)
fs.writeFile('./videos.json',Videos,()=>{
    console.log('fixed!')
})