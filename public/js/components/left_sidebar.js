

export default class LeftSidebar {
    constructor(selector) {
        this._selector = selector;
    }

    RenderEventListeners() {
        console.log("rendering left listeners")
        document.getElementById('navigation_buttons').addEventListener('click', (e) => {
            console.log(e.target.id);
            let event = new CustomEvent("navigation_switch", {
              detail: {
                destination: e.target.id,
              }
            });
            document.dispatchEvent(event);
        })
    }

    Render() {
        return `
            <div class="left-sidebar">
                <div class="list-group" id="navigation_buttons" role="tablist">
                    <a class="list-group-item list-group-item-action nav-button-custom active" id="marketplace_panel" data-toggle="list" href="#list-market" role="tab" aria-controls="home">Marketplace</a>
                  <a class="list-group-item list-group-item-action nav-button-custom" id="dashboard_panel" data-toggle="list" href="#list-home" role="tab" aria-controls="home">Dashboard</a>

                  <a class="list-group-item list-group-item-action nav-button-custom" id="list-profile-list" data-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</a>
                  <a class="list-group-item list-group-item-action nav-button-custom" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab" aria-controls="settings">Settings</a>
                </div>
            </div>
        `;
    }
}
