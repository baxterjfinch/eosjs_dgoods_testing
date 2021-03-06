const fs = require(`fs`);
const path = require(`path`);
const express = require(`express`);
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { TextEncoder, TextDecoder } = require('util');
const { Api, JsonRpc, RpcError, Serialize} = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const eoslime = require('eoslime').init('local', { url: 'https://127.0.0.1:8888', chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' });

const Dgoods = require("./interact/dgoods.js");
const Utils = require ("./utils/utilities.js");
const GetAccount = require("./account/get_account.js");
const CreateAccount = require("./account/create_account.js");
const AccountInfo = require("./account/account_info.js");
const TokenDataUtilities = require("./utils/process_unissued_tokens_for_user");

//////////////////////////////
//     CHECK README FOR     //
//       INSTRUCTIONS       //
//////////////////////////////

const contractAccount = "dgoods.token";
const contractPrivateKey = "5KF2Wvq1bpBGK35RRDNuLWw2DT3PK4jBKdkou8qDcBnZzJmE9Eh";

const secondAccount = "test.account";
const secondAccountPrivateKey = "5JwDmwUGL9yjzBK9dStD6Zy6bm92k6ZNJ1x7Wsa1LKTkP3tS2xY";

const buyerAccount = "sell.account";
const buyerAccountPrivateKey = "5J5z4zMCbf7fy1yTVahm3M7x8MQBPH6xBBkHmbAMWAzK5yLSDdQ";

// ///////////////////////////
//    NEED TO MAKE DYNAMIC  //
//  FOR MULTIPLE CONTRACTS  //
// ///////////////////////////

const contractName = "dgoods.token";
const contractSymbol = "DGDS";

// ///////////////////////////
//    NODE CONNECTION INFO  //
//       INFORMATION        //
// ///////////////////////////

const rpc = new JsonRpc('http://localhost:8888', { fetch });
// let signatureProvider;
// let api;
let signatureProvider = new JsSignatureProvider([contractPrivateKey]);
let api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

///////////////////////////////
//          EXPRESS          //
///////////////////////////////
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post('/api/login', (req, res) => {
     signatureProvider = new JsSignatureProvider([req.body.key]);
     api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    AccountInfo.Login(eoslime, req.body.user, req.body.key).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});

app.post('/api/create_token', (req, res) => {
    // let pkey = req.body.pkey;
    let pkey = contractPrivateKey;
    let signatureProvider = new JsSignatureProvider([pkey]);
    let rpc = new JsonRpc('http://localhost:8888', { fetch });
    let api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    let testCreateFungibleTokenData = {
        "issuer": contractAccount,
        "rev_partner": req.body.user,
        "category": req.body.category.toLowerCase(),
        "token_name": req.body.name.toLowerCase(),
        "fungible": req.body.fungible == 'true',
        "burnable": req.body.burnable == 'true',
        "sellable": req.body.sellable == 'true',
        "transferable": req.body.transferable == 'true',
        "rev_split": req.body.split,
        "base_uri": req.body.uri,
        "max_issue_days": req.body.midays,
        "max_supply": req.body.supply + ` ${contractSymbol}`
    }
    let transactionDetails = Dgoods.CreateToken(api, contractAccount, req.body.user, testCreateFungibleTokenData)
    .then((response) => {

        let testIssueTokenData = {
          "to": req.body.user,
          "category": req.body.category.toLowerCase(),
          "token_name": req.body.name.toLowerCase(),
          "quantity": `${req.body.supply} ${contractSymbol}`,
          "relative_uri": "",
          "memo": "issuing new tokens"
        }

        return Dgoods.IssueToken(api, contractAccount, testIssueTokenData);

    }).then((res) => {
        res.send(res);
    }).catch((err) => {
        res.send(err);
    });
});

// GetAccountTokens(rpc, contract, account, table)
app.get('/api/user/tokens', (req, res) => {
    Dgoods.GetAccountTokens(rpc, contractName, req.query.user, 'accounts').then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    })
});

app.get('/api/user/unissued_tokens', (req, res) => {
    Dgoods.GetAllDgoodTables(rpc, contractAccount, 'dgood').then((response) => {
        let processedTokens = TokenDataUtilities.GetUsersUnissuedTokens(req.query.user, response);
        res.send(processedTokens);
    }).catch((err) => {
        res.send(err);
    })
});

app.get('/api/marketplace', (req, res) => {
    Dgoods.GetTokensForSale(rpc, contractAccount, contractAccount).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});

app.post('/api/buy_token', (req, res) => {
    let token = req.body.id;
    let buyer = req.body.buyer;
    let pkey = req.body.pkey;
    let price = req.body.price;
    let seller = req.body.seller;

    let signatureProvider = new JsSignatureProvider([pkey]);
    let rpc = new JsonRpc('http://localhost:8888', { fetch });
    let api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    Dgoods.BuyTokenForSale(api, seller, buyer, token, price).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
})
///////////////////////////////
//         TEST DATA         //
///////////////////////////////

