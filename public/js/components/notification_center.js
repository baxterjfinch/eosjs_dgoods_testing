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
