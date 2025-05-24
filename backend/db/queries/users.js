// db/queries/users.js
const { supabase } = require("../supabaseClient");

async function getUserById(user_id) {
  const { data, error } = await supabase
    .from("Users") // 👈 CASE SENSITIVE! Use "Users" not "users"
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getUserById };

