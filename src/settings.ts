import express, { Request, Response } from 'express'
export const app = express()


app.use(express.json())


type RequestWithId<P> = Request<P,{},{},{}>

type RequestWithBody<B> = Request<{},{},B,{}>

type RequestWithBodyAndParam<P,B> = Request<P,{},B,{}>

type ErrorMessagess ={
    message:string
    field:string
}

type ErrorType = {
    errorMessages: ErrorMessagess[]
}

export enum AvailableResolutions{
    P144= 'P144',
    P240 ='P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080', P1440 = 'P1440',
    P2160 = 'P2160'
}

export type VideoType = {
    id:number
    title:string
    author:string
    canBeDownloaded:boolean
    minAgeRestriction: number|null
    createdAt: string
    publicationDate: string
    availableResolutions: AvailableResolutions[]
}

const videoDB : VideoType[] = [{
    "id": 0,
    "title": "string",
    "author": "string",
    "canBeDownloaded": false,
    "minAgeRestriction": null,
    "createdAt": "2023-08-14T16:17:58.175Z",
    "publicationDate": "2023-08-14T16:17:58.175Z",
    "availableResolutions": [AvailableResolutions.P144]
  }]

app.get('/videos',(req : Request, res: Response) =>{
    res.send(videoDB)
})

app.get('/videos/:id',(req : RequestWithId<{id:number}>, res: Response) =>{
    const id = +req.params.id

    const video = videoDB.find(video => video.id === id)

    if (!video){
        res.sendStatus(404)
        return
    }

    res.send(video)
})



app.post('/videos', (req : RequestWithBody<{title:string, author:string,availableResolutions:AvailableResolutions[] }>, res: Response) =>{

    let errors: ErrorType = {
        errorMessages: []
    }

    let {title, author, availableResolutions } = req.body

    if(!title || !title.length || title.trim().length >40){
        errors.errorMessages.push({message: 'Invalid title', field:'title'})
    }

    if(!author || !author.length || author.trim().length >20){
        errors.errorMessages.push({message: 'Invalid author', field:'author'})
    }

    if(Array.isArray(availableResolutions) && availableResolutions.length){
        availableResolutions.map((r) =>{
            !AvailableResolutions[r] && errors.errorMessages.push({
                message:'invalid resulution',
                field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorMessages.length){
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

app.put('/videos/:id' ,(req:
    RequestWithBodyAndParam<{id:string},
    {title:string, author:string, availableResolutions:AvailableResolutions[], canBeDownloaded:boolean, minAgeRestriction: number|null, publicationDate: string}>,
    res: Response) =>{
    
    let errors: ErrorType = {
        errorMessages: []
    }

    const videoToUpdate = videoDB.find(vid => vid.id === +req.params.id)

    if(!videoToUpdate){
        res.sendStatus(404)
        return
    }

    if(!req.body.title || !req.body.title.length || req.body.title.trim().length >40){
        errors.errorMessages.push({message: 'Invalid title', field:'title'})
    }

    if(!req.body.author || !req.body.author.length || req.body.author.trim().length >20){
        errors.errorMessages.push({message: 'Invalid author', field:'author'})
    }
    
    if(Array.isArray(req.body.availableResolutions) && req.body.availableResolutions.length){
        req.body.availableResolutions.map((r) =>{
            if (!AvailableResolutions[r])  {errors.errorMessages.push({
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
                errors.errorMessages.push({
                message:'canBeDownloaded shoud be boolean',
                field:'canBeDownloaded'
                })
            }
        }

    if(req.body.minAgeRestriction){
        if((typeof req.body.minAgeRestriction) !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1){
            errors.errorMessages.push({
                message:'Invalid Age Restriction',
                field:'minAgeRestriction'
            })
        }else{
            videoToUpdate.minAgeRestriction = req.body.minAgeRestriction
        }
    }





    if (errors.errorMessages.length){
        res.status(400).send(errors)
        return
    }

    const newPublicationDate = new Date()
    

    videoDB[videoDB.indexOf(videoToUpdate)] = {
        ...videoToUpdate,
        author:req.body.author,
        title:req.body.title,
        publicationDate: newPublicationDate.toISOString()
    }
    console.log(newPublicationDate.toISOString())
    res.status(204).send(newPublicationDate.toISOString())
})

app.delete('/testing/all-data', (req: Request, res: Response) =>{
    videoDB.splice(0, videoDB.length)
    res.sendStatus(204)
})

app.delete('/videos/:id', (req : RequestWithId<{id:number}>, res: Response) =>{
    const vidoTodelete = videoDB.find(vid => vid.id === +req.params.id)

    if(vidoTodelete){
        videoDB.splice(videoDB.indexOf(vidoTodelete), 1)
        res.sendStatus(204)
    }
    else{
        res.sendStatus(404)
    }

})
