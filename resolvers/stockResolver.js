import Stock from '../models/stock.js';

export default {
    Query: {
        stocks: () => Stock.find(),
    },
    Mutation: {
        addStock: async (parent, args) => {
            try {
                const stockData = { ...args };

                const newStock = new Stock({
                    ...stockData,
                });

                newStock.save();
                return newStock;
            } catch (e) {
                console.log(`Error while creating stock ${e.message}`);
            }
        },
        modifyStock: async (parents, args) => {
            try {
                const stockId = args.id;
                const stockData = {
                    Symbol: args.Symbol,
                    StockName: args.StockName,
                    Price: args.Price,
                };

                const stockUpdateData = await Stock.findByIdAndUpdate(
                    stockId,
                    stockData,
                    {
                        new: true,
                    }
                );

                return stockUpdateData.save();
            } catch (e) {
                console.log(`Error while updating stock ${e.message}`);
            }
        },
        deleteStock: async (parent, args) => {
            try {
                const id = args.id;
                await Stock.findByIdAndDelete(id);
                return id;
            } catch (e) {
                console.log(`Error while deleting stock ${e.message}`);
            }
        },
    },
};