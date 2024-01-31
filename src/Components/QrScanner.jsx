// import "./App.css";
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner as Html5codeScanner } from 'html5-qrcode';


function QrScanner() {
  let codeScanner;
  const [scanResult, setscanResult] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    if (!codeScanner) {
      const codeScanner = new Html5codeScanner("qr-reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      async function scanSuccess(result) {
        codeScanner.clear();
        setscanResult(result);
        codeScanner
          .stop()
          .then((ignore) => {})
          .catch((err) => {});
        setscanResult(() => result);
        try {
          const fetchResponse = await fetch("http://localhost:3000/qr_codes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ scanResult: scanResult }),
          });
          const data = await fetchResponse.json();
          return data;
        } catch (e) {
          return e;
        }
      }

      function scanFailed(error) {
        console.warn(error);
      }
      codeScanner.render(scanSuccess, scanFailed);
    }

    fetch("http://localhost:3000/qr_codes")
      .then((res) => res.json())
      .then((data) => setFetchedData(data));
  },[]);

  return (
    <div>
      <h1 className="scanner-title">QRCODE SCANNER</h1>
      <div className="cam-scanner">
        <h5>Scan Qr Code by Web Cam</h5>
        <div className="scan-section">
          {scanResult === "welcome" ? (
            <div className="after-scan">
              <table style={{ width: "100%" }}>
                <tr>
                  <th>Scanned Data:</th>
                  <td style={{ fontStyle: "italic" }}>
                    {fetchedData.scanResult}
                  </td>
                </tr>
              </table>
            </div>
          ) : (
            <div id="qr-reader"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrScanner;
