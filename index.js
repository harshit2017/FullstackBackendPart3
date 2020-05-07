require('dotenv').config()
const cors = require('cors')

// db
const Person = require('./models/person')

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



// fetch summary of phonebook
app.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		const info = `<p> Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}<\p>`

		res.send(info)
	})

})

// fetching a single person
app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (note)
				res.json(person.toJSON())
			else
				res.status(404).end()
		})
		.catch(error => next(error))
})


// deleting a person
app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

// fetch data from db
app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		// console.log(persons)
		res.json(persons.map(person => person.toJSON()))
	})
})

// store data in db
app.post('/api/persons', (req, res, next) => {

	const body = req.body
	console.log(body)
	if (!body.name || !body.number) {
		return res.status(400).send('name or number missing')
	}


	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save()
		.then(savedPerson => {
			res.json(savedPerson.toJSON())
		})
		.catch(error => next(error))
})


// fetch and update num
app.put('/api/persons/:id', (req, res, next) => {
	const person = {
		name: req.body.name,
		number: req.body.number
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson.toJSON())
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send('unknown endpoint')
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// Express error handlers are middleware 
// that are defined with a function that accepts four parameters. 
const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send('malformatted id')
	}

	else if (error.name === 'ValidationError') {
		response.status(400).send(error.message)
	}

	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})