import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private members = signal([]);
  ngOnInit(): void {
   this.http.get('https://localhost:5001/api/members').subscribe({
    next: Response => console.log(Response),
    error: error => console.log(error),
    complete:() => console.log('Completed the http reguest')
   })
  }


}
