import * as Promise from "bluebird";

async function deleteSuggestions({ accountName, sellerId, skusList }) {
  const { REACT_APP_TOKEN, REACT_APP_KEY } = process.env;
  const BASE_URL = `https://api.vtex.com/${accountName}/suggestions/${sellerId}`;
  const baseHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-VTEX-API-APPTOKEN": REACT_APP_TOKEN,
    "X-VTEX-API-APPKEY": REACT_APP_KEY,
  };

  async function deleteSku(sku, results) {
    const url = `${BASE_URL}/${sku}`;
    const header = { ...baseHeader };

    try {
      await fetch(url, {
        method: "DELETE",
        headers: header,
      });
  
      results.success.push(sku);
      return true;
    } catch(error) {
      console.error(error)
      results.failed.push(sku);
      return false;
    }
  }

  async function deleteSkus(skus) {
    const results = {
      success: [],
      failed: []
    }

    await Promise.map(skus, (sku) => {
      return deleteSku(sku, results);
    }, {concurrency: 5});

    return results;
  }

  async function run() {
    const { success, failed } = await deleteSkus(skusList);

    console.log(`Success: ${success.length}`);
    console.log(`Failed: ${failed.length}`);

    return {
      success,
      failed,
    };
  }

  try {
    const result = await run();

    return result;
  } catch (error) {
    console.error(error);
  }
}

export default deleteSuggestions;
