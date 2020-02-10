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

    RenderOwnedTokens(tokens) {
        console.log(tokens);
        for(const token of tokens.rows) {
            let card = new WalletOwnedToken(token);
            document.getElementById('owned_tokens_container').innerHTML += card.Render();
        }
    }

    RenderUnissuedTokens(tokens) {
        console.log(tokens)
        for(const token of tokens) {
            let card = new WalletToken(token);
            document.getElementById('unissued_tokens_container').innerHTML += card.Render();
        }
    }

    ClearWallet() {
        document.getElementById('owned_tokens_container').innerHTML = ``;
        document.getElementById('unissued_tokens_container').innerHTML = ``;
    }

    Render() {
        return `
            <div id="wallet_panel" class="wallet-panel">
                <div class="owned-tokens-header">
                    <div class="token-header-name">Token Name</div>
                    <div class="token-header-category">Category</div>
                    <div class="token-header-amount">Amount</div>
                </div>
                <div id="owned_tokens_container" class="owned-tokens-panel"></div>

                <div class="unissued-tokens-header">
                    Unissued Tokens
                </div>
                <div id="unissued_tokens_container" class="unissued-tokens-panel"></div>
            </div>
        `
    }
}

class WalletToken {
    constructor(token) {
        this.id = token.id;
        this.serial_number = token.serial_number;
        this.name = token.token_name;
        this.category = token.category;
        this.token_name = token.token_name;
        this.relative_uri = token.relative_uri;
    }

    Render() {
        return `
            <div id="${this.serial_number}_${this.id}" class="owned-wallet-token-item">
                <div class="wallet-token-name owned-item">${this.name}</div>
                <div class="wallet-token-category owned-item">${this.category}</div>

            </div>
        `
    }
}

class WalletOwnedToken {
    constructor(token) {
        this.name = token.token_name;
        this.category = token.category;
        this.category_name_id = token.category_name_id;
        this.amount = token.amount;
    }

    Render() {
        return `
            <div id="${this.category_name_id}_${this.name}" class="owned-wallet-token-item">
                <div class="wallet-token-name owned-item">${this.name}</div>
                <div class="wallet-token-category owned-item">${this.category}</div>
                <div class="wallet-token-amount owned-item">${this.amount}</div>
            </div>
        `
    }
}
