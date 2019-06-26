var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre')
var BookInstance = require('../models/bookinstance');

var async = require('async');

exports.index = async function(req, res) {
    // function book_count(){
    //     Book.countDocuments( function(err, res){
    //         if(err) {

    //         }
    //         else {
    //             res.json({
    //                 data: res
    //             }
    //             )
    //         }
    //     })   
    // }
    // function fn1(){
    //     return Promise.resolve(2);        
    // }
    
    // Promise.all([book_count(), book_instance_count()]).then(function(results){
    //     //access results in array
    //     console.log(results); // [1,2]
    // });
    const bookQueryArray = [
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({status:'Available'}).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec()

    ];

    // Promise.all(bookQueryArray).then(function(results){
    //     console.log("inside promise.all");
    //     console.log(results);
    //     const data = {
    //         book_count: results[0],
    //         book_instance_count: results[1],
    //         book_instance_available_count: results[2],
    //         author_count: results[3],
    //         genre_count: results[4],

    //     };

    //     res.render('index', { title: 'Local Library Home', data: data });
    // }).catch(err => {
    //     res.render('index', { error: err });
    // });

    const [
        book_count, 
        book_instance_count, 
        book_instance_available_count, 
        author_count, 
        genre_count
    ] = await Promise.all(bookQueryArray).catch(err => {
        res.render('index', { error: err });
    });

    res.render('index', { title: 'Local Library Home', data: {
        book_count: book_count,
        book_instance_count: book_instance_count, 
        book_instance_available_count: book_instance_available_count,
        author_count: author_count,
        genre_count: genre_count
    } });


    // const book_instance_count_promise = BookInstance.countDocuments({}).exec();

    // const book_instance_available_count_promise = BookInstance.countDocuments({status:'Available'}).exec();

    // const author_count_promise = Author.countDocuments({}).exec();

    // const genre_count = Genre.countDocuments({}).exec();

    // async.parallel({
    //     book_count: function(callback) {
    //         Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    //     },
    //     book_instance_count: function(callback) {
    //         BookInstance.countDocuments({}, callback);
    //     },
    //     book_instance_available_count: function(callback) {
    //         BookInstance.countDocuments({status:'Available'}, callback);
    //     },
    //     author_count: function(callback) {
    //         Author.countDocuments({}, callback);
    //     },
    //     genre_count: function(callback) {
    //         Genre.countDocuments({}, callback);
    //     }
    // }, function(err, results) {
    //     res.render('index', { title: 'Local Library Home', error: err, data: results });
    // });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
    .populate('author')
    .exec(function(err, list_books) {
        if(err) {
            return next(err);
        }
        //successful, so render it
        res.render('book_list', { title: 'Book List', book_list: list_books})
    })
};

// Display detail page for a specific book.
exports.book_detail = async function(req, res) {
    const bookQueryArray = [
        Book.findById(req.params.id).populate('author genre').exec(),
        BookInstance.find({'book': req.params.id }).exec(),
    ];
    const [
        book,
        book_instance
    ] = await Promise.all(bookQueryArray).catch(err => {
        res.render('index', { error: err });
    });
    res.render('book_detail', { title: 'Title', book:book, book_instances:book_instance } );
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};