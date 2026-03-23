const musicModel = require('../models/music.model');
const { uploadFile } = require('../services/storage.service');
const albumModel = require('../models/album.model');

async function createMusic(req, res) {


    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        title: title,
        uri: result.url,
        artist: req.user.id
    })

    return res.status(201).json({
        message: 'Music created successfully',
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })
}

async function createAlbum(req, res) {

    const { title, musics } = req.body;

    let album = await albumModel.findOne({
        title,
        artist: req.user.id
    });

    if (album) {
        album = await albumModel.findByIdAndUpdate(
            album._id,
            { $push: { musics: { $each: musics } } },
            { new: true }
        );
    } else {
        album = await albumModel.create({
            title,
            artist: req.user.id,
            musics
        });
    }

    return res.status(201).json({
        message: 'Album created successfully',
        album
    });
}

async function getAllMusics(req, res) {
    const musics = await musicModel.find().limit(2).populate('artist', 'username');
    return res.status(200).json({
        message: 'Musics fetched successfully',
        musics: musics
    })
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate('artist', 'username');
    res.status(200).json({
        message: 'Albums fetched successfully',
        albums: albums
    })
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;
    const album = await albumModel.findById(albumId).populate('artist', 'username').populate('musics');
    return res.status(200).json({
        message: 'Album fetched successfully',
        album: album
    })
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }