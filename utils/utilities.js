module.exports = {
  GetContract(api, account) {
    api.getContract(account).then((results)=> {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    })
  },

  BuyEosRam(api, account, receiver) {
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
          receiver: receiver,
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
  },

  SaveAccountAbi(rpc, account) {
    rpc.get_raw_code_and_abi(account).then((results) => {
      fs.writeFile('raw_code_returned.txt', results, (err) => {
        console.log(err);
      })
    })
  }
}
