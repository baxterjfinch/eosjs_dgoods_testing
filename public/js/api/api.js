export function GetMarketplace() {
    return new Promise((resolve, reject) => {
        $.get("http://127.0.0.1:3000/api/marketplace", (data, code) => {
            if(code === "success") {
                console.log(data)
                resolve(data);
            } else {
                reject(code)
            }
        });
    })
}

export function GetWalletOwnedItemsContents(user) {
    return new Promise((resolve, reject) => {
        $.get("http://127.0.0.1:3000/api/user/tokens", {user: user}, (data, code) => {
            if(code === "success") {
                resolve(data);
            } else {
                reject(code)
            }
        });
    })
}

export function GetUnissuedTokens(user) {
    return new Promise((resolve, reject) => {
        $.get("http://127.0.0.1:3000/api/user/unissued_tokens", {user: user}, (data, code) => {
            if(code === "success") {
                resolve(data);
            } else {
                reject(code)
            }
        });
    })
}

export function Login(key, user) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://127.0.0.1:3000/api/login",
            type: "POST",
            data: {
                key: key,
                user: user
            }
        }).then((res) =>{
            console.log(res)
            if (res.name) {
                resolve(res);
            } else {
                reject("account does not exist")
            }
        }).catch((err) => {
            console.log(err)
        })
    })
}

export function BuyToken(pkey, buyer, id, price, seller) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://127.0.0.1:3000/api/buy_token",
            type: "POST",
            data: {
                pkey: pkey,
                buyer: buyer,
                id: id,
                price: price,
                seller: seller
            }
        }).then((res) =>{
            if (res.transaction_id) {
                resolve(res);
            } else {
                reject("Purchase failed")
            }
        }).catch((err) => {
            console.log(err)
        })
    })
}

export function CreateToken(details) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://127.0.0.1:3000/api/create_token",
            type: "POST",
            data: details
        }).then((res) =>{
            resolve(res);
        }).catch((err) => {
            console.log(err)
        })
    })
}
