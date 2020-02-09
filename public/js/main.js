import Navbar from "./components/navbar.js";
import TokenContainer from "./components/token_container.js";
import Creator from "./components/creator.js";
import Wallet from "./components/wallet.js";
import User from "./models/user.js";

import * as API from "./api/api.js";

export default class MainApplication {
    constructor(selector) {
        this._user = new User();
        this._authed = this._checkAuthentication();
        console.log(this._user);
        this._dom = document.getElementById(selector);
        this._navbar = new Navbar('navbar_container', this._user, this._authed);
        this._creator = new Creator('creator_container', this._user);
        this._token_container = new TokenContainer('token_container');
        this._wallet = new Wallet('wallet_container');

        this._render();
        this._renderMainListeners();
        this._renderComponents();
        this._renderComponentsListeners();
        this.GetMarketplaceItems();
    }

    _render() {
        this._dom.innerHTML = `
            <div id="navbar_container"></div>
            <div id="creator_container"></div>
            <div id="token_container" class="token-container-main"></div>
            <div id="wallet_container"></div>
        `;
    }

    _renderMainListeners() {
        document.addEventListener('login', (e) => {
            API.Login(e.detail.key, e.detail.user).then((results) => {
                this._storeUser(results)
                this._setAuthentication(results);
                this._navbar.ReRenderDropdownContents(this._user);
            }).catch((err) => {
                console.log(err);
            })
        })

        document.addEventListener('create_token', (e) => {
            API.CreateToken(e.detail).then((results) => {
                console.log(results);
            }).catch((err) => {
                console.log(err);
            })
        })

        document.addEventListener('logout', (e) => {
            this._logout();
        })

        document.addEventListener('creator_panel_toggle', (e) => {
            this._toggle_creator_panel();
        })

        document.addEventListener('wallet_panel_toggle', (e) => {
            this._toggle_wallet_panel();
        })
    }

    _toggle_creator_panel() {
        this._creator.TogglePanel();
    }

    _toggle_wallet_panel() {
        this._wallet.TogglePanel();
    }

    _logout() {
        localStorage.clear();
        location.reload();
    }

    _storeUser(userDetails) {
        localStorage.setItem("user", userDetails.name);
        localStorage.setItem("publicKey", userDetails.publicKey);
        localStorage.setItem("privateKey", userDetails.privateKey);
    }

    _setAuthentication(userDetails) {
        console.log(userDetails)
        this._user.Username = userDetails.name;
        this._user.PublicKey = userDetails.publicKey;
        this._user.PrivateKey = userDetails.privateKey;
    }

    _checkAuthentication() {
        let storedUser = localStorage.getItem('user');
        console.log(storedUser)
        if (storedUser !== null) {
            let details = {
                "name": storedUser,
                "publicKey": localStorage.getItem('publicKey'),
                "privateKey": localStorage.getItem('privateKey')
            }
            this._setAuthentication(details);
            return true;
        } else {
            return false;
        }
    }

    _renderComponents() {
        document.getElementById("navbar_container").innerHTML = this._navbar.Render();
        this._navbar.RenderNavbarDropdown();
        document.getElementById("token_container").innerHTML = this._token_container.Render();
        document.getElementById("creator_container").innerHTML = this._creator.Render();
        document.getElementById("wallet_container").innerHTML = this._wallet.Render();
    }

    _renderComponentsListeners() {
        this._navbar.RenderListeners();
        this._creator.RenderEventListener();
    }

    GetMarketplaceItems() {
        API.GetMarketplace().then((results) => {
            this._token_container.RenderForSaleTokenItems(results);
        }).catch((err) => {
            console.log(err);
        });
    }
}
