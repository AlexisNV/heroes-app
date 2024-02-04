import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Hero } from "../../models/hero.model";
import { CommonModule } from "@angular/common";
import { SeparateDataPipe } from "../../pipes/separate-data.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-heroes-detail",
    standalone: true,
    imports: [CommonModule, SeparateDataPipe, MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: "./heroes-detail.component.html",
    styleUrl: "./heroes-detail.component.css",
})
export class HeroesDetailComponent {
    // Héroe seleccionado para ver su detalle.
    @Input() hero!: Hero;

    @Output() onDelete = new EventEmitter<Hero>();

    deleteHero(hero: Hero) {
        this.onDelete.emit(hero);
    }
}
