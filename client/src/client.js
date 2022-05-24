import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/" }),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const query = gql`
  {
    characters {
      results {
        id
        name
      }
    }
  }
`;

// client.query({ query }).then((r) => console.log(r));

export default client;
