import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})
export class NewItemPage {

  categories$: Observable<any>;
  name: string;
  categoryId: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public provider: ShoppingListProvider) {

    this.categories$ = provider.getAllCategories();
  }

  save(){
    this.provider.createItem(this.name, this.categoryId);
    this.viewCtrl.dismiss();
  }
}
