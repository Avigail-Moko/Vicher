import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
interface res{
  name:String;
}

@Component({
  selector: 'app-product-stepper',
  templateUrl: './product-stepper.component.html',
  styleUrls: ['./product-stepper.component.scss'],
})
export class ProductStepperComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  displayPart: any;
categories:res[] | undefined;
filteredCategories:any[] | undefined;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuild: FormBuilder,
    private newService: NewService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    this.displayPart = data.displayPart; // השמה של ערך המשתנה שהועבר דרך ה-DATA
  }

  errorMessage = '';
  message = '';
  textInput: string = '';
  noteCount: number = 0;
  value: number = 0;
  stepSize: number = 0;

  selectedFile: File | null = null;
  formData: FormData = new FormData();

  firstFormGroup = this.formBuild.group({
    lesson_title: ['', Validators.required],
  });
  secondFormGroup = this.formBuild.group({
    category: ['', Validators.required],
  });
  thirdFormGroup = this.formBuild.group({
    price: ['', Validators.required],
  });
  fourthFormGroup = this.formBuild.group({
    length: ['', Validators.required],
  });
  fifthFormGroup = this.formBuild.group({
    description: ['', Validators.required],
  });
  sixthFormGroup = this.formBuild.group({
    image: ['', Validators.required],
  });

  onStepChange(event: any) {
    const totalSteps = this.stepper.steps.length;
    this.value = event.selectedIndex * Math.floor(100 / (totalSteps - 1));
  }

 
  ngOnInit() {
    this.http.get<any[]>('assets/categories.JSON').subscribe((data) => {
      this.categories = data;
    });
  }

  /*התהליך מצליח
  יש תקלה רק במידה ומנסים לעלות קובץ מעל 3 מגהבייט ואחכ מנסים להחליף למשהו קטן יותר, לא מצליחים לשמור את המוצר. */
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];

      // Check file size
      if (files[0].size > 3 * 1024 * 1024) {
        // alert('File size should be less than 3 MB.');
        this.selectedFile = null;
        this.sixthFormGroup
          .get('image')
          ?.setErrors({ sizeLimitExceeded: true });
        // Reset file input
        // this.sixthFormGroup.get('image').setValue('');
        // return;
      } else {
        this.formData.set('image', this.selectedFile, this.selectedFile.name);
        // File is within the size limit
        this.sixthFormGroup.get('image')?.setErrors(null);
      }
    }
  }
  createProduct() {
    // Adding userId from localStorage
    this.formData.append('userId', localStorage.getItem('userId'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    this.formData.append('userProfileName', userProfile.name);
    this.formData.append('userProfileImage', userProfile.profileImage);

    // Adding form values
    Object.entries({
      ...this.firstFormGroup.value,
      category:this.secondFormGroup.value.category,
      ...this.thirdFormGroup.value,
      length: this.fourthFormGroup.value.length,
      ...this.fifthFormGroup.value,
    }).forEach(([key, value]) => {
      this.formData.append(key, value);
    });
    /* למה אין פה את אותה שורה שמיוחדת לשמירת התמונה? הצאט ממליץ על :
     ngOnInit() {
    this.sixthFormGroup = this.formBuilder.group({
      image: [''] // You may need to adjust this based on your actual form structure
    });
  }*/
    this.newService.createProduct(this.formData).subscribe(
      (data) => {
        console.log('Response:', data);
        this.dialog.closeAll();
        window.location.reload(); // רענון העמוד
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

  getFileExtension(fileName: string | string[]) {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  // updateNoteCount() {
  //   this.noteCount = this.textInput.length;
  // }
  validationMessages = {
    image: [{ type: 'sizeLimitExceeded', message: 'הקובץ עולה על 2 MB' }],
  };


  filterCategory(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.data.categories; i++) {
        let country = (this.categories as any[])[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredCategories = filtered;
}
}
