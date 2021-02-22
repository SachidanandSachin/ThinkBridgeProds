import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ChangeDetectorRef, Inject , HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Product} from '../Models/Product';
import {ProductsService} from '../products.service';
import { DOCUMENT } from '@angular/common';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  ProdForm: FormGroup;
  windowScrolled: boolean;
  formHeader: string;
  showForm: boolean = false;
  showAddBtn: boolean = true;
  products: Array<Product> = [];
  productTypes = [];
  disableSubmitBtn: boolean;
  product: Product = {
    prodType: '',
    prodPrice: '',
    prodManufacturer: '',
    prodRating: '',
    YearOfManuf: ''
  };
  constructor(private cd: ChangeDetectorRef,
    private fb: FormBuilder,
     private service: ProductsService,
     private toastr: ToastrService,
     @Inject(DOCUMENT) private document: Document) {
       this.buildForm();
     }
     @HostListener("window:scroll", [])
     onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
          this.windowScrolled = true;
      }
     else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
  }
  scrollToTop() {
      (function smoothscroll() {
          var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, currentScroll - (currentScroll / 8));
          }
      })();
  }

  ngOnInit(): void {
    this.formHeader = 'Add ';
    this.defaultcalls();
    this.productTypes = this.service.getProductTypes();
    this.buildForm();
  }

  defaultcalls(){
    this.service.getAllProducts().subscribe(productList => {
      if (productList){
        this.products = productList;
        this.cd.detectChanges();
      }
    });
  }

  buildForm()
  {
    this.ProdForm =  this.fb.group({
      prodType:[this.product.prodType , Validators.required],
      prodPrice: [this.product.prodPrice,[Validators.min(1), Validators.required] ],
      prodManufacturer: [this.product.prodManufacturer, Validators.maxLength(20)],
      prodRating: [this.product.prodRating ],
      YearOfManuf: [this.product.YearOfManuf , [Validators.min(1990), Validators.max(2021) ]]
    });
    if(this.formHeader === 'Edit ')
    {
      this.disableSubmitBtn = this.ProdForm.invalid;
    }
    this.ProdForm.valueChanges.subscribe(val => {
      this.cd.detectChanges();
      this.product = {...this.product , ...val};
    });
  }

  onClickAdd(){
    this.showForm = true;
    this.showAddBtn = false;
  }

  RemoveProduct(product: Product)
  {
    this.service.deleteProduct(product.prodId).subscribe(res => {
      this.toastr.success('Product Successfully Deleted !!');
      this.defaultcalls();
    },
    error => {
      this.toastr.error(error);
    });
  }

  EditProduct(prod: Product){
    this.formHeader = 'Edit ';
    this.product = prod;
    this.product['prodId'] = prod.prodId;
    this.showForm = true;
    this.showAddBtn = false;
    this.buildForm();
    this.scrollToTop();
    this.productTypes.forEach(curr => {
      if (curr.type === prod.prodType)
      {
        curr.isSelected = true;
      }
    });
  }

  ResetForm(){
    this.ProdForm.reset();
    this.showForm = false;
    this.showAddBtn = true;
    this.formHeader = 'Add ';
    this.product = null;
    this.productTypes.forEach(curr => {
      curr.isSelected = false;
    });
  }

  SubmitForm(){
    this.showForm = false;
    this.showAddBtn = true;
    if (this.formHeader === 'Edit ')
    {
      this.service.updateProduct(this.product.prodId, this.product).subscribe(response => {
        this.defaultcalls();
        this.toastr.success('Product updated !!');
      },
      error => {
        this.toastr.error('Error while updating product details');
      });
    }
    else {
      this.service.createProduct(this.product).subscribe(res => {
        this.defaultcalls();
        this.toastr.success('New Product added');
      });
    }
    this.ProdForm.reset();
  }

  navBarAction(action)
  {
    this.products = this.products.sort((a, b) =>
      a.prodRating > b.prodRating ? 1 : b.prodRating > a.prodRating ? -1 : 0
    );
    this.products.reverse();
    this.cd.detectChanges();
  }
}
