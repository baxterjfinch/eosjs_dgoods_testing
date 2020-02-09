import Navbar from "./components/navbar.js";
import LeftSidebar from "./components/left_sidebar.js";
import TokenContainer from "./components/token_container.js";
import * as API from "./api/api.js";

export default class MainApplication {
    constructor(selector) {
        this._dom = document.getElementById(selector);
        this._navbar = new Navbar('navbar_container');
        this._left_sidebar = new LeftSidebar('left_sidebar_container');
        this._token_container = new TokenContainer('token_container');

        this._render();
        this._renderMainListeners();
        this._renderComponents();
        this._renderComponentsListeners();
        this.GetMarketplaceItems();
    }

    _render() {
        this._dom.innerHTML = `
            <div id="navbar_container"></div>
            <div id="left_sidebar_container"></div>
            <div id="token_container" class="token-container-main"></div>
        `;
    }

    _renderMainListeners() {
        document.addEventListener('login', (e) => {
            console.log(e.detail);
            API.Login(e.detail.key, e.detail.user).then((results) => {
                console.log(results);
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    _renderComponents() {
        document.getElementById("navbar_container").innerHTML = this._navbar.Render();
        document.getElementById("left_sidebar_container").innerHTML = this._left_sidebar.Render();
        document.getElementById("token_container").innerHTML = this._token_container.Render();
    }

    _renderComponentsListeners() {
        this._navbar.RenderListeners();
    }

    GetMarketplaceItems() {
        API.GetMarketplace().then((results) => {
            this._token_container.RenderForSaleTokenItems(results);
        }).catch((err) => {
            console.log(err);
        });
    }
}
