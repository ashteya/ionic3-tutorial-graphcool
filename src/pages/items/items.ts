import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';
import { NewItemPage } from '../new-item/new-item';

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  items$: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public provider: ShoppingListProvider) {

    const category = navParams.get("category");

    if (category) {
      this.items$ = provider.getItems(category);
    }
    else {
      this.items$ = provider.getAllItems()
    }
  }

  toggle(item) {
    this.provider.toggleItem(item);
  }

  goToAddItem() {
    const modal = this.modalCtrl.create(NewItemPage);
    modal.present();
  }

  delete(item) {
    this.provider.deleteItem(item);
  }
}