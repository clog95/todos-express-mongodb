var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const Todo = require('../app/models/Todo');
var router = express.Router();

var ensureLoggedIn = ensureLogIn();

function fetchTodos(req, res, next) {
  Todo.find({ owner_id: req.user._id })
    .then(listTodos => {
      var todos = listTodos.map(function(item) {
        return {
          id: item._id,
          title: item.title,
          completed: item.completed == 1 ? true : false,
          url: '/' + item._id
        }
      });
      res.locals.todos = todos;
      res.locals.activeCount = todos.filter(function(item) { return !item.completed; }).length;
      res.locals.completedCount = todos.length - res.locals.activeCount;
      next();
    }).catch();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, fetchTodos, function(req, res, next) {
  res.locals.filter = null;
  res.render('index', { user: req.user });
});

router.get('/active', ensureLoggedIn, fetchTodos, function(req, res, next) {
  res.locals.todos = res.locals.todos.filter(function(todo) { return !todo.completed; });
  res.locals.filter = 'active';
  res.render('index', { user: req.user });
});

router.get('/completed', ensureLoggedIn, fetchTodos, function(req, res, next) {
  res.locals.todos = res.locals.todos.filter(function(todo) { return todo.completed; });
  res.locals.filter = 'completed';
  res.render('index', { user: req.user });
});

router.post('/', ensureLoggedIn, function(req, res, next) {
  req.body.title = (req.body.title || '').trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  return res.redirect('/' + (req.body.filter || ''));
}, function(req, res, next) {
  req.body.owner_id = req.user._id;
  req.body.completed = req.body.completed == true ? 1 : null;
  var newTodo = new Todo(req.body);
  newTodo.save()
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
});

router.post('/:id', ensureLoggedIn, function(req, res, next) {
  req.body.title = (req.body.title || '').trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  Todo.deleteOne({_id: req.params.id, owner_id: req.user._id})
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
}, function(req, res, next) {
  req.body.completed = req.body.completed !== undefined ? 1 : null,
  Todo.updateOne({_id: req.params.id, owner_id: req.user._id}, req.body)
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
});

router.post('/:id/delete', ensureLoggedIn, function(req, res, next) {
  Todo.deleteOne({_id: req.params.id, owner_id: req.user._id})
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
});

router.post('/todos/toggle-all', ensureLoggedIn, function(req, res, next) {
  Todo.updateMany({owner_id: req.user._id}, {$set: {completed: req.body.completed !== undefined ? 1 : null}})
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
});

router.post('/todos/clear-completed', ensureLoggedIn, function(req, res, next) {
  Todo.deleteMany({owner_id: req.user._id, completed: 1})
    .then(() => res.redirect('/' + (req.body.filter || '')))
    .catch();
});

module.exports = router;
