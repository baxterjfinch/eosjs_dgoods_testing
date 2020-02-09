export default class Navbar {
    constructor(selector) {
        this._selector = selector;
        this._login_panel_state = false;
        this._login_panel_element = null;
    }

    RenderListeners() {
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
            if (!this._login_panel_element.contains(event.target) && this._login_panel_state && event.target.innerText !== "Login") { // or use: event.target.closest(selector) === null
                console.log("closing")
                document.getElementById('login_panel').style.top = "-217px";
                this._login_panel_state = false;
                removeClickListener;
            }
        }

        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener)
        }

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
        })

    }

    Render() {
        return `
            <div id="navbar" class="navbar-main">
                <button class="btn market-button nav-buttons"><i class="fa fa-user-circle"></i> Marketplace</button>
                <button id="login_button" class="btn login-button">Login</button>
                <button class="btn account-button nav-buttons"><i class="fa fa-user-circle"></i> Wallet</button>
            </div>
            <div id="login_panel" class="login-panel">
                <div class="input-group mb-3 input-login-group">
                    <input id="account_name" type="text" class="form-control input-login-field-class" placeholder="Account Name" aria-label="" aria-describedby="basic-addon1">
                </div>
                <div class="input-group mb-3 input-login-group">
                    <input id="private_key" type="text" class="form-control input-login-field-class" placeholder="Enter Private Key (not stored or saved)" aria-label="" aria-describedby="basic-addon1">
                    <div class="input-group-append">
                        <button id="login_submit" class="btn btn-outline-secondary login-button-submit" type="button">Submit</button>
                    </div>
                </div>
            </div>
        `;
    }
}
