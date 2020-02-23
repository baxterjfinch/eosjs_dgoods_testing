import Navbar from "./components/navbar.js";
import LeftSidebar from "./components/left_sidebar.js";
import TokenContainer from "./components/token_container.js";
import Creator from "./components/creator.js";
import Wallet from "./components/wallet.js";
import User from "./models/user.js";
import NotificationCenter from "./components/notification_center.js";
import Dashboard from "./components/dashboard.js";

import * as API from "./api/api.js";

export default class MainApplication {
    constructor(selector) {
        this._user = new User();
        this._authed = this._checkAuthentication();

        this._dom = document.getElementById(selector);
        this._navbar = new Navbar('navbar_container', this._user, this._authed);
        this._left_sidebar = new LeftSidebar('left_sidebar', this._user);
        this._token_container = new TokenContainer('main_container', this._user.name);
        this._notification_center = new NotificationCenter('notification_center');

        this._dashboard = new Dashboard('main_container', this._user);

        this._render();
        this._renderMainListeners();
        this._renderComponents();
        this._renderComponentsListeners();
        this.RenderMarketplaceItems();

    }

    _render() {
        this._dom.innerHTML = `
            <div id="navbar_container"></div>
            <div id="left_sidebar"></div>
            <div id="notification_center"></div>
            <div id="main_container" class="token-container-main"></div>
        `;
    }

    _renderMainListeners() {
        document.addEventListener('login', (e) => {
            API.Login(e.detail.key, e.detail.user).then((results) => {
                this._storeUser(results)
                location.reload();

            }).catch((err) => {
                console.log(err);
            })
        })

        document.addEventListener('buy_token', (e) => {
            API.BuyToken(e.detail.pkey, e.detail.buyer, e.detail.id, e.detail.price, e.detail.seller).then((results) => {
                this._token_container.DestroyBoughtCard(e.detail.id);
                console.log(results)
                this._notification_center.PushBoughtTokenNotification(results.transaction_id);
            }).catch((err) => {
                console.log(err);
            })
        })

        document.addEventListener('create_token', (e) => {
            API.CreateToken(e.detail).then((results) => {
                this._notification_center.PushCreateTokenNotification(results);
            }).catch((err) => {
                console.log(err);
            })
        })

        document.addEventListener('logout', (e) => {
            this._logout();
        })

        document.addEventListener('render_creator', (e) => {
            this.RenderCreator();
        })

        document.addEventListener('render_wallet', (e) => {
            this.RenderWalletItems();
        })

        document.addEventListener('render_marketplace', (e) => {
            this.RenderMarketplaceItems();
        })

        document.addEventListener('navigation_switch', (e) => {
            switch(e.detail.destination) {
              case 'dashboard_panel':
                this.ClearMainContainer();
                this.RenderDashboard();
                break;
              case 'marketplace_panel':
              this.ClearMainContainer();
              this.RenderMarketplaceItems();
                break;
              default:
                // code block
            }
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
        this._user.Username = userDetails.name;
        this._user.PublicKey = userDetails.publicKey;
        this._user.PrivateKey = userDetails.privateKey;
    }

    _checkAuthentication() {
        let storedUser = localStorage.getItem('user');
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
        document.getElementById("left_sidebar").innerHTML = this._left_sidebar.Render();
        document.getElementById("notification_center").innerHTML = this._notification_center.Render();
        this.PushToMainContainer(this._token_container.Render());
    }

    _renderComponentsListeners() {
        this._navbar.RenderListeners();
        this._left_sidebar.RenderEventListeners();

    }

    RenderDashboard() {
        this.PushToMainContainer(this._dashboard.Render());
    }

    RenderDashboard() {
        this.PushToMainContainer(this._dashboard.Render());

        API.GetWalletOwnedItemsContents(this._user.name).then((results) => {
            this._user.assets = results;
            this._dashboard.PushDashboardWalletTable(this._user.assets);
        })
    }

    UpdateWalletContents(user) {
        this._wallet.ClearWallet();

        API.GetWalletOwnedItemsContents(user).then((results) => {
            this._user.assets = results;
            this._wallet.RenderOwnedTokens(results);
        })

        API.GetUnissuedTokens(user).then((results) => {
            this._wallet.RenderUnissuedTokens(results);
        })
    }

    GetUnissuedTokens(user) {
        API.GetUnissuedTokens(user).then((results) => {
            console.log(results);
        })
    }

    ClearMainContainer() {
        $("#main_container").empty();
    }

    PushToMainContainer(html) {
        document.getElementById("main_container").innerHTML = html;
    }

    RenderWalletItems() {
        this.ClearMainContainer();
        this._wallet = new Wallet('main_container');
        document.getElementById("main_container").innerHTML = this._wallet.Render();
        this.UpdateWalletContents(this._user.name);

    }

    RenderCreator() {
        this.ClearMainContainer();
        this._creator = new Creator('main_container', this._user);
        this.PushToMainContainer(this._creator.Render());
        this._creator.RenderEventListener();
    }

    RenderMarketplaceItems() {
        this.ClearMainContainer();
        this.PushToMainContainer(this._token_container.Render());
        API.GetMarketplace().then((results) => {
            this._token_container.RenderForSaleTokenItems(results);
        }).catch((err) => {
            console.log(err);
        });
    }
}
