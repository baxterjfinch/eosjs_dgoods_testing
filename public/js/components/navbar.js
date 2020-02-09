export default class Navbar {
    constructor(selector, user, authed) {
        this._logged_in = authed;

        if (this._logged_in) {
            console.log("USER HERE")
            this._logged_in = true;
            this._user = user;
        }
        this._selector = selector;
        this._login_panel_state = false;
        this._login_panel_element = null;

    }

    RenderListeners() {
        document.getElementById('creator_panel_button').addEventListener('click', () => {
            let event = new CustomEvent("creator_panel_toggle", {

            });
            document.dispatchEvent(event);

        })

        document.getElementById('wallet_panel_button').addEventListener('click', () => {
            let event = new CustomEvent("wallet_panel_toggle", {

            });
            document.dispatchEvent(event);

        })

        document.getElementById('login_button').addEventListener('click', () =>{
            if (this._login_panel_state) {
                document.getElementById('login_panel').style.top = "-217px";
                this._login_panel_state = false;
                removeClickListener;
            } else {
                this._login_panel_element = document.getElementById('login_panel');
                document.getElementById('login_panel').style.top = "0px";
                document.addEventListener('click', outsideClickListener);
                this._login_panel_state = true;
            }
        })

        const outsideClickListener = event => {
            console.log(event)
            if (!this._login_panel_element.contains(event.target) && this._login_panel_state && event.toElement.id !== "login_button") { // or use: event.target.closest(selector) === null
                console.log("closing")
                document.getElementById('login_panel').style.top = "-217px";
                this._login_panel_state = false;
                removeClickListener;
            }
        }

        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener)
        }
    }

    RenderNavbarDropdown() {
        this._renderDropdownContents();
        this._renderDropdownListener();
    }

    _renderDropdownListener() {
        if(this._logged_in) {
            document.getElementById('logout_button').addEventListener('click', () => {
                let event = new CustomEvent("logout", {

                });
                document.dispatchEvent(event);
            })

        } else {
            document.getElementById('login_submit').addEventListener('click', () => {
                console.log(document.getElementById('account_name').value)
                // create and dispatch the login event
                let event = new CustomEvent("login", {
                  detail: {
                    user: document.getElementById('account_name').value,
                    key : document.getElementById('private_key').value
                  }
                });
                document.dispatchEvent(event);
            });
        }
    }

    ReRenderDropdownContents(user) {
        this._user = user;
        this._logged_in = true;
        this._renderDropdownContents();
        this._renderDropdownListener();
    }

    _renderDropdownContents() {
        let panelContents = document.getElementById('login_panel');

        if(this._logged_in) {
            document.getElementById('login_button').innerText = this._user.name;
            panelContents.innerHTML = `
                <button id="logout_button" class="logout-button">Logout</div>
            `;
        } else {
            panelContents.innerHTML = `
                <div class="input-group mb-3 input-login-group">
                    <input id="account_name" type="text" class="form-control input-login-field-class" placeholder="Account Name" aria-label="" aria-describedby="basic-addon1">
                </div>
                <div class="input-group mb-3 input-login-group">
                    <input id="private_key" type="text" class="form-control input-login-field-class" placeholder="Enter Private Key (not stored or saved)" aria-label="" aria-describedby="basic-addon1">
                    <div class="input-group-append">
                        <button id="login_submit" class="btn btn-outline-secondary login-button-submit" type="button">Submit</button>
                    </div>
                </div>
            `;
        }
    }



    Render() {
        let button = "Login";

        if (this._logged_in) {
            button = this._user.name;
        }

        return `
            <div id="navbar" class="navbar-main">
                <button id="creator_panel_button" class="btn market-button nav-buttons">Creator</button>
                <button id="login_button" class="btn login-button">${button}</button>
                <button id="wallet_panel_button" class="btn account-button nav-buttons"><i class="fa fa-user-circle"></i> Wallet</button>
            </div>
            <div id="login_panel" class="login-panel"></div>
        `;
    }
}
