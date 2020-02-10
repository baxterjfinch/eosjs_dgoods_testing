export default class TokenContainer {
    constructor(selector) {
        this._selector = selector;

    }

    Render() {
        return `
            <div class="marketplace-header">Marketplace</div>
            <div id="token_container_main" class="token-container-mason">
            </div>
        `;
    }

    RenderForSaleTokenItems(results) {
        for (const result of results.rows) {
            this._pushForSaleItemToContainer(result);
        }
    }

    _pushForSaleItemToContainer(item) {
        let card = new BatchTokenCard(item);
        document.getElementById("token_container_main").innerHTML += card.Render();
    }
}

class BatchTokenCard {
    constructor(item) {
        this.id = item.batch_id;
        this.dgood_ids = item.dgood_ids;
        this.seller = item.seller;
        this.cost = item.amount;
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

    Render() {
        return `
            <div id="item_${this.id}" class="token-card-mason">
                <div class="main-token-card-class token-cost">${this.cost}</div>
                <div class="main-token-card-class batch-count">IDs In Sale: ${this.getBatchIds(this.dgood_ids)}</div>
                <div class="main-token-card-class token-seller">${this.seller}</div>
                <div class="main-token-card-class token-expiration">${this.expiration}</div>
            </div>
        `
    }
}
