module.exports = {
  SetConfig(api, account, symbol, version) {
    api.transact({
      actions: [{
        account: account,
        name: 'setconfig',
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: {
          "symbol": symbol,
          "version": version
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  GetTableRows(rpc, table, account) {
      return new Promise((resolve, reject) => {
          rpc.get_table_rows({
            json: true,               // Get the response as json
            code: account,      // Contract that we target
            scope: account,         // Account that owns the data
            table: table,        // Table name
            limit: 100,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
          }).then((results) => {
            resolve(results);
          }).catch((err) => {
            reject(err);
          });
      })
  },

  GetCatagoryTable(rpc, account, category, table) {
    rpc.get_table_rows({
      json: true,               // Get the response as json
      code: account,      // Contract that we target
      scope: category,         // Account that owns the data
      table: table,        // Table name
      limit: 10,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: false          // Optional: Show ram payer
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  GetAllDgoodTables(rpc, account, table) {
    rpc.get_table_rows({
      json: true,               // Get the response as json
      code: account,      // Contract that we target
      scope: account,         // Account that owns the data
      table: table,        // Table name
      limit: 50,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: false          // Optional: Show ram payer
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  async CreateToken(api, contract, account, data) {
    try {
        const result = await api.transact({
          actions: [{
            account: contract,
            name: 'create',
            authorization: [{
              actor: account,
              permission: 'active',
            }],
            data: data,
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })
        console.log("Trying transaction")
        console.log(result)
        return result
    } catch(e) {
        console.log("transaction failed")
        console.log(e)
        return e
    }
},

  IssueToken(api, account, data) {
    api.transact({
      actions: [{
        account: account,
        name: 'issue',
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: data,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  BurnNFTTokens(api, contract, owner, ids) {
    api.transact({
      actions: [{
        account: contract,
        name: 'burnnft',
        authorization: [{
          actor: owner,
          permission: 'active',
        }],
        data: {
          "owner": owner,
          "dgood_ids": ids
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  BurnFTTokens(api, contract, owner, category_name_id, quantity) {
    api.transact({
      actions: [{
        account: contract,
        name: 'burnft',
        authorization: [{
          actor: owner,
          permission: 'active',
        }],
        data: {
          "owner": owner,
          "category_name_id": category_name_id,
          "quantity": quantity
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  TransferNFT(api, from, to, ids, memo) {
    api.transact({
      actions: [{
        account: from,
        name: 'transfernft',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          "from": from,
          "to": to,
          "dgood_ids": ids,
          "memo": memo
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  TransferFT(api, contract, from, to, category, token_name, quantity, memo) {
    api.transact({
      actions: [{
        account: contract,
        name: 'transferft',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          "from": from,
          "to": to,
          "category": category,
          "token_name": token_name,
          "quantity": quantity,
          "memo": memo
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  SubmitTokenForSale(api, contract, seller, ids, net_sale_amount) {
    api.transact({
      actions: [{
        account: contract,
        name: 'listsalenft',
        authorization: [{
          actor: seller,
          permission: 'active',
        }],
        data: {
          "seller": seller,
          "dgood_ids": ids,
          "net_sale_amount": net_sale_amount
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  CancelNFTSale(api, contract, seller, id) {
    api.transact({
      actions: [{
        account: contract,
        name: 'closesalenft',
        authorization: [{
          actor: seller,
          permission: 'active',
        }],
        data: {
          "seller": seller,
          "batch_id": id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  GetTokensForSale(rpc, contract, scope) {
      return new Promise((resolve, reject) => {
          rpc.get_table_rows({
            json: true,               // Get the response as json
            code: contract,      // Contract that we target
            scope: scope,         // Account that owns the data
            table: 'asks',        // Table name
            limit: 10,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
          }).then((results) => {
            resolve(results);
          }).catch((err) => {
            reject(err);
          });
      })
  },

  BuyTokenForSale(api, contract, buyer, id) {
    api.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: buyer,
          permission: 'active',
        }],
        data: {
          "from": buyer,
          "to": contract,
          "quantity": "1.0000 EOS",
          "memo": `${id},${buyer}`
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  GetTableByCategory(rpc, account, category) {
    rpc.get_table_rows({
      json: true,               // Get the response as json
      code: account,      // Contract that we target
      scope: account,         // Account that owns the data
      table: 'dgoodstats',        // Table name
      limit: 10,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: false          // Optional: Show ram payer
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  GetAccountTokens(rpc, contract, account, table) {
      return new Promise((resolve, reject) => {
          rpc.get_table_rows({
            json: true,               // Get the response as json
            code: contract,      // Contract that we target
            scope: account,         // Account that owns the data
            table: table,        // Table name
            limit: 100,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
          }).then((results) => {
            console.log(results);
            resolve(results);
          }).catch((err) => {
            console.log(err);
            resolve(err);
          });
      })

  },

  UpdatePermissions(rpc, api, account, publicKey) {
    const authorization_object = {
      threshold: 1,
      accounts: [{
        permission: {
          actor: "mythicalgood",
          permission: "eosio.code"
        },
        weight: 1
      }],
      keys: [{
        key: publicKey,
        weight: 1
      }],
      waits: []
    };

    const updateauth_input = {
      account: account,
      permission: 'newperm',
      parent: 'active',
      auth: authorization_object
    };

     api.transact({
       actions: [
        {
          account: 'eosio',
          name: 'updateauth',
          authorization: [{
            actor: account,
            permission: 'active',
          }],
          data: updateauth_input,
        }]
      }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  },


  GetPermissions(rpc, account) {
    rpc.get_account(account).then((result) => {
      let perms = result.permissions;

      for (const perm of perms) {
        console.log(perm.required_auth.accounts)
      }
    })
  }
}
