import { Injectable } from '@angular/core';
import {HttpClient , HttpHeaders} from '@angular/common/http';
import {Product} from '../app/Models/Product';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  httpoptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    allowOrigin: new HttpHeaders({'Access-Control-Allow-Origin' :  '*'})
  };

  productTypes = [{isSelected: false, type: 'HeadPhone'}, { isSelected: false, type: 'Laptop'}
                ,{isSelected: false, type: 'Mobile'}, { isSelected: false, type: 'Sunglass'},
                {isSelected: false, type: 'Television'},{ isSelected: false, type: 'Trimmer'},{ isSelected: false, type: 'WashingMachine'}];

  constructor(private http: HttpClient) { }

  buildUrl(endpoint?): string
  {
    let url = `https://localhost:44342/api/Products/`;
    if (endpoint){
      url = `https://localhost:44342/api/Products/${endpoint}` ;
    }
    return url;
  }

  createPayload(formData , action){
    let payLoad = {};
    if (action === 'UpdateProduct')
    {
      payLoad['prodId'] = formData.prodId;
    }
    payLoad['prodType'] = formData['prodType'];
    payLoad['prodPrice'] = Number(formData['prodPrice']);
    payLoad['prodManufacturer'] = formData['prodManufacturer'];
    payLoad['prodRating'] = Number(formData['prodRating']);
    payLoad['YearOfManuf'] = Number(formData['YearOfManuf']);

    return payLoad;
  }
  getAllProducts(): Observable<any>{
   const url = this.buildUrl();
   return this.http.get<any>(url ).pipe(map(res => {
     let products: Array<Product> = [];
     res.map(data => {
       const product = {
        prodId: data.prodId,
        prodType: data.prodType,
        prodPrice: data.prodPrice,
        prodManufacturer: data.prodManufacturer,
        prodRating: data.prodRating,
        YearOfManuf: data.yearOfManuf
       };
       products.push(product);
     });
     return products;
   })) ;
  }

  getSpecificProduct(id: number): Observable<any>
  {
    const url = this.buildUrl(id);
    return this.http.get<any>(url).pipe(map(data => {
      const product = {
        prodId: data.prodId,
        prodType: data.prodType,
        prodPrice: data.prodPrice,
        prodManufacturer: data.prodManufacturer,
        prodRating: data.prodRating,
        YearOfManuf: data.yearOfManuf
      };
      return product;
    }));
  }

  updateProduct(id: number, formData): Observable<any>
  {
    const url = this.buildUrl(id);
    const payLoad =  this.createPayload(formData , 'UpdateProduct');

    return this.http.put<any>(url, payLoad , this.httpoptions);
  }

  createProduct(formData): Observable<any>{
    const url = this.buildUrl();
    const payload = this.createPayload(formData , '');
    return this.http.post<any>(url , payload , this.httpoptions);
  }

  deleteProduct(id: number): Observable<any>
  {
    const url = this.buildUrl(id);
    return this.http.delete<any>(url);
  }

  getProductTypes(): Array<any>{
    return this.productTypes;
  }
}
