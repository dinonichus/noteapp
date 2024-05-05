const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todo.controller');

// mengatur router ntuk menambahkan dan menghapus Todo
router.post('/notes/:id/todos', TodoController.insert);
router.delete('/notes/:id/todos/:todoId', TodoController.delete);

module.exports = router;
