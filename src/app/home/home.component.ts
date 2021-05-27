import { ThrowStmt } from '@angular/compiler';
import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  productLoaded: boolean = false;
  scrollLoad: boolean = false;

  products:any[] = [];
  allProducts:any[] = [];

  sorts:any[] = [
    {
      name: 'Size',
      value: 'size'
    },
    {
      name: 'Price',
      value: 'price'
    },
    {
      name: 'Id',
      value: 'id'
    }
  ]
  count: number;

  constructor(private service: ApiserviceService) { }

  ngOnInit(): void {
    this.productLoaded = false;
    this.service.getProducts().subscribe(
      res=> {        
        this.setProductList(res);
      }
    );
    this.count = 16;
  }

  setProductList(res){
    this.allProducts = res;
    this.products = this.allProducts.slice(0,12);
    this.productLoaded = true;        
  }

  // Scroll Load Items

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.bottomReached()) {      
      if (this.count + 4 <= this.allProducts.length) {
        this.scrollLoad = true;
        this.products = this.allProducts.slice(0, this.count);
        this.count = this.count + 4;
      }
      else if(this.products.length < this.allProducts.length){
        this.products = this.allProducts;
      }
      this.scrollLoad = false;      
    }
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

  // Sort Items

  sortProducts(event){    
    this.productLoaded = false;
    this.service.sortProduct(event.value).subscribe(
      res=> {                 
        this.setProductList(res);
        this.count = 16;
      }
    )
  }


  getModifiedDate(date){
    let currentDate = new Date();
    let faceDate = new Date(date);

    let timeDiff = Math.floor((new Date().getTime() - faceDate.getTime()) / 1000);
    
    var interval = Math.floor(timeDiff/60);   // minutes

    if(interval < 60){
      return interval + " minutes ago";
    }

    interval = Math.floor(interval/60);  // hours

    if(interval < 24){
      return interval + " hours ago";
    }

    interval = Math.floor(interval/24); //days

    if(interval > 1){
      return interval + " days ago";
    }
  }

}
