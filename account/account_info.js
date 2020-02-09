module.exports = {

  UpdatePermissions(eoslime, account, pkey, permission) {
      let accountLoaded = eoslime.Account.load(account, pkey);

      if (accountLoaded) {
        accountLoaded.addPermission(permission, 1).then((results) => {
          console.log(results);
        })

      } else {
        console.log("error")
      }

      // console.log(perms);
  },

  Login(eoslime, account, pkey) {
      return new Promise((resolve, reject) => {
          let accountLoaded = eoslime.Account.load(account, pkey);

          if (accountLoaded) {
              resolve(accountLoaded);
          } else {
              reject("failed to get account")
          }
      })

  }
}
