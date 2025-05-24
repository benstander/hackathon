const { supabase } = require("../supabaseClient");

async function getTransactionsByUserId(user_id) {
  const { data, error } = await supabase
    .from("transactions") // ✅ lowercase table name
    .select("*")
    .eq("user_id", user_id);

  if (error) throw error;
  return data;
}

async function insertTransactions(user_id, txList) {
  const formatted = txList.map(tx => ({
    ...tx,
    user_id,
  }));

  const { data, error } = await supabase
    .from("transactions") // ✅ lowercase table name
    .insert(formatted)
    .select();

  if (error) throw error;
  return data;
}

module.exports = {
  getTransactionsByUserId,
  insertTransactions,
};
