import { Routes } from "@angular/router";
import { HeroesFormComponent } from "./components/heroes-form/heroes-form.component";
import { HeroesListComponent } from "./components/heroes-list/heroes-list.component";

export const routes: Routes = [
    { path: "", component: HeroesListComponent },
    { path: "heroes-form", component: HeroesFormComponent },
];
