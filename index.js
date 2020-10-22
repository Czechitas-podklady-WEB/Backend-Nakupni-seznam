import cors from 'cors'
import express from 'express'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const port = 3000

app.get('/', (request, response) => {
	response.send('Hello')
})

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})
