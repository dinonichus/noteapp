// import module
const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/note.controller');

// mengatur router tampilan daftar Notes
router.get('/notes', NoteController.index);
// mengatur router untuk menyimpan Note baru
router.post('/notes', NoteController.insert);

// mengatur router untuk menampilkan halaman create Notes
router.get('/notes/create', NoteController.create);
// mengatur rotuer untuk fitur search Notes
router.post('/notes/search', NoteController.search);

// mengatur router untuk menampilkan Note tertentu
router.get('/notes/:id', NoteController.view);
// mengatur router untuk update Notes
router.put('/notes/:id', NoteController.update);
// mengatur router untuk delete Notes
router.delete('/notes/:id', NoteController.delete);

module.exports = router;
