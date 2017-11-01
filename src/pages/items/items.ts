import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  items$: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provider: ShoppingListProvider) {
  
    const category = navParams.get("category");
  
    if (category) {
      this.items$ = provider.getItems(category);
    }
    else {
      this.items$ = provider.getAllItems()
    }
  }
}