import { Component } from '@angular/core';
import { IKImageComponent, IKVideoComponent } from '@imagekit/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IKImageComponent, IKVideoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Basic Test - Matching React SDK';
}
