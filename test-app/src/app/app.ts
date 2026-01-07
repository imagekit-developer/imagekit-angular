import { Component } from '@angular/core';
import { IKImageComponent, IKVideoComponent } from '@imagekit/angular';
import { CommonModule } from '@angular/common';
import { UploadTestComponent } from './upload-test';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IKImageComponent, IKVideoComponent, UploadTestComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Basic Test - Matching React SDK';
  activeTab: 'display' | 'upload' = 'display';

  setActiveTab(tab: 'display' | 'upload'): void {
    this.activeTab = tab;
  }
}
