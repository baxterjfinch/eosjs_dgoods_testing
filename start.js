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


const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('https://api.jungle.alohaeos.com:443', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });




////////////////////
// TEST FUNCTIONS //
////////////////////

let testCreateTokenData = {
  "issuer": account,
  "rev_partner": account,
  "category": "ownercat",
  "token_name": "ownertok",
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
  "quantity": "5 TEST",
  "relative_uri": "",
  "memo": "Enjoy the concert!"
}
// Utils.GetContract(api, account);
// Dgoods.GetTableByCategory(rpc, testCreateTokenData.issuer, testCreateTokenData.category);
// Dgoods.GetTableRows(rpc, 'dgood', account);
// Dgoods.GetCatagoryTable(rpc, account, testCreateTokenData.category, 'dgoodstats');
// Dgoods.GetAllDgoodTables(rpc, account, 'dgood');
// Dgoods.CreateToken(api, testCreateTokenData);
Dgoods.IssueToken(api, account, testIssueTokenData);
// Dgoods.SetConfig(api, account, symbol, version);
// Utils.SaveAccountAbi(rpc, account);
// DeployContract(api, { account: "mythicalgood", contractDir: "./contract" })
// CreateAccount(api, account, eosio, eosPub);
// stakeResources();
// Utils.BuyEosRam(api, account, receiver);
// GetAccount(rpc, account);
// Dgoods.UpdatePermissions(rpc, api, account, publicKey);
// Dgoods.GetPermissions(rpc, account);
