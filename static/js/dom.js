import { dataHandler } from "./data_handler.js";

function showMainTable() {
    let tableTemplate = document.getElementById('table-header-template').innerHTML;
    let compiledTemplate = Handlebars.compile(tableTemplate);
    let renderedTemplate = compiledTemplate();
    document.querySelector('body').insertAdjacentHTML('beforeend', renderedTemplate);

    dataHandler._api_get('/stocks', function (data) {
        for (let row of data) {
            let rowTemplate = document.getElementById('data-row-template').innerHTML;
            let compiledTemplate = Handlebars.compile(rowTemplate);
            let renderedTemplate = compiledTemplate(row);
            document.querySelector("tbody").insertAdjacentHTML("beforeend", renderedTemplate);

    }
        addEventListenerForDeleteButton();
    });
}

//add event listener for delete buttons
function addEventListenerForDeleteButton() {
    let deleteButtons = document.getElementsByClassName('btn btn-outline-warning border-0');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function () {
            let parentOfDeleteButton = deleteButton.parentElement;
            let rowOfDeleteButton = parentOfDeleteButton.parentElement;
            let tickerOfRow = deleteButton.getAttribute('data-ticker');
            deleteRow(tickerOfRow, rowOfDeleteButton);
        })
    }
}

function deleteRow(tickerOfRow, rowOfDeleteButton) {
    dataHandler._api_delete(`/stocks/${tickerOfRow}`, function (deletedRowList) {
        rowOfDeleteButton.remove();
    })
}


function modifyRowData(tickerData) {
    let tickerRow = document.getElementsByClassName(`${tickerData['ticker']}`);

    // updates actual price
    let actualPrice = tickerRow[0].getElementsByClassName('actual-price');
    actualPrice[0].firstChild.innerText = tickerData['actual_price'];

    // updates daily price
    let dailyPrice = tickerRow[0].getElementsByClassName('daily-price');
    dailyPrice[0].firstChild.innerText = tickerData['daily_price_change'];

    // updates daily price percentage
    let dailyPricePercentage = tickerRow[0].getElementsByClassName('daily-price-percentage');
    dailyPricePercentage[0].firstChild.innerText = tickerData['daily_price_rel_change'];

    // updates short term trend
    let shortTermTrend = tickerRow[0].getElementsByClassName('short-term-trend');
    shortTermTrend[0].firstChild.Classlist = tickerData['trends']['shortTermTrend'];

    // updates mid term trend
    let midTermTrend = tickerRow[0].getElementsByClassName('mid-term-trend');
    midTermTrend[0].firstChild.Classlist = tickerData['trends']['midTermTrend'];
    //updates long term trend
    let longTermTrend = tickerRow[0].getElementsByClassName('long-term-trend');
    longTermTrend[0].firstChild.Classlist = tickerData['trends']['longTermTrend'];

    // updates market and local time
    let marketLocalTime = tickerRow[0].getElementsByClassName('market-local-time');
    marketLocalTime[0].innerHTML = `${tickerData['mkt_time']}` + "/<br>" + `${tickerData['local_time']}`;

    // updates market status
    let marketStatus = tickerRow[0].getElementsByClassName('status');
    marketStatus[0].firstChild.innerText = tickerData['actual_price'];
}


function refreshDataFields() {
    dataHandler._api_get('/stocks', function (tickerDatas) {
        for (let tickerData of tickerDatas) {
            modifyRowData(tickerData);
        }
    })
}


function addEventListenerForRefreshButton() {
    let refreshButton = document.getElementsByClassName('btn btn-outline-primary');
    refreshButton[0].addEventListener('click', function () {
        console.log('refresh');
        refreshDataFields();
    })
}


function main() {
    showMainTable();
    addEventListenerForRefreshButton();
}

main();

