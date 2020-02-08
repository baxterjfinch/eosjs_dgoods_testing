module.exports = function CreateAccount(api, creator, newAccount, publicKey) {
  api.transact({
    actions: [{
      account: 'eosio',
      name: 'newaccount',
      authorization: [{
        actor: creator,
        permission: 'active',
      }],
      data: {
        creator: creator,
        name: newAccount,
        owner: {
          threshold: 1,
          keys: [{
            key: publicKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: publicKey,
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
        actor: creator,
        permission: 'active',
      }],
      data: {
        payer: creator,
        receiver: newAccount,
        bytes: 1100860,
      },
    },
    {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [{
        actor: creator,
        permission: 'active',
      }],
      data: {
        from: creator,
        receiver: newAccount,
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
  console.log("Account Created");
}
