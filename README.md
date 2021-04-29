# chargemap-gql

example requests: http://node152667-chargemaptom.jelastic.metropolia.fi/graphql or http://localhost:3000/graphql (locally)

```graphql
# get stations by boundaries
{
  stations(
    bounds: {
      southWest: { lat: 50.0918986743294, lng: 80.60319519042969 }
      northEast: { lat: 60.38196898834704, lng: 24.94033813476563 }
    }
  ) {
    id
    Title
    Town
    AddressLine1
    Location {
      type
      coordinates
    }
    Connections {
      Quantity
      ConnectionTypeID {
        Title
      }
      CurrentTypeID {
        Title
      }
      LevelID {
        Title
        Comments
        IsFastChargeCapable
      }
    }
  }
}

# limit the number of stations
{
  stations(start: 1, limit: 3) {
    id
    Title
    Town
    AddressLine1
    Location {
      type
      coordinates
    }
    Connections {
      Quantity
      ConnectionTypeID {
        Title
      }
      CurrentTypeID {
        Title
      }
      LevelID {
        Title
        Comments
        IsFastChargeCapable
      }
    }
  }
}

# station by id
{
  station(id: "5e590b0a7536c009841db2e1") {
    id
    Title
    Town
    AddressLine1
    Location {
      type
      coordinates
    }
    Connections {
      Quantity
      ConnectionTypeID {
        Title
      }
      CurrentTypeID {
        Title
      }
      LevelID {
        Title
        Comments
        IsFastChargeCapable
      }
    }
  }
}

# get connection types
{
  connectiontypes {
    id
    FormalName
    Title
  }
}

# get current types
{
  currenttypes {
    id
    Description
    Title
  }
}

# get level types
{
  leveltypes {
    id
    Comments
    IsFastChargeCapable
    Title
  }
}

# add station
mutation {
  addStation(
    Connections: [
      {
        ConnectionTypeID: "5e39eecac5598269fdad81a0",
        CurrentTypeID: "5e39ef4a6921476aaf62404b",
        LevelID: "5e39edf7bb7ae768f05cf2bd",
        Quantity: 2
      }
    ],
    Postcode: "00000",
    Title: "Some title",
    AddressLine1: "Some address",
    StateOrProvince: "Some state",
    Town: "Some town",
    Location: {
      coordinates: [50.0918986743294, 80.60319519042969]
    }
  )
  {
    id
    AddressLine1
    Town
  }
}

# modify station (if you want to use separate variables)
mutation ExampleWithVariables($id: ID!, $Connections: [ConnectionInput], $Postcode: String, $Title: String, $AddressLine1: String, $StateOrProvince: String, $Town: String) {
 modifyStation(    
   id: $id,
   Connections: $Connections,
   Postcode: $Postcode,
   Title: $Title,
   AddressLine1: $AddressLine1,
   StateOrProvince: $StateOrProvince,
   Town: $Town,
 )
 {
   Title
   AddressLine1
   Town
 }
}

# variables for modify station, note that format is JSON
{"id":"someStationID","Connections":[{"id":"someConnectionID","Quantity":3,"ConnectionTypeID":"someConnectionTypeID","LevelID":"someLevelID","CurrentTypeID":"someCurrentTypeID"}],"Postcode":"02720","Title":"Lähisd","AddressLine1":"Sanansaattajanpolku","StateOrProvince":"Uusimaa","Town":"Espoo"}


#delete station
mutation
{
    deleteStation(id: "606b0bd545f6042814cdb228")
}
```
