import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

import { Apollo } from 'apollo-angular';
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
    id,
    name,
    done,
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

@Injectable()
export class ShoppingListProvider {

  constructor(private apollo: Apollo) { }

  getAllItems(): Observable<any> {
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllItems
    });

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
      },
      update: (proxy, { data: { createItem } }) => {

        // Read the data from the cache for the allItems query
        const data: any = proxy.readQuery({ query: queryAllItems });

        // Add the new item to the data
        data.allItems.push(createItem);

        // Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data });
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
      },
      update: (proxy, { data: { deleteItem } }) => {
        // Read the data from the cache for the allItems query
        let data: any = proxy.readQuery({ query: queryAllItems });

        // Remove the item from the data
        data.allItems = data.allItems.filter(i => i.id !== deleteItem.id);

        // Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data });
      }
    })
    .subscribe(response => console.log(response.data),
                error => console.log('Mutation Error:', error));
  }
}
