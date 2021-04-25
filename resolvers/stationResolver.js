import Station from '../models/station.js';
import { bounds } from '../helpers/boundHelper.js';
import Connection from '../models/connection.js';
import { AuthenticationError } from 'apollo-server-errors';

export default {
    Query: {
        stations: async (parent, args) => {
            try {
                const start = args.start ? parseInt(args.start) : 0;
                const limit = args.limit ? parseInt(args.limit) : 10;

                let res;
                if (args.bounds) {
                    const area = bounds(args.bounds.northEast, args.bounds.southWest);
                    res = await Station.find().skip(start).limit(limit).where('Location').within(area);
                } else {
                    res = await Station.find().skip(start).limit(limit);
                }
                return res;
            } catch (e) {
                console.log(`Error while getting stations: ${e.message}`);
            }
        },
        station: async (parent, args) => {
            return Station.findById(args.id);
        },
    },
    Mutation: {
        addStation: async (parent, args, { user }, info) => {
            try {
                if (!user) {
                    throw new AuthenticationError(
                        'Not authenticated to create station'
                    );
                }
                const stationData = { ...args };

                const connections = args.Connections;
                const connectionIds = await Promise.all(
                    connections.map(async (con) => {
                        try {
                            const newConnection = new Connection(con);
                            await newConnection.save();
                            return newConnection._id;
                        } catch (e) {
                            console.log(
                                `Error while creating connection ${e.message}`
                            );
                        }
                    })
                );

                stationData.Location.type = 'Point';

                const newStation = new Station({
                    ...stationData,
                    Connections: connectionIds,
                });

                newStation.save();
                return newStation;
            } catch (e) {
                console.log(`Error while creating station ${e.message}`);
            }
        },
        modifyStation: async (parents, args, { user }, info) => {
            try {
                if (!user) {
                    throw new AuthenticationError(
                        'Not authenticated to modify station'
                    );
                }
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
        deleteStation: async (parent, args, { user }, info) => {
            try {
                if (!user) {
                    throw new AuthenticationError(
                        'Not authenticated to delete station'
                    );
                }
                const id = args.id;
                await Station.findByIdAndDelete(id);
                return id;
            } catch (e) {
                console.log(`Error while deleting station ${e.message}`);
            }
        },
    },
};