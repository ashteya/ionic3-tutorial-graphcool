import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { GraphQLModule } from './graphql.module';
import { ShoppingListProvider } from '../providers/shopping-list/shopping-list';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { ItemsPageModule } from '../pages/items/items.module';
import { CategoriesPageModule } from '../pages/categories/categories.module';
import { NewItemPageModule } from '../pages/new-item/new-item.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    GraphQLModule,
    TabsPageModule,
    ItemsPageModule,
    CategoriesPageModule,
    NewItemPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShoppingListProvider
  ]
})
export class AppModule {}
