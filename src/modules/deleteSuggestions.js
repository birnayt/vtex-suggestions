function throttle(callback, limit) {
  var waiting = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false; // And allow future invocations
      }, limit);
    }
  };
}

async function deleteSuggestions({ accountName, sellerId, skusList }) {
  const { REACT_APP_TOKEN, REACT_APP_KEY } = process.env;
  const BASE_URL = `https://api.vtex.com/${accountName}/suggestions/${sellerId}`;
  const baseHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-VTEX-API-APPTOKEN": REACT_APP_TOKEN,
    "X-VTEX-API-APPKEY": REACT_APP_KEY,
  };

  function chunkList(skusList) {
    const chunkedList = [];

    let i,
      j,
      temporary,
      chunk = 100;
    for (i = 0, j = skusList.length; i < j; i += chunk) {
      temporary = skusList.slice(i, i + chunk);

      chunkedList.push(temporary);
    }

    return chunkedList;
  }

  async function deleteSku(sku) {
    const url = `${BASE_URL}/${sku}`;
    const header = { ...baseHeader };

    const response = await fetch(url, {
      method: "DELETE",
      headers: header,
    });

    if (response.status === 200 || response.status === 204) {
      return true;
    }

    return false;
  }

  async function deleteSkus(skus) {
    const successSkus = [];
    const failedSkus = [];

    await Promise.all(
      skus.map(async (sku) => {
        const response = await deleteSku(sku);
        console.log(response);

        if (!response) {
          failedSkus.push(sku);
        } else {
          successSkus.push(sku);
        }
      })
    );

    return {
      success: successSkus,
      failed: failedSkus,
    };
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
    await run();
  } catch (error) {
    console.error(error);
  }
}

export default deleteSuggestions;
