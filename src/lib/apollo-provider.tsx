// src/lib/apollo-provider.tsx
"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { ApolloProvider as Provider } from "@apollo/client/react"; 

// We no longer need the authLink, the browser handles the cookie
const httpLink = new HttpLink({
    uri: "/api/graphql",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
    return <Provider client={client}>{children}</Provider>;
}