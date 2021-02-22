import { Component, OnInit } from '@angular/core';
import {Product} from '../Models/Product';
import {ProductsService} from '../products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product = {
    prodType: '',
    prodPrice: '',
    prodManufacturer: '',
    prodRating: '',
    YearOfManuf: ''
  };
  prodId;
  constructor(private service: ProductsService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.prodId = this.activatedRoute.snapshot.params['id'];
    this.service.getSpecificProduct(this.prodId).subscribe(res => {
      if(res){
        this.product = res;
      }
    });
  }

  BackToHome(){
    this.router.navigate(['']);
  }
}
