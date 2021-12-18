YNAB_PERSONAL_TOKEN = "ADD_TOKEN_HERE"
BASE_YNAB_API_URL = "https://api.youneedabudget.com/v1"
BUDGET_ID = "ADD_ID_OF_BUDGET"
INDEX_FUND_ACCOUNT_ID = "ADD_YNAB_ACCOUNT_ID_OF_BUDGET"
COINBASE_ACCOUNT_ID = "ADD_YNAB_ACCOUNT_ID_OF_COINBASE"
SHEET_ID = "ADD_GOOGLE_SHEET_ID"
ROW_WITH_TOTAL_INDEX_FUND_ASSETS = "5"
COLUMN_WITH_TOTAL_INDEX_FUND_ASSETS = "7"
ROW_WITH_TOTAL_CRYPTO_ASSETS = "5"
COLUMN_WITH_TOTAL_CRYPTO_ASSETS = "5"


function call_ynab_api(method, endpoint, payload=null) {
  var options = {
    'method': method,
    'muteHttpExceptions': true, 
    'headers': {'Authorization': 'Bearer ' + YNAB_PERSONAL_TOKEN}
  }
  if (payload) {
    options['payload'] = JSON.stringify(payload);
    options['headers']["Content-Type"] = "application/json";
  }
  
  var response = UrlFetchApp.fetch(BASE_YNAB_API_URL + endpoint, options);
  var json = response.getContentText();
  return JSON.parse(json).data;
}

function get_current_ynab_index_fund() {
  var res = call_ynab_api("get", "/budgets/" + BUDGET_ID + "/accounts/" + INDEX_FUND_ACCOUNT_ID);
  return res.account.cleared_balance;
}

function get_current_ynab_coinbase() {
  var res = call_ynab_api("get", "/budgets/" + BUDGET_ID + "/accounts/" + COINBASE_ACCOUNT_ID);
  return res.account.cleared_balance;
}

function get_updated_index_fund_assets_from_google_sheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Dashboard');
  var range = sheet.getRange(ROW_WITH_TOTAL_INDEX_FUND_ASSETS,COLUMN_WITH_TOTAL_INDEX_FUND_ASSETS); 
  return range.getValue() * 1000;
}

function get_updated_crypto_assets_from_google_sheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Dashboard');
  var range = sheet.getRange(ROW_WITH_TOTAL_CRYPTO_ASSETS,COLUMN_WITH_TOTAL_CRYPTO_ASSETS); 
  return range.getValue() * 1000;
}

function post_transaction_to_update_account(needed_transaction, account_id, payee_name) {
  var endpoint = "/budgets/" + BUDGET_ID + "/transactions";
  var payload = {
    "transaction": {
      "account_id": account_id,
      "amount": needed_transaction,
      "date": Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'),
      "payee_name": payee_name,
      "memo": (new Date().getHours() >= 12) ? "Market Close" : "Market Open",
      "cleared": "cleared",
      "approved": true
    }
  };
  var res = call_ynab_api("post", endpoint, payload)
  return res;
}

function reconcile_index_funds() {
  var current_ynab_index_fund = get_current_ynab_index_fund();
  var updated_index_fund_assets_from_google_sheet = get_updated_index_fund_assets_from_google_sheet()

  var index_fund_difference = updated_index_fund_assets_from_google_sheet - current_ynab_index_fund
  if(index_fund_difference > 1 || index_fund_difference < -1) {
    post_transaction_to_update_account(Math.round(index_fund_difference), INDEX_FUND_ACCOUNT_ID, "Stock Market");
  }
}

function reconcile_crypto() {
  var current_ynab_coinbase = get_current_ynab_coinbase();
  var updated_crypto_assets_from_google_sheet = get_updated_crypto_assets_from_google_sheet()

  var crypto_difference = updated_crypto_assets_from_google_sheet - current_ynab_coinbase
  if(crypto_difference > 1 || crypto_difference < -1) {
    post_transaction_to_update_account(Math.round(crypto_difference), COINBASE_ACCOUNT_ID, "Crypto Gods");
  }
}

function reconcile_ynab_account() {
  reconcile_index_funds();
  reconcile_crypto();
}
