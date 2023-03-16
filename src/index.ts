import {
  buildSchema,
  GraphQLObjectType,
  GraphQLSchema,
  graphqlSync,
} from "graphql";
import { mapSchema, MapperKind } from "@graphql-tools/utils";

const schema = buildSchema(/* GraphQL */ `
  enum TestEnum {
    VALUE1
    VALUE2
  }
  type Query {
    version: TestEnum
  }
`);

const testReturnVal = "NEW_VALUE";
const newSchema = mapSchema(schema, {
  [MapperKind.ENUM_TYPE]: (enumType) => {
    enumType.serialize = function newSerialize(_outputValue: unknown): string {
      return testReturnVal;
    };
    return enumType;
  },
  [MapperKind.QUERY]: (type) => {
    const queryConfig = type.toConfig();
    queryConfig.fields["version"].resolve = () => "VALUE1";
    return new GraphQLObjectType(queryConfig);
  },
});

const result = graphqlSync({
  schema: newSchema,
  source: /* GraphQL */ `
    {
      version
    }
  `,
});

console.log(result.data);
