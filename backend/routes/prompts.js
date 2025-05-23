const express = require('express');
const router = express.Router();
const { getPrompts, addPrompt, updatePrompt, deletePrompt } = require('../db');

// GET all prompts
router.get('/', (req, res) => {
  res.json(getPrompts());
});

// POST add new prompt
router.post('/add', (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) return res.status(400).send("Missing name or content.");
  const newPrompt = addPrompt({ name, content });
  res.status(201).json(newPrompt);
});

// PUT update existing prompt by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updated = updatePrompt(id, req.body);
  if (!updated) return res.status(404).send("Prompt not found.");
  res.json(updated);
});

// DELETE prompt by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = deletePrompt(id);
  if (!deleted) return res.status(404).send("Prompt not found.");
  res.json(deleted);
});

module.exports = router;
