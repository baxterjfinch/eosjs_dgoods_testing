const fs = require(`fs`)
const path = require(`path`)
const fetch = require('node-fetch');
const { Api, JsonRpc, RpcError, Serialize} = require('eosjs');
const { TextEncoder, TextDecoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

const account = "";
const defaultPrivateKey = "";


const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('https://api.jungle.alohaeos.com:443', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


function getAccount() {
  rpc.get_account(account).then((result) => {
    console.log(result);
  })
}

function getAndSaveCode() {
  rpc.get_raw_code_and_abi(account).then((results) => {
    fs.writeFile('raw_code_returned.txt', results, (err) => {
      console.log(err);
    })
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

async function buyRamBytes() {
  api.transact({
    actions: [{
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        payer: account,
        receiver: 'hemlocktestr',
        bytes: 1000860,
      },

  }]},
  {
    blocksBehind: 3,
    expireSeconds: 30,
  }).then((results) => {
    console.log(results);
  }).catch((err) => {
    console.log(err);
  });
}

async function createAccount() {
  api.transact({
    actions: [{
      account: 'eosio',
      name: 'newaccount',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        creator: account,
        name: 'mythicaltoke',
        owner: {
          threshold: 1,
          keys: [{
            key: 'EOS62437JywHbJQ8jHKhnKcii62rEqQMUbXsy33M1uX5ejCbJwRTb',
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: 'EOS62437JywHbJQ8jHKhnKcii62rEqQMUbXsy33M1uX5ejCbJwRTb',
            weight: 1
          }],
          accounts: [],
          waits: []
        },
      },
    },
    {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        payer: account,
        receiver: 'mythicaltoke',
        bytes: 1100860,
      },
    },
    {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        from: account,
        receiver: 'mythicaltoke',
        stake_net_quantity: '2.0000 EOS',
        stake_cpu_quantity: '2.0000 EOS',
        transfer: false,
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  }).then((results) => {
    console.log(results);
  }).catch((err) => {
    console.log(err);
  });
}

async function getTableRows() {
  await rpc.get_table_rows({
    json: true,               // Get the response as json
    code: account,      // Contract that we target
    scope: account,         // Account that owns the data
    table: "accounts",        // Table name
    limit: 10,                // Maximum number of rows that we want to get
    reverse: false,           // Optional: Get reversed data
    show_payer: false          // Optional: Show ram payer
  }).then((results) => {
    console.log(results);
  }).catch((err) => {
    console.log(err);
  });
}

async function getContract() {
  api.getContract(account).then((results)=> {
    console.log(results);
  }).catch((err) => {
    console.log(err);
  })
}

async function deployContract({account, contractDir}) {
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


////////////////////
// TEST FUNCTIONS //
////////////////////


// getContract();
// getTableRows();
// getAndSaveCode();
// deployContract({ account: "mythicaltoke", contractDir: "./contract" })
// createAccount();
// stakeResources();
// buyRamBytes();
// getAccount();
