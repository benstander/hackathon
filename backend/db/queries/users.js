// db/queries/users.js
const { supabase } = require("../supabaseClient");

async function getUserById(user_id) {
  const { data, error } = await supabase
    .from("users") 
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) throw error;
  return data;
}

async function createOrUpdateUser(user_id, userData) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user_id,
        ...userData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateUserBasiqId(user_id, basiq_user_id) {
  const { data, error } = await supabase
    .from("users")
    .update({ 
      basiq_user_id: basiq_user_id,
      updated_at: new Date().toISOString()
    })
    .eq("id", user_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getUserByBasiqId(basiq_user_id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("basiq_user_id", basiq_user_id)
    .single();

  if (error) throw error;
  return data;
}

// Bank connections
async function createBankConnection(connectionData) {
  const { data, error } = await supabase
    .from("bank_connections")
    .insert({
      ...connectionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateBankConnectionStatus(connection_id, status, additional_data = {}) {
  const { data, error } = await supabase
    .from("bank_connections")
    .update({
      status,
      ...additional_data,
      updated_at: new Date().toISOString()
    })
    .eq("id", connection_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getBankConnectionsByUserId(user_id) {
  const { data, error } = await supabase
    .from("bank_connections")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Bank accounts
async function createBankAccount(accountData) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      ...accountData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getBankAccountsByUserId(user_id) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select(`
      *,
      bank_connections (
        institution_name,
        status
      )
    `)
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function updateBankAccountBalance(basiq_account_id, balance, available_balance) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update({
      balance,
      available_balance,
      updated_at: new Date().toISOString()
    })
    .eq("basiq_account_id", basiq_account_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { 
  getUserById,
  createOrUpdateUser,
  updateUserBasiqId,
  getUserByBasiqId,
  createBankConnection,
  updateBankConnectionStatus,
  getBankConnectionsByUserId,
  createBankAccount,
  getBankAccountsByUserId,
  updateBankAccountBalance
};

