const express = require('express');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');

const app = express();

app.engine('mustache', mustache());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const Books = require('./models/books.js');

mongoose.connect('mongodb://localhost:27017/books');

var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', async (request, response) => {
    var books = await Books.find();
    var model = {books: books};
    response.render('index', model)
});

app.post('/', (request, response) => {
    var newBook = {
        title: request.body.title,
        author: request.body.author,
        pages: request.body.pages
        }
    Books.create(newBook);
    response.redirect('/');
})

app.get('/:id', async(request, response) => {
    var id = request.params.id;
    var book = await Books.find({_id:id});
    var model = {book: book, id:id};
    response.render('view', model);
});

app.get('/edit/:id', async(request, response) => {
    var id = request.params.id;
    var book = await Books.find({_id:id});
    var model = {book: book, id:id};
    response.render('edit', model);
});

app.post('/edit/:id', async(request, response) => {
    var id = request.params.id;
    await Books.findOneAndUpdate({_id:id},
    {
        title: request.body.title,
        author: request.body.author,
        pages: request.body.pages
        
    })
        response.redirect('/')
});

app.post('/delete/:id', async (request, response) => {
    await Books.deleteOne({_id: request.params.id})
    response.redirect('/');
});
app.listen(3000);
