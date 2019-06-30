var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre')
var BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
exports.book_create_get = async function(req, res) {
  const AuthorQueryArray = [
    Author.find().exec(),
    Genre.find().exec(),
  ];
  const [
    authors,
    genres
  ] = await Promise.all(AuthorQueryArray).catch(err => {
    res.render('index', { error: err });
  });

  res.render('book_form', { title: 'Create Book', authors:authors, genres: genres } );
};

// Handle book create on POST.
exports.book_create_post = [
  //convert the genre to an array.
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined'){
        req.body.genre=[];
      } else {
        console.log("converting to array..");
        console.log(req.body.genre);
        req.body.genre = new Array(req.body.genre);
        console.log(req.body.genre);
      }
    }
    next();
  },
  //Validate fields.
  body('title', 'Title must not be empty').isLength({ min: 1 }).trim(),
  body('author', 'Author must not be empty').isLength({ min: 1}).trim(),
  body('summary', 'Summary must not be empty').isLength({ min: 1}).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1}).trim(),

  //sanitize fields (using wildcard)
  // sanitizeBody('*').escape(),
  // sanitizeBody('genre.*').escape(),

  //Process request after validation and sanitization.
    (req, res, next) => {

    //Extract the validation errors from a request.
    const errors = validationResult(req);

    //Create a book object with escaped and trimmed data.
    console.log("req.body");
    console.log(req.body);
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre:req.body.genre
    })

    if(!errors.isEmpty()) {
      //There are errors. Render form again with sanitized values/error messages.

      //Get all authors and genres for form.
      const AuthorQueryArray = [
        Author.find().exec(),
        Genre.find().exec(),
      ];
      Promise.all(AuthorQueryArray).then((results) => {
        console.log("Promise.all...............................", results[0])
        const authors = results[0]
        const genres = results[1]
        console.log("genres are..........", genres)
        console.log(book.genre);
        for (let i = 0; i < genres.length; i++) {
              if (book.genre.indexOf(genres[i]._id) > -1) {
                console.log("genres[i]....................", genres[i]._id)
                  genres[i].checked='true';
              }
          }
        res.render('book_form', { title: 'Create Book', authors:authors, genres: genres, book: book, errors:errors.array() } );
      })
      .catch((err) => {
        res.render('index', { error: err });
      })
    //   const [
    //     authors,
    //     genres
    //   ] = await Promise.all(AuthorQueryArray).catch(err => {
    //     res.render('index', { error: err });
    //   });
    //   for (let i = 0; i < genres.length; i++) {
    //     if (book.genre.indexOf(genres[i]._id) > -1) {
    //         genres[i].checked='true';
    //     }
    // }
    //   res.render('book_form', { title: 'Create Book', authors:authors, genres: genres, book: book, errors:errors.array() } );
    }
    else {
      // Data from form is valid. Save book.
      book.save(function (err) {
          if (err) { return next(err); }
             //successful - redirect to new book record.
             res.redirect(book.url);
      });
  }
  }
]
// ==========================================================================================
// Handle book create on POST.
// exports.book_create_post = [
//   // Convert the genre to an array.
//   (req, res, next) => {
//       if(!(req.body.genre instanceof Array)){
//           if(typeof req.body.genre==='undefined')
//           req.body.genre=[];
//           else
//           req.body.genre=new Array(req.body.genre);
//       }
//       next();
//   },

//   // Validate fields.
//   body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
//   body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
//   body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
//   body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

//   // Sanitize fields (using wildcard).
//   sanitizeBody('*').escape(),
//   sanitizeBody('genre.*').escape(),

//   // Process request after validation and sanitization.
//   (req, res, next) => {
      
//       // Extract the validation errors from a request.
//       const errors = validationResult(req);

//       // Create a Book object with escaped and trimmed data.
//       var book = new Book(
//         { title: req.body.title,
//           author: req.body.author,
//           summary: req.body.summary,
//           isbn: req.body.isbn,
//           genre: req.body.genre
//          });

//       if (!errors.isEmpty()) {
//           // There are errors. Render form again with sanitized values/error messages.

//           // Get all authors and genres for form.
//           async.parallel({
//               authors: function(callback) {
//                   Author.find(callback);
//               },
//               genres: function(callback) {
//                   Genre.find(callback);
//               },
//           }, function(err, results) {
//               if (err) { return next(err); }

//              // Mark our selected genres as checked.
//              for (let i = 0; i < results.genres.length; i++) {
//                 console.log(results);
//               if (book.genre.indexOf(results.genres[i]._id) > -1) {
//                   results.genres[i].checked='true';
//               }
//             }
//               res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
//           });
//           return;
//       }
//       else {
//           // Data from form is valid. Save book.
//           book.save(function (err, result) {
//               if (err) { return next(err); }
//                 console.log("book save................", result)
//                  //successful - redirect to new book record.
//                  res.redirect(book.url);
//               });
//       }
//   }
// ];
// ===========================================================================================
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