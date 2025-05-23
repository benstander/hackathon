// In-memory mock DB
let prompts = [
  {
    id: 1,
    name: "Default Budget Prompt",
    content: "Help the user reach their monthly savings goal with transaction analysis."
  }
];

// READ all
function getPrompts() {
  return prompts;
}

// CREATE new
function addPrompt(prompt) {
  const newPrompt = { id: Date.now(), ...prompt };
  prompts.push(newPrompt);
  return newPrompt;
}

// UPDATE by ID
function updatePrompt(id, fields) {
  const index = prompts.findIndex(p => p.id === id);
  if (index === -1) return null;
  prompts[index] = { ...prompts[index], ...fields };
  return prompts[index];
}

// DELETE by ID
function deletePrompt(id) {
  const index = prompts.findIndex(p => p.id === id);
  if (index === -1) return null;
  return prompts.splice(index, 1)[0];
}

module.exports = { getPrompts, addPrompt, updatePrompt, deletePrompt };
