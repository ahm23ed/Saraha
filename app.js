import dotenv from 'dotenv'
dotenv.config()
import * as allRouter from './modules/index.router.js'
import express from 'express'
import connectDB from './DB/connection.js'
const app = express()
const port = 3000
const baseUrl = process.env.BASEURL
app.use(express.json())
app.use(`${baseUrl}/auth`, allRouter.authRouter)
app.use(`${baseUrl}/message`, allRouter.messageRouter)
app.use(`${baseUrl}/user`, allRouter.userRouter)


app.use(`*`, (req, res) => {
    res.json({ message: "In-valid routing" })
})

app.get('/', (req, res) => res.send('Hello World!'))
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))