// let testCreateTokenData = {
//   "issuer": contractAccount,
//   "rev_partner": contractAccount,
//   "category": "testcat",
//   "token_name": "testname",
//   "fungible": false,
//   "burnable": true,
//   "sellable": true,
//   "transferable": true,
//   "rev_split": 0,
//   "base_uri": "https://myticketingsite.com/concert1/ticket1/",
//   "max_issue_days": 0,
//   "max_supply": "1000 DOOPS"
// }
//
// let testIssueTokenData = {
//   "to": secondAccount,
//   "category": ".est.at",
//   "token_name": ".est.ame",
//   "quantity": "100 DGDS",
//   "relative_uri": "",
//   "memo": "have some of mine!"
// }
//
// let testCreateFungibleTokenData = {
//   "issuer": null,
//   "rev_partner": null,
//   "category": null,
//   "token_name": null,
//   "fungible": null,
//   "burnable": null,
//   "sellable": null,
//   "transferable": null,
//   "rev_split": null,
//   "base_uri": null,
//   "max_issue_days": null,
//   "max_supply": null
// }

// let testIssueFungibleTokenData = {
//   "to": secondAccount,
//   "category": testCreateFungibleTokenData.category,
//   "token_name": testCreateFungibleTokenData.token_name,
//   "quantity": "5000 DOOPS",
//   "relative_uri": "",
//   "memo": "have some of mine!"
// }


//////////////////////////////////
//         TEST FUNCTIONS       //
//      (some may be broken)    //
//////////////////////////////////

// AccountInfo.UpdatePermissions(eoslime, secondAccount, secondAccountPrivateKey, "eosio.code");
// DeployContract(api, { account: contractAccount, contractDir: "./contract" })

// Dgoods.SetConfig(api, contractAccount, "DGDS", "1.0");
// Dgoods.CreateToken(api, account, testCreateFungibleTokenData);
// Dgoods.IssueToken(api, contractAccount, testIssueTokenData);
// Dgoods.GetAllDgoodTables(rpc, contractAccount, 'dgood');
// Dgoods.GetTableRows(rpc, 'dgoodstats', contractAccount);
// Dgoods.GetCatagoryTable(rpc, contractAccount, '.est.at', 'dgoodstats');
// Dgoods.GetCatagoryTable(rpc, account, testIssueTokenData.category, 'dgoodstats');
// Dgoods.GetAccountTokens(rpc, contractAccount, contractAccount, 'accounts');
// Dgoods.TransferNFT(api, account, secondAccount, [35, 36], "memo test");
// Dgoods.TransferFT(api, account, secondAccount, buyerAccount, testIssueFungibleTokenData.category, testIssueFungibleTokenData.token_name, "100 DOOPS", "memo test");
// Dgoods.BurnNFTTokens(api, account, secondAccount, [5])
// Dgoods.BurnFTTokens(api, account, secondAccount, 3, "25 DOOPS")

// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [6], "1.0250 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [2], "1.3050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [3], "0.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [27], "3.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [28], "1.3450 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [29], "1.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [34], "1.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [35], "1.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [36], "1.0050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [38], "1.0050 EOS");
//
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [39, 40], "1.0450 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [41, 42, 43, 44, 45], "2.0500 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [47], "1.5050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [48], "1.4050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [49], "1.3050 EOS");
// Dgoods.SubmitTokenForSale(api, contractAccount, secondAccount, [50, 51], "1.1050 EOS");

// Dgoods.SubmitTokenForSale(api, contractAccount, contractAccount, [8], "1.0050 EOS");
// Dgoods.GetTokensForSale(rpc, account, account);
// Dgoods.BuyTokenForSale(api, account, buyerAccount, 15);
// Utils.GetContract(api, account);
// Utils.SaveAccountAbi(rpc, account);
// CreateAccount(api, account, eosio, eosPub);
// Utils.BuyEosRam(api, account, receiver);
// GetAccount(rpc, account);
// Dgoods.UpdatePermissions(rpc, api, account, publicKey);


function DeployContract(api, {account, contractDir}) {
  const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir)
  // 1. Prepare SETCODE
  // read the file and make a hex string out of it
  const wasm = fs.readFileSync(wasmPath).toString(`hex`);

  // 2. Prepare SETABI
  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  })

  let abiJSON  = JSON.parse(fs.readFileSync(abiPath, `utf8`));
  let abiDefinitions = api.abiTypes.get(`abi_def`);

  abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abiJSON
    )
  abiDefinitions.serialize(buffer, abiJSON);

  let serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex');
  // need to make sure abi has every field in abiDefinition.fields
  // otherwise serialize throws
  api.transact(
    {
      actions: [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: account,
              permission: 'active',
            },
          ],
          data: {
            account: account,
            vmtype: 0,
            vmversion: 0,
            code: wasm,
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [
            {
              actor: account,
              permission: 'active',
            },
          ],
          data: {
            account: account,
            abi: serializedAbiHexString,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  ).then((results) => {
    console.log(results);
  }).catch((err) => {
    console.log(err);
  })
}

function getDeployableFilesFromDir(dir) {
  const dirCont = fs.readdirSync(dir)
  const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi))
  const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi))

  if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`)
  if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`)

  return {
    wasmPath: path.join(dir, wasmFileName),
    abiPath: path.join(dir, abiFileName),
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
