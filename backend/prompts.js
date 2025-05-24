// db/queries/prompts.js

const { supabase } = require("../supabaseClient");

async function getPromptsByUserId(user_id) {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function updatePrompt(id, content) {
  const { data, error } = await supabase
    .from("prompts")
    .update({ content })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

module.exports = {
  getPromptsByUserId,
  updatePrompt
};
