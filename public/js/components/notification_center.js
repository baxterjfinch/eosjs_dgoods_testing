export default class NotificationCenter {
    constructor(selector) {
        this._selector = selector;
    }

    PushBoughtTokenNotification(text) {
        let container = document.getElementById('notification_item_container')
        let notification = new BoughtTokenNotification(text);
        notification.SetID();
        container.innerHTML += notification.Render();

        setTimeout(() => {
            notification.Destroy();
        }, 6000)
    }

    PushCreateTokenNotification(receipt) {
        let container = document.getElementById('notification_item_container')
        let notification = new CreateTokenNotification(receipt);
        notification.SetID();
        container.innerHTML += notification.Render();

        setTimeout(() => {
            notification.Destroy();
        }, 10000)
    }

    Render() {
        return `
            <div id="notification_item_container" class="notification-center">

            </div>
        `;
    }
}

class BoughtTokenNotification {
    constructor(text) {
        this.text = text;
        this.id;
    }

    Destroy() {
        $(`#${this.id}`).remove();
    }

    SetID() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
    }

    Render() {
        return `
            <div id="${this.id}" class="bought-token-notification">
                <div class="token-purchased-header">Token Purchased!</div>
                <span class="token-purchased-tx">TxId:</span><span class="token-purchased-tx-content"> ${this.text}</span>
            </div>
        `
    }
}

class CreateTokenNotification {
    constructor(receipt) {
        this.data = receipt.processed.action_traces[0].act.data;
        console.log(this.data)
        console.log()
        this.block = receipt.processed.action_traces[0].block_num;
        this.tx = receipt.transaction_id;
        this.id;
    }

    Destroy() {
        $(`#${this.id}`).remove();
    }

    SetID() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
    }

    Render() {
        return `
            <div id="${this.id}" class="create-token-notification">
                <div class="token-purchased-header">Token Created!</div>
                <span class="token-purchased-tx">Created By:</span><span class="token-purchased-tx-content"> ${this.data.issuer}</span>
                <br>
                <span class="token-purchased-tx">Token Name:</span><span class="token-purchased-tx-content"> ${this.data.token_name}</span>
                <br>
                <span class="token-purchased-tx">Max Supply:</span><span class="token-purchased-tx-content"> ${this.data.max_supply}</span>
                <br>
                <span class="token-purchased-tx">Category:</span><span class="token-purchased-tx-content"> ${this.data.category}</span>
                <br>
                <span class="token-purchased-tx">TxId:</span><span class="token-purchased-tx-content"> ${this.tx}</span>
                <br>
                <span class="token-purchased-tx">Block Number:</span><span class="token-purchased-tx-content"> ${this.block}</span>

            </div>
        `
    }
}
