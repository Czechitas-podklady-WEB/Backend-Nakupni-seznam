import express from 'express'

const app = express()
const port = 3000

app.get('/', (request, response) => {
	response.send('Hello')
})

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})
