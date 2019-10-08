const multer = require('multer');

const avatar = multer (
{ 
    limits:
    {
        fileSize: 1000000 // That will limit the size of the file, 1 = 1 byte, 1000000 = 1MB
    } ,
    fileFilter(req, file, cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) // That will verify the extension, if is jpg, jpeg or png
        { 
            return cb(new Error('Please upload an image')); // If it is not will callback a error
        }
        cb(undefined, true);
    }
});

module.exports = avatar;