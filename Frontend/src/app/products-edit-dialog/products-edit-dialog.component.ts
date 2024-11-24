import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { HttpClient } from '@angular/common/http';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-products-edit-dialog',
  templateUrl: './products-edit-dialog.component.html',
  styleUrls: ['./products-edit-dialog.component.scss'],
  
})

export class ProductsEditDialogComponent {
  // @Input() product: any; // Input property to receive product data
  // @Input() userProfile: any; // Input property to receive product data
  
  product: any;
  userProfile: any;
  isClickedOutside: any;
  displayPart: any;
  productsForm:FormGroup;
  filteredCategories: any[] = [];
  categories:any[]=[];

  constructor(public dialogRef: MatDialogRef<ProductsEditDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private newService:NewService,private pf:FormBuilder,    private http: HttpClient
) {

    this.displayPart = data.displayPart; // השמה של ערך המשתנה שהועבר דרך ה-DATA
    this.product = data.product; // Assign received data to product property
    this.userProfile = data.userProfile;

    this.productsForm=this.pf.group({
      lesson_title: [''],
      category: [ ''],
      price: [''],
      length: [ null],
      description: [ '']
    })
  }
  onRadioChange(value:number){
    this.productsForm.controls['length'].setValue(value);
        console.log(this.productsForm);
  }

  saveChanges(_id:any){
    const productsForm = this.productsForm.value;   

console.log(productsForm)
    this.newService.updateProduct(_id,productsForm).subscribe((data)=>{
      console.log('Response:', data);
      console.log(productsForm);
      this.product.lesson_title=this.productsForm.get('lesson_title').value;
      window.location.reload(); 
    },
    (error) => {
      console.error('Error:', error.error.message);
    })
  }
  ngOnInit() {
    this.http.get<any[]>('assets/categories.JSON').subscribe((data) => {
      this.categories = data; 
    });
  }
  
  filterCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCategories = this.categories
      .filter(obj => obj.name.toLowerCase().indexOf(query) === 0)
      .map(obj => obj.name);
}

}
