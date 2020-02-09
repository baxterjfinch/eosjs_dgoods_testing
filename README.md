![Front-end Marketplace and Wallet Access](https://imgur.com/a/wyUkHws)



1.) Create Two KeyPairs and save output:

    contract owner
    $ cleos create key --to-console

    contract active
    $ cleos create key --to-console


2.) Create a wallet named mythicalgood:

    $ cleos wallet create -n mythicalgood


3.) Import private keys into wallet:

    $ cleos wallet import <OWNER_PRIVATE_KEY> -n mythicalgood
    $ cleos wallet import <ACTIVE_PRIVATE_KEY> -n mythicalgood


4.) Create account, importing both public keys:

    $ cleos create account eosio mythicalgood <OWNER_PUB_KEY> <ACTIVE_PUB_KEY>


5.) Follow Example dGoods Usage, replacing all instances of `dgood.token`
    with the account name above:

    https://github.com/hemlokc/dgoods/blob/master/example_usage.md

6.) Fill start.js:18, 19, & 20 with appropriate values in order to test
    contract interaction via eosjs instead of cleos
