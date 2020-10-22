import cors from 'cors'
import express from 'express'
import { v4 as generateId } from 'uuid'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const port = parseInt(process.env.PORT || '', 10)
if (!port) {
	throw new Error('PORT environment variable not set to a number.')
}

app.use(express.static('public'))

const apiRouter = express.Router()
app.use('/api', apiRouter)

const shoppingLists = {
	example: [
		{ id: generateId(), label: 'Rice', amount: '1 kg' },
		{ id: generateId(), label: 'Bread', amount: '2' },
		{ id: generateId(), label: 'Kale', amount: '4' },
		{ id: generateId(), label: 'Potatoes', amount: '20 kg' },
		{ id: generateId(), label: 'Peas', amount: '26' },
	],
}

// List all shopping lists
apiRouter.get('/', (request, response) => {
	response.send({
		lists: Object.keys(shoppingLists),
	})
})

// List items in specific shopping list
apiRouter.get('/:name', (request, response) => {
	const items = shoppingLists[request.params.name] || []
	response.send({ items })
})

// Add or remove item to shopping list
apiRouter.post('/:name', (request, response) => {
	const { name } = request.params
	const { add, remove } = request.body

	shoppingLists[name] = shoppingLists[name] || []

	if (add) {
		if (
			add !== null &&
			typeof add === 'object' &&
			typeof add.label === 'string' &&
			typeof add.amount === 'string'
		) {
			shoppingLists[name].push({
				id: generateId(),
				label: add.label,
				amount: add.amount,
			})
			response.send({
				status: 'ok',
				message: 'Item has been added.',
			})
		} else {
			response.send({
				status: 'error',
				message: 'Malformed request body.',
			})
		}
		return
	}

	if (remove) {
		if (typeof remove === 'string') {
			const lengthBefore = shoppingLists[name].length
			shoppingLists[name] = shoppingLists[name].filter(
				(item) => item.id !== remove,
			)
			if (lengthBefore === shoppingLists[name].length) {
				response.send({ status: 'error', message: `Id "${remove}" not found.` })
			} else {
				response.send({
					status: 'ok',
					message: `Item with id "${remove}" has been removed.`,
				})
			}
		} else {
			response.send({
				status: 'error',
				message: 'Remove value must be a string.',
			})
		}
		return
	}

	response.send({ status: 'error', message: 'Nothing to do.' })
})

// 404

apiRouter.use((request, response) => {
	response.status(404).send({
		status: 'error',
		message: 'Not found.',
	})
})

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})
