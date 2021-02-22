import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductComponent} from './product/product.component';
import {ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavbarComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 2000 , positionClass: 'toast-top-right'})
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [ProductsComponent, ProductComponent]
})
export class AppModule { }
