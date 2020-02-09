export default class Wallet {
    constructor() {
        this._state = false;
    }

    TogglePanel() {
        if (!this._state) {
            document.getElementById('wallet_container').style.width = "40%";
            document.getElementById('wallet_container').style.right = "0px";
            this._state = true;
        } else {
            document.getElementById('wallet_container').style.width = "100px";
            document.getElementById('wallet_container').style.right = "-95px";
            this._state = false;
        }
    }

    Render() {
        return `
            <div id="wallet_panel" class="wallet-panel">


            </div>
        `
    }
}
