import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsEditDialogComponent } from './products-edit-dialog.component';

describe('ProductsEditDialogComponent', () => {
  let component: ProductsEditDialogComponent;
  let fixture: ComponentFixture<ProductsEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsEditDialogComponent]
    });
    fixture = TestBed.createComponent(ProductsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
