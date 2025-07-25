import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';

// interface AutoCompleteCompleteEvent {
//   originalEvent: Event;
//   query: string;
// }
// interface res{
//   name:String;
// }

@Component({
  selector: 'app-product-stepper',
  templateUrl: './product-stepper.component.html',
  styleUrls: ['./product-stepper.component.scss'],
})
export class ProductStepperComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  // displayPart: any;
  categories: any[] = ['']; // Property to hold the categories
  filteredCategories: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuild: FormBuilder,
    private newService: NewService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    // this.displayPart = data.displayPart; // השמה של ערך המשתנה שהועבר דרך ה-DATA
  }

  errorMessage = '';
  message = '';
  textInput: string = '';
  noteCount: number = 0;
  value: number = 0;
  stepSize: number = 0;

  shouldValidateForm: boolean = true;
  selectedFile: File | null = null;
  formData: FormData = new FormData();

  firstFormGroup = this.formBuild.group({
    lesson_title: ['', Validators.required],
  });
  secondFormGroup = this.formBuild.group({
    category: ['', [Validators.required, this.categoryValidator.bind(this)]],
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
      this.filteredCategories = this.secondFormGroup
        .get('category')!
        .valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories
      .map((category) => category.name)
      .filter((name) => name.toLowerCase().includes(filterValue));
  }

  categoryValidator(control: AbstractControl): { [key: string]: any } | null {
    return this.categories.map((c) => c.name).includes(control.value)
      ? null
      : { invalidCategory: true };
  }
  isCategorySelected(): boolean {
    return this.categories
      .map((c) => c.name)
      .includes(this.secondFormGroup.get('category')?.value);
  }

  toggleValidation(isChecked: boolean) {
    this.shouldValidateForm = !isChecked;
    if (isChecked) {
      this.sixthFormGroup.get('image')?.setErrors(null);
      this.selectedFile = null;
      // this.formData.set('image', this.selectedFile, this.selectedFile.name);
      this.loadDefaultImage();

    }  
  }
  loadDefaultImage() {
    const defaultImagePath = '/assets/default-image.png';
    
    fetch(defaultImagePath)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "default-image.png", { type: blob.type });
        this.selectedFile = file;
        this.formData.set('image', file);
      })
      .catch(err => console.error('Error loading default image:', err));
  }

  validateFile(file: File): string | null {
    if (!file.type.startsWith('image/')) return 'invalidFileType';
    if (file.size > 3 * 1024 * 1024) return 'sizeLimitExceeded';
    return null;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
      const error = this.validateFile(this.selectedFile);

      if (error) {
        this.sixthFormGroup.get('image')?.setErrors({ [error]: true });
        this.selectedFile = null;
      } else {
        this.sixthFormGroup.get('image')?.setErrors(null);
        this.formData.set('image', this.selectedFile, this.selectedFile.name);
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
      category: this.secondFormGroup.value.category,
      ...this.thirdFormGroup.value,
      length: this.fourthFormGroup.value.length,
      ...this.fifthFormGroup.value,
    }).forEach(([key, value]) => {
      this.formData.append(key, value);
    });

for (const [key, value] of (this.formData as any).entries()) {
  console.log(`${key}: ${value}`);
}

    this.newService.createProduct(this.formData).subscribe(
      (data) => {
        console.log('Response:', data);
        this.dialog.closeAll();
        window.location.reload();
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

  validationMessages = {
    image: [
      {
        type: 'sizeLimitExceeded',
        message: 'The file exceeds the size limit of 3 MB.',
      },
      {
        type: 'invalidFileType',
        message: 'Invalid file type. Only image files are allowed.',
      },
    ],
  };
}
