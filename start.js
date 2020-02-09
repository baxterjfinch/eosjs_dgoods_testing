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

//////////////////////////////
//     CHECK README FOR     //
//       INSTRUCTIONS       //
//////////////////////////////

const contractAccount = "";
const contractPrivateKey = "";

const secondAccount = "";
const secondAccountPrivateKey = "";

const buyerAccount = "";
const buyerAccountPrivateKey = "";


// ///////////////////////////
//    NODE CONNECTION INFO  //
//       INFORMATION        //
// ///////////////////////////

const signatureProvider = new JsSignatureProvider([contractPrivateKey]);
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


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
    AccountInfo.Login(eoslime, req.body.user, req.body.key).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    })
})

app.get('/api/marketplace', (req, res) => {
    Dgoods.GetTokensForSale(rpc, contractAccount, contractAccount).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
})

///////////////////////////////
//         TEST DATA         //
///////////////////////////////

let testCreateTokenData = {
  "issuer": contractAccount,
  "rev_partner": contractAccount,
  "category": "testcat",
  "token_name": "testname",
  "fungible": false,
  "burnable": true,
  "sellable": true,
  "transferable": true,
  "rev_split": 0,
  "base_uri": "https://myticketingsite.com/concert1/ticket1/",
  "max_issue_days": 0,
  "max_supply": "1000 DOOPS"
}

let testIssueTokenData = {
  "to": contractAccount,
  "category": testCreateTokenData.category,
  "token_name": testCreateTokenData.token_name,
  "quantity": "5 DOOPS",
  "relative_uri": "",
  "memo": "have some of mine!"
}

let testCreateFungibleTokenData = {
  "issuer": contractAccount,
  "rev_partner": contractAccount,
  "category": "fungiblecat",
  "token_name": "fungibletest",
  "fungible": true,
  "burnable": true,
  "sellable": true,
  "transferable": true,
  "rev_split": 0,
  "base_uri": "https://myticketingsite.com/concert1/ticket1/",
  "max_issue_days": 0,
  "max_supply": "100000 DOOPS"
}

let testIssueFungibleTokenData = {
  "to": secondAccount,
  "category": testCreateFungibleTokenData.category,
  "token_name": testCreateFungibleTokenData.token_name,
  "quantity": "5000 DOOPS",
  "relative_uri": "",
  "memo": "have some of mine!"
}


//////////////////////////////////
//         TEST FUNCTIONS       //
//      (some may be broken)    //
//////////////////////////////////

// UpdatePermissions.UpdatePermissions(eoslime, secondAccount, secondAccountPrivateKey, "eosio.code");
// DeployContract(api, { account: account, contractDir: "./contract" })

// Dgoods.SetConfig(api, account, "DOOPS", "1.0");
// Dgoods.CreateToken(api, account, testCreateFungibleTokenData);
// Dgoods.IssueToken(api, account, testIssueTokenData);
// Dgoods.GetAllDgoodTables(rpc, account, 'dgood');
// Dgoods.GetTableRows(rpc, 'dgood', account);
// Dgoods.GetCatagoryTable(rpc, account, testCreateFungibleTokenData.category, 'dgoodstats');
// Dgoods.GetCatagoryTable(rpc, account, testIssueTokenData.category, 'dgoodstats');
// Dgoods.GetAccountTokens(rpc, contractAccount, secondAccount, 'accounts');
// Dgoods.TransferNFT(api, account, secondAccount, [35, 36], "memo test");
// Dgoods.TransferFT(api, account, secondAccount, buyerAccount, testIssueFungibleTokenData.category, testIssueFungibleTokenData.token_name, "100 DOOPS", "memo test");
// Dgoods.BurnNFTTokens(api, account, secondAccount, [5])
// Dgoods.BurnFTTokens(api, account, secondAccount, 3, "25 DOOPS")
// Dgoods.CancelNFTSale(api, account, secondAccount, 5);
// Dgoods.SubmitTokenForSale(api, account, secondAccount, [15], "1.0000 EOS");
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
