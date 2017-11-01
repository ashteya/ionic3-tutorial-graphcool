import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ItemsPage } from '../items/items';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  public categories$: Observable<any>;
  
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public provider: ShoppingListProvider) {
  
      this.categories$ = provider.getAllCategories();
    }

    showItems(category) {
      this.navCtrl.push(ItemsPage, { category: category });
    }
}