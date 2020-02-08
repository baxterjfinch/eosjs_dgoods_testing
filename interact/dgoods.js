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
    rpc.get_table_rows({
      json: true,               // Get the response as json
      code: account,      // Contract that we target
      scope: account,         // Account that owns the data
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
      limit: 10,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: false          // Optional: Show ram payer
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log(err);
    });
  },

  CreateToken(api, data) {
    api.transact({
      actions: [{
        account: data.issuer,
        name: 'create',
        authorization: [{
          actor: data.issuer,
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
      blocksBehind: 0,
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
