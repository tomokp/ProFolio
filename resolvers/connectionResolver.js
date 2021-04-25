import Connections from '../models/connection.js';

export default {
    Station: {
        Connections: (parent, args) => {
            return parent.Connections.map((id) => Connections.findById(id));
        },
    },
};