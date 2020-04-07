import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {EMPTY, Observable, combineLatest, BehaviorSubject, Subject} from 'rxjs';

import {Product} from './product';
import {ProductService} from './product.service';
import {catchError, map} from 'rxjs/operators';
import {ProductCategoryService} from "../product-categories/product-category.service";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedActions = this.categorySelectedSubject.asObservable();

  categories$ = this.productCategoryService.productCategories$;
  productsWithCategory$ = this.productService.productsWithCategory$.pipe(
    catchError(error => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    }));

  products$ = combineLatest([
    this.productsWithCategory$,
    this.categorySelectedActions
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(t => selectedCategoryId ? t.categoryId === selectedCategoryId : true))
  );


  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService,
              private chgRef: ChangeDetectorRef) { }


  onAdd(): void {
    this.productService.insertNewProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
