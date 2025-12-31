import { Component } from '@angular/core';
import { IKImageComponent, IKVideoComponent } from '@imagekit/angular';
import { CommonModule } from '@angular/common';
import { UploadTestComponent } from './upload-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IKImageComponent, IKVideoComponent, UploadTestComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Basic Test - Matching React SDK';
  activeTab: 'display' | 'upload' = 'display';

  setActiveTab(tab: 'display' | 'upload'): void {
    this.activeTab = tab;
  }
}
