"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_db_1 = require("./db/videos.db");
const video_enums_1 = require("./enums/video.enums");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get('/videos', (req, res) => {
    res.send(videos_db_1.videoDB);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos_db_1.videoDB.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map((r) => {
            !video_enums_1.AvailableResolutions[r] && errors.errorsMessages.push({
                message: 'invalid resulution',
                field: 'availableResolutions'
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videos_db_1.videoDB.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    const videoToUpdate = videos_db_1.videoDB.find(vid => vid.id === +req.params.id);
    if (!videoToUpdate) {
        res.sendStatus(404);
        return;
    }
    if (!req.body.title || !req.body.title.length || req.body.title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!req.body.author || !req.body.author.length || req.body.author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
    }
    if (Array.isArray(req.body.availableResolutions) && req.body.availableResolutions.length) {
        req.body.availableResolutions.map((r) => {
            if (!video_enums_1.AvailableResolutions[r]) {
                errors.errorsMessages.push({
                    message: 'invalid resulution',
                    field: 'availableResolutions'
                });
            }
            else {
                videoToUpdate.availableResolutions = req.body.availableResolutions;
            }
        });
    }
    if (typeof req.body.canBeDownloaded !== 'undefined') {
        if (typeof req.body.canBeDownloaded === 'boolean') {
            videoToUpdate.canBeDownloaded = req.body.canBeDownloaded;
        }
        if (typeof req.body.canBeDownloaded !== 'boolean') {
            errors.errorsMessages.push({
                message: 'canBeDownloaded shoud be boolean',
                field: 'canBeDownloaded'
            });
        }
    }
    if (req.body.minAgeRestriction) {
        if ((typeof req.body.minAgeRestriction) !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1) {
            errors.errorsMessages.push({
                message: 'Invalid Age Restriction',
                field: 'minAgeRestriction'
            });
        }
        else {
            videoToUpdate.minAgeRestriction = req.body.minAgeRestriction;
        }
    }
    if (typeof req.body.publicationDate !== 'string' || req.body.publicationDate.length < 1) {
        errors.errorsMessages.push({
            message: 'Invalid publication date',
            field: 'publicationDate'
        });
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const newPublicationDate = new Date(req.body.publicationDate);
    videos_db_1.videoDB[videos_db_1.videoDB.indexOf(videoToUpdate)] = Object.assign(Object.assign({}, videoToUpdate), { author: req.body.author, title: req.body.title, publicationDate: newPublicationDate.toISOString() });
    res.status(204).send(newPublicationDate.toISOString());
});
exports.app.delete('/testing/all-data', (req, res) => {
    videos_db_1.videoDB.splice(0, videos_db_1.videoDB.length);
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const vidoTodelete = videos_db_1.videoDB.find(vid => vid.id === +req.params.id);
    if (vidoTodelete) {
        videos_db_1.videoDB.splice(videos_db_1.videoDB.indexOf(vidoTodelete), 1);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
