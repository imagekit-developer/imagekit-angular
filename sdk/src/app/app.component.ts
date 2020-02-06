import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  transformationOne = [{ height: "200", width: "200" }];
  path = "/default-image.jpg";
  urlEndpoint = '<YOUR_URL_ENDPOINT>';
  getSrcFromPath = function getSrcFromPath(path: string, urlEndpoint:string) {
    if(path[0] === "/")
      path = path.split("/")[1];
    return `${urlEndpoint}/${path}`;
  };

  src = this.getSrcFromPath(this.path, this.urlEndpoint);

  transformationTwo = [
    { height: "200", width: "200" },
    {
      rotation: "90"
    }
  ];
  lqip = { active: true, quality: 30 };

  handleUploadSuccess(res) {
    console.log('File upload success with response: ', res);
  }

  handleUploadError(err) {
    console.log('There was an error in upload: ', err);
  }

  handleFileInput(event) {
    console.log('This is the event on file change: ', event);
  }
}
