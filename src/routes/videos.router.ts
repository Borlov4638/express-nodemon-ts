import { Router } from "express";
import { RequestWithBody, RequestWithBodyAndParam, RequestWithId } from '../types/request.types'
import { ErrorType } from '../types/errors.types'
import { videoDB } from '../db/videos.db'
import { AvailableResolutions } from '../enums/video.enums'
import { VideoType } from '../types/video.type'
import { Request, Response } from 'express'

export const videosRouter = Router({})


videosRouter.get('/',(req : Request, res: Response) =>{
    res.send(videoDB)
})

videosRouter.get('/:id',(req : RequestWithId<{id:number}>, res: Response) =>{
    const id = +req.params.id

    const video = videoDB.find(video => video.id === id)

    if (!video){
        res.sendStatus(404)
        return
    }

    res.send(video)
})

videosRouter.post('/', (req : RequestWithBody<{title:string, author:string,availableResolutions:AvailableResolutions[] }>, res: Response) =>{

    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions } = req.body

    if(!title || !title.length || title.trim().length >40){
        errors.errorsMessages.push({message: 'Invalid title', field:'title'})
    }

    if(!author || !author.length || author.trim().length >20){
        errors.errorsMessages.push({message: 'Invalid author', field:'author'})
    }

    if(Array.isArray(availableResolutions) && availableResolutions.length){
        availableResolutions.map((r) =>{
            !AvailableResolutions[r] && errors.errorsMessages.push({
                message:'invalid resulution',
                field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()

    const publicationDate = new Date()
    publicationDate.setDate(publicationDate.getDate() + 1)

    const newVideo :VideoType ={
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction:null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videoDB.push(newVideo)

    res.status(201).send(newVideo)

})

videosRouter.put('/:id' ,(req:
    RequestWithBodyAndParam<{id:string},
    {title:string, author:string, availableResolutions:AvailableResolutions[], canBeDownloaded:boolean, minAgeRestriction: number|null, publicationDate: string}>,
    res: Response) =>{
    
    let errors: ErrorType = {
        errorsMessages: []
    }

    const videoToUpdate = videoDB.find(vid => vid.id === +req.params.id)

    if(!videoToUpdate){
        res.sendStatus(404)
        return
    }

    if(!req.body.title || !req.body.title.length || req.body.title.trim().length >40){
        errors.errorsMessages.push({message: 'Invalid title', field:'title'})
    }

    if(!req.body.author || !req.body.author.length || req.body.author.trim().length >20){
        errors.errorsMessages.push({message: 'Invalid author', field:'author'})
    }
    
    if(Array.isArray(req.body.availableResolutions) && req.body.availableResolutions.length){
        req.body.availableResolutions.map((r) =>{
            if (!AvailableResolutions[r])  {errors.errorsMessages.push({
                message:'invalid resulution',
                field: 'availableResolutions'
            })}else{
                videoToUpdate.availableResolutions = req.body.availableResolutions
            }
        })
    }
        if(typeof req.body.canBeDownloaded !== 'undefined'){

            if(typeof req.body.canBeDownloaded === 'boolean'){
                videoToUpdate.canBeDownloaded = req.body.canBeDownloaded
                
            }
            if(typeof req.body.canBeDownloaded !== 'boolean'){ 
                errors.errorsMessages.push({
                message:'canBeDownloaded shoud be boolean',
                field:'canBeDownloaded'
                })
            }
        }

    if(req.body.minAgeRestriction){
        if((typeof req.body.minAgeRestriction) !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1){
            errors.errorsMessages.push({
                message:'Invalid Age Restriction',
                field:'minAgeRestriction'
            })
        }else{
            videoToUpdate.minAgeRestriction = req.body.minAgeRestriction
        }
    }

    if(req.body.publicationDate){
        if(typeof req.body.publicationDate !== 'string'|| req.body.publicationDate.length < 1){
            errors.errorsMessages.push({
                message:'Invalid publication date',
                field:'publicationDate'
            })

        }else{
            const newPublicationDate = new Date(req.body.publicationDate)
            videoToUpdate.publicationDate = newPublicationDate.toISOString()
        }
    }






    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    

    videoDB[videoDB.indexOf(videoToUpdate)] = {
        ...videoToUpdate,
        author:req.body.author,
        title:req.body.title,
    }
    res.sendStatus(204)
})


videosRouter.delete('/:id', (req : RequestWithId<{id:number}>, res: Response) =>{
    const vidoTodelete = videoDB.find(vid => vid.id === +req.params.id)

    if(vidoTodelete){
        videoDB.splice(videoDB.indexOf(vidoTodelete), 1)
        res.sendStatus(204)
    }
    else{
        res.sendStatus(404)
    }

})
