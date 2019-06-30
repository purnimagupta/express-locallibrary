var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
    Genre.find()
        .sort([['name']])
        .exec(function (err, list_genre) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
        });
};

// Display detail page for a specific Genre.
exports.genre_detail = async function (req, res) {
    // const genre_promise = Genre.findById(req.params.id).exec();

    // var p1 = genre_promise.then((resolve, reject) => {
    //     reject(new Error('No genre found'));
    // })

    const genreQueryArray = [
        Genre.findById(req.params.id).exec(),
        Book.find({ 'genre': req.params.id }).exec(),
    ];
    const [
        genre,
        genre_books
    ] = await Promise.all(genreQueryArray).catch(err => {
        res.render('index', { error: err });
    });
    res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: genre_books });
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
exports.genre_create_get = function (req, res) {
    res.render('genre_form', { title: 'Create Genre ' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
    //Validate that name field in not empty
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    // SanitizeBody('name').escape(),
    sanitizeBody('name').escape(),

    //Process request after validation and sanitization.
    (req, res, next) => {

        //Extract the validation errors from a request.
        // console.log("req is...............................................................", req.body)
        const errors = validationResult(req);
        // console.log(errors);

        //Create a genre object with escaped and trimmed data,
        var genre = new Genre(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the from again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() })
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec(function (err, found_genre) {
                  if(err) {
                    return next(err);
                  }
                  if(found_genre) {
                    //Genre exists, redirect to its detail page.
                    res.redirect(found_genre.url);
                  }
                  else {
                    genre.save(function(err){
                      if(err) {
                        return next(err);
                      }
                      //Genre saved. Redirect to genre detail page
                      res.redirect(genre.url);
                    })
                  }
                });
        }
    }
]

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
