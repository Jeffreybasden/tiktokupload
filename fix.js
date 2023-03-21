const mongoose = require('mongoose')
const VideosDB = require('./mogoose')

async function con(){

    await mongoose.connect('mongodb://127.0.0.1:27017/videos')
}
con()
 async function update(){
    try{
        
        let Videos = await VideosDB.find({})
        Videos.forEach((vid,ind)=>{
            if(ind<=393){
                vid.uploaded = 'yes'
                vid.downloaded ='yes'
            }
        })
        
        await VideosDB.bulkSave(Videos)
    }catch(err){
        console.log(err)
    }
}
update()