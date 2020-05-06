// index.js
const cors = require('cors')

const express = require('express')
const app = express()

// Without the json-parser, the body property
// would be undefined. The json-parser functions 
// so that it takes the JSON data of a request, 
// transforms it into a JavaScript object and then 
// attaches it to the body property of the request 
// object before the route handler is called.


// usful for console logging
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))

// middlewares
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
]

const generateId = () => {
	const maxId = persons.length > 0
		? Math.max(...persons.map(n => n.id))
		: 0

	return maxId + 1
}

// fetch summary of phonebook
app.get('/info', (req, res) => {
	const size = persons.length
	const info = `<p> Phonebook has info for ${size} people</p>
				  <p>${new Date()}<\p>`
	res.send(info)
})

// fetching a single resource
app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find((person) => {
		// console.log(note.id, typeof note.id, id, typeof id, note.id === id)
		return person.id == id
	})

	if (person) {
		res.json(person)
	}

	else {
		// status()->sets the status code 
		// end()->method responds to req without sending any data
		res.status(404).end()
	}
})

// deleting a resource
app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)

	res.status(204).end()
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

// store data in server
app.post('/api/persons', (req, res) => {

	const body = req.body
	console.log(body)
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}

	const isThere = persons.map((p) => p.name).includes(body.name)
	console.log(isThere)
	if (isThere) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		"name": body.name,
		"number": body.number,
		"id": generateId()
	}

	persons = persons.concat(person)

	res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})