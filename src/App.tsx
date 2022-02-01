import React, { useEffect, useState } from "react";
import "./App.css";
import "./styles.scss";
import * as XLSX from "xlsx";
import logo from "./assets/logo.png";

import deleteSuggestions from "./modules/deleteSuggestions";

function App() {
  const accountName = window.location.hostname.split(".")[0];

  const [items, setItems] = useState<TItem[]>([]);
  const [sellerId, setSellerId] = useState("");
  const [skusList, setSkusList] = useState<string[]>([]);

  const readExcel = (file: any) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data: any) => {
      // setItems({
      //   [itemId]: {
      //     Name: "",
      //     ItemId: "",
      //     Status: "neutral",
      //   },
      // }); EXEMPLO
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      console.log(items);
      const arrItemsId = items.map((item: TItem) => item.ItemId);
      setSellerId(items[0].SellerId);
      setSkusList(arrItemsId);
    }
  }, [items]);

  return (
    <>
      <div className="header__container">
        <img src={logo} alt="logo grupo soma" />
      </div>
      <div className="content__container">
        <div className="send-file__container">
          <input
            type="file"
            onChange={(e: any) => {
              const file: any = e.target.files[0];

              readExcel(file);
            }}
          />
        </div>
        {skusList.length > 0 && (
          <button
            onClick={() =>
              deleteSuggestions({ accountName, sellerId, skusList })
            }
          >
            Desbloquear SKUS
          </button>
        )}
        <table className="table container">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(items).map((d: any) => (
              <tr key={d.ItemId}>
                <th>{d.SellerId}</th>
                <td>{d.ItemId}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
