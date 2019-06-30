var BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Book = require('../models/book')

//Dispaly list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err) }
      //Successful, so render
      // console.log("inside bookinstance_list...........................")
      // list_bookinstances.map((val) => {
      //     console.log(val.book.title)
      // })
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances })
    })
}
// [{ status: 'Available',
//     _id: 5d11357297727377dbfc4e33,
//     book:
//      { genre: [Array],
//        _id: 5d11356b97727377dbfc4e2c,
//        title: 'The Name of the Wind (The Kingkiller Chronicle, #1)',
//        summary:
//         'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
//        author: 5d11356797727377dbfc4e24,
//        isbn: '9781473211896',
//        __v: 0 
// },
//     imprint: 'London Gollancz, 2014.',
//     due_back: 2019-06-24T20:41:22.177Z,
//     __v: 0 },]

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) { // No results
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      //Successful, so render.
      //    console.log("bookinstance_detail.............................................")
      //    console.log(bookinstance)
      res.render('bookinstance_detail', { title: 'Book', bookinstance: bookinstance })
    })
}

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res) {
  Book.find({}, {'title': true})
    .exec(function(err, books) {
      if(err) { return next(err); }
      //Successful, so render.
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books })
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  
]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
