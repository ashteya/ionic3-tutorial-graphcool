import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const queryAllItems = gql`
query allItems {
  allItems {
    id
    name
    done
    category {
      id
    }
  }
}
`;

const queryAllCategories = gql`  
query allCategories {
  allCategories {
    id
    name
  }
}
`;

const mutationToggleItem = gql`
mutation($id: ID!, $done: Boolean) {
  updateItem(
    id: $id
    done: $done
  ) {
    id
    done
  }
}
`;

const mutationCreateItem = gql`
mutation($name: String!, $categoryId: ID) {
  createItem(
    name: $name,
    categoryId: $categoryId
  ) {
    id
    name
    done
    category {
      id
    }
  }
}
`;

const mutationDeleteItem = gql`
mutation($id: ID!) {
  deleteItem(id: $id) {
    id
  }
}
`;

const subscription = gql`
subscription newItems {
  Item(
    filter: {
      mutation_in: [CREATED, UPDATED, DELETED]
    }
  ) {
    mutation
    node {
      id
      name
      done
      category {
        id
      }
      createdAt
      updatedAt
    }
    previousValues {
      id
    }
  }
}
`;


@Injectable()
export class ShoppingListProvider {

  constructor(private apollo: Apollo) { }

  getAllItems(): Observable<any> {
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllItems
    });

    this.subscribeToChanges(queryWatcher);

    return queryWatcher.valueChanges
      .map(result => result.data.allItems);;
  }

  getAllCategories(): Observable<any> {
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllCategories
    });

    return queryWatcher.valueChanges
      .map(result => result.data.allCategories);
  }

  getItems(category: any): Observable<any> {
    return this.getAllItems()
      .map(data => data.filter(i => i.category && i.category.id == category.id));
  }

  toggleItem(item: any): void {
    this.apollo.mutate({
      mutation: mutationToggleItem,
      variables: {
        id: item.id,
        done: !item.done
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  createItem(name, categoryId): void {
    this.apollo.mutate({
      mutation: mutationCreateItem,
      variables: {
        name: name,
        categoryId: categoryId
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  deleteItem(item: any): void {
    this.apollo.mutate({
      mutation: mutationDeleteItem,
      variables: {
        id: item.id
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  private subscribeToChanges(query: QueryRef<any>) {
    query.subscribeToMore({
      document: subscription,
      updateQuery: (prev: any, { subscriptionData }) => {

        const item = (subscriptionData as any).Item;

        if (item.mutation == 'CREATED') {
          return Object.assign({}, prev, {
            allItems: prev.allItems.concat(item.node)
          });
        }
        else if (item.mutation == 'DELETED') {
          return Object.assign({}, prev, {
            allItems: prev.allItems.filter(i => i.id !== item.previousValues.id)
          });
        }
      }
    });    
  }
}
