export default class Dashboard {
    constructor(selector, user) {
        this._dom = document.getElementById(selector);
        this._user = user;
    }

    PushDashboardWalletTable(data) {
        let rows = new DashboardWalletTable(data.rows);
        rows.BuildRowHTML();
        document.getElementById('table_body').innerHTML = rows.Render();
    }

    Render() {
        return `
            <div class="jumbotron jumbotron-fluid dashboard-card-spacing ">
              <div class="container">
                <h1 class="display-4">${this._user.name}</h1>
                <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
              </div>
            </div>

            <table class="table dashboard-card-spacing ">
              <thead class="table-custom-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Token Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody id="table_body">
              </tbody>
            </table>
        `;
    }

    RenderEventListener() {

    }
}

class DashboardWalletTable {
    constructor(rows) {
        this._rows = rows;
        this._rowHtml = ``;
    }

    BuildRowHTML() {
        for (let row of this._rows) {
            this._rowHtml += `
                <tr>
                  <th scope="row">${row.category_name_id}</th>
                  <td>${row.token_name}</td>
                  <td>${row.category}</td>
                  <td>${row.amount}</td>
                </tr>
            `;
        }
    }

    Render() {
        return this._rowHtml;
    }
}
