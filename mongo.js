const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-hku3g.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    // id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    Person.find({}).then(res => {
        console.log('phonebook:')
        res.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


else {
    // let persons = [
    //     {
    //         "name": "Arto Hellas",
    //         "number": "040-123456",
    //         "id": 1
    //     },
    //     {
    //         "name": "Ada Lovelace",
    //         "number": "39-44-5323523",
    //         "id": 2
    //     },
    //     {
    //         "name": "Dan Abramov",
    //         "number": "12-43-234345",
    //         "id": 3
    //     },
    //     {
    //         "name": "Mary Poppendieck",
    //         "number": "39-23-6423122",
    //         "id": 4
    //     }
    // ]

    const p = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    // persons.forEach((p) => {
    //     const person = new Person(p)
    //     person.save().then((res) => {
    //         console.log('person saved')
    //         mongoose.connection.close()
    //     })
    // })

    p.save().then((res) => {
        console.log('person saved')
        mongoose.connection.close()
    })

}