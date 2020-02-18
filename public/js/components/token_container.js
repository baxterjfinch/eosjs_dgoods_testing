export default class TokenContainer {
    constructor(selector, user) {
        this._selector = selector;
        this._user = user;
        this._unowned_marketplace_tokens = {};
        this._owned_marketplace_tokens = {};
    }
    // <div class="marketplace-header">Marketplace</div>

    Render() {
        return `
            <div id="token_container_main" class="token-container-mason">
            </div>
        `;
    }

    RenderForSaleTokenItems(results) {
        for (const result of results.rows) {
            this._pushForSaleItemToContainer(result);
        }
        this.RenderPopovers();
        // for (let rendered_card of this._owned_marketplace_tokens) {
        //     rendered_card.RenderEventListeners();
        // }
    }

    RenderPopovers() {
      $('[data-toggle="popover"]').popover()
    }

    DestroyBoughtCard(id) {
        this._unowned_marketplace_tokens[id].Destroy();
    }

    _pushForSaleItemToContainer(item) {
        let card;
        if (item.seller === this._user) {
            card = new OwnedTokenCard(item);
            this._owned_marketplace_tokens[card.id] = card;
        } else {
            card = new UnownedTokenCard(item);
            this._unowned_marketplace_tokens[card.id] = card;
        }

        document.getElementById("token_container_main").innerHTML += card.Render();
        setTimeout(() => {
            card.RenderEventListeners();
        }, 50);

    }
}

class UnownedTokenCard {
    constructor(item) {
        console.log(item);
        this.id = item.batch_id;
        this.dgood_ids = item.dgood_ids;
        this.seller = item.seller;
        this.price = item.amount;
        this.owned = false;
        this.expiration = item.expiration;
        this.image = `<img src="../../images/coins.png" alt="Sale Image" height="150" width="150">`;
    }

    RenderEventListeners() {
        document.getElementById(`buy_${this.id}`).addEventListener('click', () => {
            console.log(this.id);
            let event = new CustomEvent("buy_token", {
              detail: {
                buyer: localStorage.getItem('user'),
                pkey : localStorage.getItem('privateKey'),
                id: this.id,
                price: this.price,
                seller: this.seller
              }
            });
            document.dispatchEvent(event);
        })
    }

    Destroy() {
        document.getElementById(`item_${this.id}`).classList.add('animated', 'bounceOutLeft')
        setTimeout(() => {
            $(`#item_${this.id}`).remove();
        }, 500)
    }

    getBatchIds(batch) {
        let ids = "";
        for (const id of batch) {
            ids = ids + `${id} `
        }

        return ids
    }
    // <div class="token-card-image">${this.image}</div>

    Render() {
        return `
            <div id="item_${this.id}" class="token-card-mason">
                <div class="main-token-card-class token-cost">${this.price}</div>
                <div class="main-token-card-class batch-count">IDs In Sale: ${this.getBatchIds(this.dgood_ids)}</div>
                <div class="main-token-card-class token-seller">${this.seller}</div>
                <div class="main-token-card-class token-expiration">${this.expiration}</div>
                <button id="buy_${this.id}" class="buy-token-button">Buy</div>
            </div>
        `
    }
}


class OwnedTokenCard {
    constructor(item) {
        console.log(item);
        this.id = item.batch_id;
        this.dgood_ids = item.dgood_ids;
        this.seller = item.seller;
        this.cost = item.amount;
        this.owned = false;
        this.expiration = item.expiration;
        this.image = `<img src="../../images/coins.png" alt="Sale Image" height="150" width="150">`;
    }

    getBatchIds(batch) {
        let ids = "";
        for (const id of batch) {
            ids = ids + `${id} `
        }

        return ids
    }
    // <div class="token-card-image">${this.image}</div>

    RenderEventListeners() {

    }

    Render() {
        return `
            <div id="item_${this.id}" class="token-card-mason">
                <a tabindex="${this.id}" class="owned-marketplace-identifier" role="button" class="btn btn-lg btn-danger" data-toggle="popover" data-trigger="focus" data-content="In your wallet!"><i class="fa fa-star"></i></a>
                <div class="main-token-card-class token-cost">${this.cost}</div>
                <div class="main-token-card-class batch-count">IDs In Sale: ${this.getBatchIds(this.dgood_ids)}</div>
                <div class="main-token-card-class token-seller">${this.seller}</div>
                <div class="main-token-card-class token-expiration">${this.expiration}</div>
            </div>
        `
    }
}
