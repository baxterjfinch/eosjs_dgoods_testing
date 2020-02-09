export default class User {
    constructor(name, pubKey, privKey) {
        this.name = name;
        this.pubKey = pubKey;
        this.privKey = privKey;
        this.assets = {}
    }

    get Username() {
        return this.usernnameame;
    }

    get PublicKey() {
        return this.pubKey;
    }

    get PrivateKey() {
        return this.privKey;
    }

    get Assets() {
        return this.assets;
    }

    set Username(name) {
        this.name = name;
    }

    set PublicKey(publicKey) {
        this.pubKey = publicKey;
    }

    set PrivateKey(privateKey) {
        this.privKey = privateKey;
    }

    set Assets(assets) {
        this.assets = assets;
    }
}
