import { Component } from '@angular/core';
import { NewService } from '../new.service';

@Component({
  selector: 'app-searching-chart',
  templateUrl: './searching-chart.component.html',
  styleUrls: ['./searching-chart.component.scss']
})
export class SearchingChartComponent {
  query = '';
  results: any[] = [];

  constructor(private newService:NewService){}

  onSearch() {
    this.newService.search(this.query).subscribe(
      (data) => (this.results = data),
      (error) => console.error('Error fetching search results', error)
    );
  }

}
