import express from "express"
import { Request, Response } from 'express'
import { videoDB } from "./db/videos.db"
import { videosRouter } from "./routes/videos.router"

export const app = express()

app.use(express.json())

app.use('/videos', videosRouter)

app.delete('/testing/all-data', (req: Request, res: Response) =>{
    videoDB.splice(0, videoDB.length)
    res.sendStatus(204)
})


