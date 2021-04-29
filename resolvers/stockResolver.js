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
        modifyStation: async (parents, args) => {
            try {
                const stationId = args.id;
                const connections = args.Connections;
                const stationData = {
                    Title: args.Title,
                    AddressLine1: args.AddressLine1,
                    Town: args.Town,
                    StateOrProvidence: args.StateOrProvidence,
                    Postcode: args.Postcode,
                };

                const stationUpdateData = await Station.findByIdAndUpdate(
                    stationId,
                    stationData,
                    {
                        new: true,
                    }
                );

                if (connections) {
                    const connectionID = connections[0].id;
                    const connectionData = {
                        ConnectionTypeID: connections[0].ConnectionTypeID,
                        CurrentTypeID: connections[0].CurrentTypeID,
                        LevelID: connections[0].LevelID,
                        Quantity: connections[0].Quantity,
                    };
                    try {
                        await Connection.findByIdAndUpdate(connectionID, connectionData, {
                            new: true,
                        });
                    } catch (e) {
                        console.log(
                            `Error while updating connection ${e.message}`
                        );
                    }
                }

                return stationUpdateData.save();
            } catch (e) {
                console.log(`Error while updating station ${e.message}`);
            }
        },
        deleteStation: async (parent, args) => {
            try {
                const id = args.id;
                await Station.findByIdAndDelete(id);
                return id;
            } catch (e) {
                console.log(`Error while deleting station ${e.message}`);
            }
        },
    },
};