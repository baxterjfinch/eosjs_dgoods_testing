const fs = require(`fs`)
const path = require(`path`)
const fetch = require('node-fetch');
const { Api, JsonRpc, RpcError, Serialize} = require('eosjs');
const { TextEncoder, TextDecoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

const GetAccount = require("./account/get_account.js");
const CreateAccount = require("./account/create_account.js");
const Utils = require ("./utils/utilities.js");
const DeployContract = require("./utils/deploy_contract.js");
const Dgoods = require("./interact/dgoods.js");

//////////////////////
// CHECK README FOR //
//   INSTRUCTIONS   //
//////////////////////
const account = "<ACCOUNT_NAME>";
const defaultPrivateKey = "<OWNER_PRIVATE_KEY>";
const publicKey = "<OWNER_PUBLIC_KEY>";

// Create a second account in cleos if
// you want to test acct to acct transfers
const secondAccount = account;


///////////////////////////
//  NODE CONNECTION INFO //
//     INFORMATION       //
///////////////////////////

const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

////////////////////
//   TEST DATA    //
////////////////////

let testCreateTokenData = {
  "issuer": account,
  "rev_partner": account,
  "category": "concert1",
  "token_name": "ticket1",
  "fungible": false,
  "burnable": false,
  "sellable": true,
  "transferable": false,
  "rev_split": 0.05,
  "base_uri": "https://myticketingsite.com/concert1/ticket1/",
  "max_issue_days": 0,
  "max_supply": "1000 TEST"
}

let testIssueTokenData = {
  "to": secondAccount,
  "category": testCreateTokenData.category,
  "token_name": testCreateTokenData.token_name,
  "quantity": "5 TCKT",
  "relative_uri": "",
  "memo": "Enjoy the concert!"
}

//////////////////////////////////
//         TEST FUNCTIONS       //
//      (some may be broken)    //
//////////////////////////////////

// Dgoods.SetConfig(api, account, symbol, version);
// Dgoods.CreateToken(api, testCreateTokenData);
// Dgoods.IssueToken(api, account, testIssueTokenData);
// Dgoods.GetAllDgoodTables(rpc, account, 'dgood');
// Dgoods.GetTableRows(rpc, 'dgood', account);
// Dgoods.GetTableByCategory(rpc, testCreateTokenData.issuer, testCreateTokenData.category);
// Dgoods.GetCatagoryTable(rpc, account, testCreateTokenData.category, 'dgoodstats');
// Utils.GetContract(api, account);
// Utils.SaveAccountAbi(rpc, account);
// DeployContract(api, { account: "mythicalgood", contractDir: "./contract" })
// CreateAccount(api, account, eosio, eosPub);
// Utils.BuyEosRam(api, account, receiver);
// GetAccount(rpc, account);
// Dgoods.UpdatePermissions(rpc, api, account, publicKey);
// Dgoods.GetPermissions(rpc, account);
