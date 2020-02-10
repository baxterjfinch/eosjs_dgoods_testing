export default class SellTokenPanel {
    constructor(selector, name) {
        this._dom = document.getElementById(selector);
        this.name = name;
        this._state = true;
    }

    Render() {
        this._dom.innerHTML = `
            <div id="sell_token_slider" class="sell-token-slider">
                <div class="sell-token-header">Selling: </div><div class="sell-token-info">${this.name}</div>
                <input class="sell-token-price" placeholder="Set A Price"></input>
                <div id="submit_sell_order" class="submit-sell-button">Submit Sale Order</div>
            </div>
        `;
        document.getElementById('sell_token_slider').style.left = "-393px";
        document.getElementById('sell_token_slider').style.width = "400px";
    }

    Destroy() {
        $("#sell_token_slider").remove();
    }


    RenderEventListener() {

    }
}
