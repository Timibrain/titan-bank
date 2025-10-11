// src/lib/apollo-provider.tsx
"use client";

import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http"; 
import { ApolloProvider as Provider } from "@apollo/client/react";
import { setContext } from '@apollo/client/link/context';

// Create the HttpLink using the 'new' keyword
const httpLink = new HttpLink({
    uri: "/api/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
    return <Provider client={client}>{children}</Provider>;
}