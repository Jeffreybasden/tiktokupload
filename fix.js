const fs = require('fs')

let Videos = fs.readFileSync('./videos.json')
Videos = JSON.parse(Videos)

Videos.forEach((vid,ind)=>{
    if(ind<=278){
        vid.uploaded = 'yes'
        vid.downloaded ='yes'
    }
})

Videos = JSON.stringify(Videos)
fs.writeFile('./videos.json',Videos,()=>{
    console.log('fixed!')
})