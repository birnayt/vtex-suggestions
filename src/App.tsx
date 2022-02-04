import React, { useEffect, useState } from "react";
import "./App.css";
import "./styles.scss";
import * as XLSX from "xlsx";
import logo from "./assets/logo.png";

import deleteSuggestions from "./modules/deleteSuggestions";
import Table from "./components/Table";

function App() {
  const accountName = window.location.hostname.split(".")[0];

  const [items, setItems] = useState<TItem[]>([]);
  const [data, setData] = useState([]);
  const [sellerId, setSellerId] = useState("");
  const [skusList, setSkusList] = useState<string[]>([]);
  const formattedItems: any = [];

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
      data.forEach((item: any) => {
        const possibleStatus = ["Denied", "Neutral", "Approved"];
        const productName = item.NameComplete;
        const brandName = item.BrandName;
        const itemId = item.ItemId;
        const productId = item.ProductId;
        const sellerId = item.SellerId;
        //TODO - FETCH ACTUAL STATUS
        const status =
          possibleStatus[Math.floor(Math.random() * possibleStatus.length)];

        const formattedItem = {
          name: productName,
          brand: brandName,
          itemId: itemId,
          productId: productId,
          status: status,
          sellerId: sellerId,
        };
        formattedItems.push(formattedItem);
      });
      setData(formattedItems);
      setItems(data);
    });
  };

  useEffect(() => {
    if (items.length > 0) {
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
          <>
            <Table data={data} />

            <button
              onClick={() =>
                deleteSuggestions({ accountName, sellerId, skusList })
              }
            >
              Desbloquear SKUS
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
