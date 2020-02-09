export function GetMarketplace() {
    return new Promise((resolve, reject) => {
        $.get("http://127.0.0.1:3000/api/marketplace", (data, code) => {
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
