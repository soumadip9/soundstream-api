const ImageKit = require("imagekit");

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: "https://ik.imagekit.io/cbn7ra7lt"
})

async function uploadFile(file){
const result = await ImageKitClient.upload({
    file,
    fileName: "music_"+Date.now(),
    folder: 'spotifybackend/music'
})
return result;
}

module.exports = {uploadFile}