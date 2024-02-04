import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeroesListComponent } from "./components/heroes-list/heroes-list.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, HeroesListComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "Heroes";
}
