# YNABStockUpdater
auto-updates YNAB accounts that track stock and crypto portfolio 

## How To Use

### Get a YNAB Personal Access Token
Get a YNAB personal access token ([instructions here](https://api.youneedabudget.com/#authentication)) and paste it where `ADD_TOKEN_HERE` is in `index.gs`

### Get your Budget ID
Get the budget ID of your YNAB budget and paste it where `BUDGET_ID` is in `index.gs`
- get this when you go to https://app.youneedabudget.com and it's the first UUID in the URL.
  -  if the URL is `https://app.youneedabudget.com/692f3061-c21d-4493-af50-13c71b3ce2e3/budget` then paste in `692f3061-c21d-4493-af50-13c71b3ce2e3`.

### Get your Stocks Account ID
Get the account ID of your stocks account and paste it where `INDEX_FUND_ACCOUNT_ID` is in `index.gs`
- get this by clicking into the account in YNAB and it's the UUID in the URL after `/account/`. 
  -  if the URL is `https://app.youneedabudget.com/692f3061-c21d-4493-af50-13c71b3ce2e3/account/6bebabe2-c6d9-4d60-b570-c4e15c36ac53` then paste in `6bebabe2-c6d9-4d60-b570-c4e15c36ac53`.


### Get your Crypto Account ID
Get the account ID of your stocks account and paste it where `COINBASE_ACCOUNT_ID` is in `index.gs`
- get this by clicking into the account in YNAB and it's the UUID in the URL after `/account/`. 
  -  if the URL is `https://app.youneedabudget.com/692f3061-c21d-4493-af50-13c71b3ce2e3/account/89cd2147-9591-4a05-b954-aa43a82984cc` then paste in `89cd2147-9591-4a05-b954-aa43a82984cc`.

## How to trigger
I trigger this script twice daily; once at market-open and once at market-close. 

Here's a screenshot of how to trigger it in google apps:
<img width="1312" alt="image" src="https://user-images.githubusercontent.com/982253/146009002-a5f09cd9-8553-4156-b0ef-07c2d45495c0.png">
