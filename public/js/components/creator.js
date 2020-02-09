export default class Creator {
    constructor(selector, user) {
        this._state = false;
        this._user = user;
        console.log(user.name)
    }

    TogglePanel() {
        if (!this._state) {
            document.getElementById('creator_container').style.width = "40%";
            document.getElementById('creator_container').style.left = "0px";
            document.getElementById('creator_panel').style.visibility = "unset";
            this._state = true;
        } else {
            document.getElementById('creator_container').style.width = "100px";
            document.getElementById('creator_container').style.left = "-95px";
            document.getElementById('creator_panel').style.visibility = "hidden";
            this._state = false;
        }
    }

    RenderEventListener() {
        document.getElementById('submit_create_token').addEventListener('click', () => {
            let name = document.getElementById('create_token_name').value;
            let supply = document.getElementById('create_token_supply').value;
            let category = document.getElementById('create_token_category').value;
            let split = document.getElementById('token_revision_split').value;
            let midays = document.getElementById('maximum_issue_days').value;
            let uri = document.getElementById('token_create_base_uri').value;
            let fungible = document.getElementById('is_fungbile').checked;
            let burnable = document.getElementById('is_burnable').checked;
            let transferable = document.getElementById('is_transferable').checked;
            let sellable = document.getElementById('is_sellable').checked;

            console.log(name, supply, category, split, midays, uri, fungible, burnable, transferable, sellable);
            let event = new CustomEvent("create_token", {
                detail: {
                  user: this._user.name,
                  name : name,
                  supply : supply,
                  category : category,
                  split : split,
                  midays : midays,
                  uri : uri,
                  fungible : fungible,
                  burnable : burnable,
                  transferable : transferable,
                  sellable : sellable
                }
            });
            document.dispatchEvent(event);
        })
    }

    Render() {
        return `
            <div id="creator_panel" class="creator-panel">
                <form class="token-form-class">
                    <div class="form-group">
                        <label class="token-creator-title" for="tokenInputName">Token Name</label>
                        <input id="create_token_name" type="text" class="form-control" id="tokenInputName" aria-describedby="tokenNameHelp" placeholder="Token Name">
                    </div>

                    <div class="form-group">
                        <label class="token-creator-title" for="tokenInputSupply">Token Supply</label>
                        <input id="create_token_supply" type="text" class="form-control" id="tokenInputSupply" aria-describedby="tokenSupplyHelp" placeholder="Token Supply">
                    </div>

                    <div class="form-group">
                        <label class="token-creator-title" for="tokenInputCategory">Token Category</label>
                        <input id="create_token_category" type="text" class="form-control" id="tokenInputCategory" aria-describedby="tokenCategoryHelp" placeholder="Token Category">
                    </div>

                    <div class="form-group">
                        <label class="token-creator-title" for="tokenRevisionSplit">Token Revision Split</label>
                        <input id="token_revision_split" type="text" class="form-control" id="tokenRevisionSplit" aria-describedby="tokenRevisionHelp" placeholder="Token Revision Split">
                        <small id="tokenRevisionHelp" class="form-text create-help-text">We'll never share your email with anyone else.</small>
                    </div>

                    <div class="form-group">
                        <label class="token-creator-title" for="maximumIssueDays">Maximum Issue Days</label>
                        <input id="maximum_issue_days" type="text" class="form-control" id="maximumIssueDays" aria-describedby="tokenDaysHelp" placeholder="Maximum Issue Days">
                        <small id="tokenDaysHelp" class="form-text create-help-text">Set as 0 for indefinite minting</small>
                    </div>

                    <div class="form-group">
                        <label class="token-creator-title" for="baseURI">Base URI</label>
                        <input id="token_create_base_uri" type="text" class="form-control" id="baseURI" aria-describedby="tokenURIHelp" placeholder="Base URI">
                        <small id="tokenURIHelp" class="form-text create-help-text">We'll never share your email with anyone else.</small>
                    </div>

                    <div class="token-boolean-group">
                        <div class="form-check token-booleans">
                            <input type="checkbox" class="form-check-input" id="is_fungbile">
                            <label class="form-check-label" for="exampleCheck1">Fungible</label>
                        </div>
                        <div class="form-check token-booleans">
                            <input type="checkbox" class="form-check-input" id="is_burnable">
                            <label class="form-check-label" for="exampleCheck1">Burnable</label>
                        </div>
                        <div class="form-check token-booleans">
                            <input type="checkbox" class="form-check-input" id="is_transferable">
                            <label class="form-check-label" for="exampleCheck1">Transferable</label>
                        </div>
                        <div class="form-check token-booleans">
                            <input type="checkbox" class="form-check-input" id="is_sellable">
                            <label class="form-check-label" for="exampleCheck1">Sellable</label>
                        </div>
                    </div>
                </form>
                <button id="submit_create_token" class="btn btn-primary submit-create-token">Submit</button>
            </div>
        `
    }
}
// <div class="btn-group create-switcher" role="group" aria-label="Basic example">
//     <button type="button" class="btn btn-secondary left-panel-button">Left</button>
//     <button type="button" class="btn btn-secondary right-panel-button">Right</button>
// </div>
// let testCreateTokenData = {
//   "sellable": true,
//   "transferable": true,
// }
