import {ChangeDetectionStrategy, Component} from '@angular/core';

import {EMPTY, Subject} from 'rxjs';
import {ProductService} from '../product.service';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedProduct$ = this.productService.selectedProduct$;

  products$ = this.productService.productsWithCategory$.pipe(
    catchError(error => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    }));

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.setNewSelectedProduct(+productId);
  }
}
