"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const schema = (0, graphql_1.buildSchema)(/* GraphQL */ `
  enum TestEnum {
    VALUE1
    VALUE2
  }
  type Query {
    version: TestEnum
  }
`);
const testReturnVal = "NEW_VALUE";
const newSchema = (0, utils_1.mapSchema)(schema, {
    [utils_1.MapperKind.ENUM_TYPE]: (enumType) => {
        enumType.serialize = function newSerialize(_outputValue) {
            return testReturnVal;
        };
        return enumType;
    },
    [utils_1.MapperKind.QUERY]: (type) => {
        const queryConfig = type.toConfig();
        queryConfig.fields["version"].resolve = () => "VALUE1";
        return new graphql_1.GraphQLObjectType(queryConfig);
    },
});
const result = (0, graphql_1.graphqlSync)({
    schema: newSchema,
    source: /* GraphQL */ `
    {
      version
    }
  `,
});
console.log(result.data);
