var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
    .sort([['name']])
    .exec(function (err, list_genre) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = async function(req, res) {
    // const genre_promise = Genre.findById(req.params.id).exec();

    // var p1 = genre_promise.then((resolve, reject) => {
    //     reject(new Error('No genre found'));
    // })
        
    const genreQueryArray = [
        Genre.findById(req.params.id).exec(),
        Book.find({'genre': req.params.id }).exec(),
    ];
    const [
        genre,
        genre_books
    ] = await Promise.all(genreQueryArray).catch(err => {
        res.render('index', { error: err });
    });
    res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: genre_books } );
    // Promise.all([genreQueryArray])
    // .then(values => { 
    //     const data = {
    //         genre: values[0],
    //         genre_books: values[1],
    //     };
    //     res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: genre_books } ); 
    // })
    // .catch(error => { 
    //     res.render('index', { error: error   });
    // });
    
};


// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
