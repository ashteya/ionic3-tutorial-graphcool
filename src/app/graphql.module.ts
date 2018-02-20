import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const simpleAPI = 'PUT YOUR SIMPLE API ENDPOINT HERE';
const subscriptionAPI = 'PUT YOUR SUBSCRIPTION API ENDPOINT HERE';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo,
              httpLink: HttpLink) {


    const http = httpLink.create({ 
      uri: simpleAPI 
    });

    const ws = new WebSocketLink({ 
      uri: subscriptionAPI,
      options: {
        reconnect: true
      }
    });

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http,
    );

    apollo.create({
      link: link,
      cache: new InMemoryCache()
    });
  }
}