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
                <div id="submit_sell_order" class="submit-sell-button">Submit Sell Order</div>
            </div>
        `;
        document.getElementById('sell_token_slider').style.left = "calc(50% - 200px)";
        document.getElementById('sell_token_slider').style.width = "400px";
        document.getElementById('sell_token_slider').style.height = "300px";
        document.getElementById('sell_token_slider').style.top = "calc(50% - 150px)";
        document.getElementById('sell_token_slider').style.boxShadow = "0px 1px 4px 0px #214167";
    }

    Destroy() {
        $("#sell_token_slider").remove();
    }


    RenderEventListener() {

    }
}
