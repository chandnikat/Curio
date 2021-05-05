const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const { ModuleFilenameHelpers } = require("webpack");

//
// objectID: int
// accessionYear: string
// isPublicDomain: boolean
// primaryImage: string
// constituents: array (each object contains constituentID: int, name: string)
// department: string
// objectName: string
// title: string
// culture: string
// period: string
// artistDisplayName: string
// artistDisplayBio: string
// artistNationality: string
// objectDate: string
// objectBeginDate: int
// objectEndDate: int
// objectUrl: string
// tags: array (each object contains term: string)

//Image Type
const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    objectID: { type: GraphQLInt },
    accessionYear: { type: GraphQLString },
    isPublicDomain: { type: GraphQLBoolean },
    primaryImage: { type: GraphQLString },
    constituents: { type: new GraphQLList(ConstituentsType) },
    department: { type: GraphQLString },
    objectName: { type: GraphQLString },
    title: { type: GraphQLString },
    culture: { type: GraphQLString },
    period: { type: GraphQLString },
    artistDisplayName: { type: GraphQLString },
    artistDisplayBio: { type: GraphQLString },
    artistNationality: { type: GraphQLString },
    objectDate: { type: GraphQLString },
    objectBeginDate: { type: GraphQLInt },
    objectEndDate: { type: GraphQLInt },
    objectUrl: { type: GraphQLString },
    tags: { type: new GraphQLList(TagType) },
  }),
});

//Constituents Type
const ConstituentsType = new GraphQLObjectType({
  name: "Constituents",
  fields: () => ({
    constituentID: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

//Tag type
const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    term: { type: GraphQLString },
  }),
});

const ImagesType = new GraphQLObjectType({
  name: "Images",
  fields: () => ({
    total: { type: GraphQLInt },
    objectIDs: { type: new GraphQLList(GraphQLInt) },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Images: {
      type: ImagesType,
      resolve(parent, args) {
        return axios
          .get(
            "https://collectionapi.metmuseum.org/public/collection/v1/objects"
          )
          .then((response) => response.data);
      },
    },
    Image: {
        type: ImageType,
        args: {
            objectID: {type: GraphQLInt}
        },
        resolve(parent, args) {
            return axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${args.objectID}`)
            .then((response) => response.data);
        }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
