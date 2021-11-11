require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
const	fileUpload = require('express-fileupload');
app.use(fileUpload({useTempFiles:true}));

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRETE
  });

app.post('/', function (req, res) {
    const img=req.files.image;
    const old_img=req.body.old_img_url;
   
    cloudinary.uploader.upload(img.tempFilePath,function(error,result){
        if(error){
            console.log(error);
        }

        if(!result){
            res.send('something went wrong');
        }

        if(old_img){
            public_id=getOldFileCloudinaryPublicId(old_img);
            cloudinary.api.delete_resources([public_id],function(error, result) {});
        }
        
        res.send("url:"+result.secure_url);
        
    });
    
});


function getOldFileCloudinaryPublicId(old_file_url) {
    const old_file_array=old_file_url.split("/");
    const old_file_name=old_file_array[old_file_array.length-1];
    const public_id=old_file_name.split(".")[0];
    return public_id;
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});