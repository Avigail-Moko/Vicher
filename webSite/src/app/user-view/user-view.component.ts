import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductStepperComponent } from '../product-stepper/product-stepper.component';
import { NgForm } from '@angular/forms';
import { ProductsEditDialogComponent } from '../products-edit-dialog/products-edit-dialog.component';
import { MessageService } from 'primeng/api';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {
 //האם ניתן למחוק משתנה זה?
  // date: Date | undefined;
  value!: number;
  lesson_title: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: string | undefined;
  productsArray: any;
  form: NgForm;
  // inputValue: string = '';

  // isContentEditable = false;
  // errorMessage = '';
  message = '';
  responsiveOptions: any[] | undefined;
  userProfile:any


  // description: new FormControl('', Validators.maxLength(2))

  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    private messageService: MessageService,
    public confirmDialog: MatDialog,
    public router:Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.userProfile = navigation?.extras.state?.['exampleData'];}
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

 
  ngOnInit() {
    //responsive page
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

   
      this.newService.getProduct(this.userProfile._id).subscribe(
        (data) => {
          console.log('Response:', data);
  
          this.productsArray=data.product
          });
  }


  }
