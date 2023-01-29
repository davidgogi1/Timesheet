import http from "./httpService";

const apiEndpoint = "http://localhost:3900/api/spreadsheets";

function spreadsheetUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSpreadsheets() {
  return http.get(apiEndpoint);
}

export function getSpreadsheet(spreadsheetId) {
  return http.get(spreadsheetUrl(spreadsheetId));
}

export function saveSpreadsheet(spreadsheet) {
  if (spreadsheet._id) {
    const body = { ...spreadsheet };
    delete body._id;

    return http.put(spreadsheetUrl(spreadsheet._id), body);
  }
  return http.post(apiEndpoint, spreadsheet);
}

export function deleteSpreadsheet(spreadsheetId) {
  return http.delete(spreadsheetUrl(spreadsheetId));
}
