const { gql } = require('apollo-server-express');

const House = require('./models/house');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
exports.typeDefs = gql`
  ##
  #TYPES/QUERY
  #
  type Owner {
    firstName: String
    lastName: String
  }

  type ContactInfo {
    mobile: String
    phone: String
    email: String
  }

  type Request {
    type: String!
    approved: Boolean!
  }

  type HoaFeePaid {
    year: String!
    paid: Boolean!
    value: Float
    lateFee: Float
  }

  type Violation {
    type: String!
    noticeSent: Boolean!
    value: Float
    paid: Boolean
  }

  type Lot {
    _id: ID!
    lot: ID!
    address: String!
    contactInfo: ContactInfo
    owners: [Owner!]
    requests: [Request]
    hoaFeePaid: [HoaFeePaid]
    violations: [Violation]
  }

  type Query {
    house(lot: ID!): Lot
    address(number: String!): Lot
  }

  ##
  #INPUTS
  #
  input OwnerInput {
    firstName: String
    lastName: String
  }

  input ContactInfoInput {
    mobile: String
    phone: String
    email: String
  }

  input RequestInput {
    type: String!
    approved: Boolean!
  }

  input HoaFeePaidInput {
    year: String!
    paid: Boolean!
    value: Float
    lateFee: Float
  }

  input ViolationInput {
    type: String!
    noticeSent: Boolean!
    value: Float
    paid: Boolean
  }


  input HouseInput {
    _id: ID!
    lot: ID!
    address: String!
    contactInfo: ContactInfoInput
    owners: [OwnerInput!]
    requests: [RequestInput]
    hoaFeePaid: [HoaFeePaidInput]
    violations: [ViolationInput]
  }

  type Mutation {
    updateHouse(houseInput: HouseInput!): Lot
  }
`;

exports.resolvers = {
  Query: {
    house: (_,args) => {
      return House
        .find()
        .then(houses => {
          const house = houses.filter(house => house.lot === args.lot)[0];
          return {
            ...house._doc,
            _id: house._id.toString()
          }
        })
        .catch(err => {
          throw err
        });
      // return houses.filter(house => house.lot === args.lot)[0]
    },
    address: (_, args) => {
      return House
        .find()
        .then(houses => {
          const house = houses.filter(house => {
            if (args.number) {
              const re = new RegExp(`${args.number}`,'g');
              return house.address.match(re)
            }
          })[0];
          return {
            ...house._doc,
            _id: house._id.toString()
          }
        })
        .catch(err => {
          throw err
        });
      // return houses.filter(house => house.lot === args.lot)[0]
    }
  },
  Mutation: {
    updateHouse: (_,args) => {
      const house = new House({
        _id: args.houseInput.id,
        lot: args.houseInput.lot,
        address: args.houseInput.address,
        contactInfo: args.houseInput.contactInfo,
        owners: args.houseInput.owners,
        hoaFeePaid: args.houseInput.hoaFeePaid,
        requests: args.houseInput.requests,
        violations: args.houseInput.violations
      });
      return house
        .save()
        .then(result => {
          return {...result._doc, _id: result.id};
        }).catch(err => {
          console.log(err);
          throw err;
        });
    }
  }
};