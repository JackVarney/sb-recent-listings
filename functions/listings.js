const superagent = require("superagent");

async function getRecentListings() {
  return new Promise((resolve, reject) => {
    superagent
      .get(
        "https://api.skinbid.com/api/search/auctions?sellType=fixed_price&take=10&skip=0&currency=USD"
      )
      .end((err, res) => {
        if (err) {
          res();
        }

        const listings = JSON.parse(res.text);
        const data = listings.items.map((item) => {
          const d = item.items[0];
          return {
            id: item.auction.auctionHash,
            name: d.item.name,
            fullName: d.item.fullName,
            wearName: d.item.wearName,
            type: d.item.type,
            discount: d.discount,
            category: d.item.category,
            minBid: item.nextMinimumBid,
            minBidEur: item.nextMinimumBidEur,
            image: d.item.imageUrl,
            meta: d.skbMeta,
            float: d.item.float,
          };
        });

        resolve(data);
      });
  });
}

const handler = async (event, context) => {
  // your server-side functionality
  const data = await getRecentListings();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

exports.handler = handler;
