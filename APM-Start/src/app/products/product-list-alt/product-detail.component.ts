import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError, map, filter} from 'rxjs/operators';
import {EMPTY, Subject, combineLatest} from 'rxjs';
import {Product} from "../product";

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$.pipe(
    catchError(error => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    }));

  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Detail of : ${p.productName}` : null
      )
    );

  productSuppliers$ = this.productService.selectedProductSupplies$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  vm$ = combineLatest([
    this.product$,
    this.pageTitle$,
    this.productSuppliers$
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, pageTitle, productSuppliers]) => ({product, pageTitle, productSuppliers}))
  );

  constructor(private productService: ProductService) { }

}
