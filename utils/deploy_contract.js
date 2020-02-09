module.exports = function DeployContract(fs, api, {account, contractDir}) {
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
