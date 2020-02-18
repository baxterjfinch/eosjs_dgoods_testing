import SellTokenPanel from "./sell_token_panel.js";

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
        for(const token of tokens.rows) {
            let card = new WalletOwnedToken(token);
            document.getElementById('owned_tokens_container').innerHTML += card.Render();
            setTimeout(() => {
                card.RenderEventListener();
            }, 100)
        }
    }

    RenderUnissuedTokens(tokens) {
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
            <div id="sell_item_panel" class="sell-item-panel"></div>
            <div id="wallet_panel" class="wallet-panel">
                <div class="owned-items-container">
                    <div class="owned-tokens-header">
                        <div class="token-header-name">Token Name</div>
                        <div class="token-header-category">Category</div>
                        <div class="token-header-amount">Amount</div>
                    </div>
                    <div id="owned_tokens_container" class="owned-tokens-panel"></div>
                </div>
                <div class="unissued-items-container">
                    <div class="unissued-tokens-header">
                        Unissued Tokens
                    </div>
                    <div id="unissued_tokens_container" class="unissued-tokens-panel"></div>
                </div>
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

    RenderEventListener() {
        document.getElementById(`${this.category_name_id}_${this.name}`).addEventListener('mouseenter', () => {
            document.getElementById(`${this.name}_sell`).style.width = "100px";
            document.getElementById(`${this.name}_sell`).style.visibility = "unset";
        });

        document.getElementById(`${this.category_name_id}_${this.name}`).addEventListener('mouseleave', () => {
            document.getElementById(`${this.name}_sell`).style.width = "0px";
            document.getElementById(`${this.name}_sell`).style.visibility = "hidden";
        });

        document.getElementById(`${this.name}_sell`).addEventListener('click', () => {
            this.sellPanel = new SellTokenPanel('sell_item_panel', this.name);
            this.sellPanel.Render();

            const outsideClickListener = event => {
                if (!document.getElementById('sell_item_panel').contains(event.target) && event.toElement.id !== `${this.name}_sell`) { // or use: event.target.closest(selector) === null
                    // console.log("closing")
                    console.log("closing")
                    // document.getElementById('login_panel').style.top = "-217px";
                    // this._login_panel_state = false;
                    removeClickListener();

                }
            };

            const removeClickListener = () => {
                document.removeEventListener('click', outsideClickListener)
                this.sellPanel.Destroy();
            };

            document.addEventListener('click', outsideClickListener);
        })
    }

    Render() {
        return `
            <div id="${this.category_name_id}_${this.name}" class="owned-wallet-token-item">
                <div id="${this.name}_sell" class="sell-token">Sell</div>
                <div class="wallet-token-name owned-item">${this.name}</div>
                <div class="wallet-token-category owned-item">${this.category}</div>
                <div class="wallet-token-amount owned-item">${this.amount}</div>
            </div>
        `
    }
}
