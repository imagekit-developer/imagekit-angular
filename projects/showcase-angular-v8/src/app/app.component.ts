import { Component } from "@angular/core";
import { environment } from '../environments/environment';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "imagekitio-angular8-showcase";
  transformationOne = [{ height: "200", width: "200" }];
  path = "/default-image.jpg";
  urlEndpoint = environment.urlEndpoint;
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
}
