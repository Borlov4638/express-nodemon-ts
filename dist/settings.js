"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableResolutions = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions || (exports.AvailableResolutions = AvailableResolutions = {}));
const videoDB = [{
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": "2023-08-14T16:17:58.175Z",
        "publicationDate": "2023-08-14T16:17:58.175Z",
        "availableResolutions": [AvailableResolutions.P144]
    }];
exports.app.get('/videos', (req, res) => {
    res.send(videoDB);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videoDB.find(video => video.id === id);
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
            !AvailableResolutions[r] && errors.errorsMessages.push({
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
    videoDB.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    const videoToUpdate = videoDB.find(vid => vid.id === +req.params.id);
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
            if (!AvailableResolutions[r]) {
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
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const newPublicationDate = new Date(req.body.publicationDate);
    videoDB[videoDB.indexOf(videoToUpdate)] = Object.assign(Object.assign({}, videoToUpdate), { author: req.body.author, title: req.body.title, publicationDate: newPublicationDate.toISOString() });
    res.status(204).send(newPublicationDate.toISOString());
});
exports.app.delete('/testing/all-data', (req, res) => {
    videoDB.splice(0, videoDB.length);
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const vidoTodelete = videoDB.find(vid => vid.id === +req.params.id);
    if (vidoTodelete) {
        videoDB.splice(videoDB.indexOf(vidoTodelete), 1);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
