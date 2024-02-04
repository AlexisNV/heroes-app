import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Hero } from "../../models/hero.model";
import { MatButtonModule } from "@angular/material/button";
import { HeroesService } from "../../services/heroes.service";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { switchMap, take } from "rxjs/operators";
import { UpperCaseDirective } from "../../directives/upper-case.directive";

@Component({
    selector: "app-heroes-form",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        RouterModule,
        UpperCaseDirective,
    ],
    templateUrl: "./heroes-form.component.html",
    styleUrl: "./heroes-form.component.css",
})
export class HeroesFormComponent implements OnInit {
    // Héroe que se ha seleccionado para editar.
    hero!: Hero;
    heroForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private heroesService: HeroesService,
        private router: Router,
        private snackbar: MatSnackBar,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            if (id) {
                this.createEditForm(+id);
            } else {
                this.createNewForm();
            }
        });
    }

    /**
     * Función que crea un nuevo formulario desde cero.
     */
    createNewForm() {
        this.heroesService
            .getHeroes()
            .pipe(take(1))
            .subscribe((heroes) => {
                if (heroes && heroes.length > 0) {
                    const lastId = heroes[heroes.length - 1].id;
                    this.heroForm = this.fb.group({
                        id: [{ value: lastId ? lastId + 1 : 1, disabled: true }, Validators.required],
                        name: ["", Validators.required],
                        age: [0, [Validators.required]],
                        powers: this.fb.array([]),
                    });
                }
            });
    }

    /**
     * Función que crea el formulario a partir del héroe que se ha seleccionado para editar.
     * @param id number
     */
    createEditForm(id: number) {
        this.heroesService
            .getHero(id)
            .pipe(take(1))
            .subscribe((hero) => {
                if (hero) {
                    this.hero = hero;
                    this.heroForm = this.fb.group({
                        id: [{ value: hero.id, disabled: true }, Validators.required],
                        name: [hero.name, Validators.required],
                        age: [hero.age, [Validators.required]],
                        powers: this.fb.array(hero.powers),
                    });
                }
            });
    }

    /**
     * Función que obtiene el array de poderes del formulario.
     */
    get powers(): FormArray {
        return this.heroForm.get("powers") as FormArray;
    }

    /**
     * Función que agrega al array de los poderes un nuevo campo.
     */
    addPower(): void {
        this.powers.push(this.fb.control(""));
    }

    /**
     * Función que elimina un campo, especificado por su índice, del array de los poderes.
     * @param index number
     */
    removePower(index: number): void {
        this.powers.removeAt(index);
    }

    /**
     * Función para guardar el nuevo héroe o para editar el que se había seleccionado.
     */
    onSubmit(): void {
        if (this.heroForm.valid) {
            if (this.hero) {
                this.heroesService
                    .editHero(this.hero.id, this.heroForm.getRawValue())
                    .pipe(take(1))
                    .subscribe((hero) => {
                        this.router.navigate([""]);
                        const newName = this.hero.name !== hero.name ? `Nuevo nombre: ${hero.name}` : "";
                        this.showSnackbar(`Se ha editado el heroe ${this.hero.name} existosamente. ${newName}`);
                    });
            } else {
                this.heroesService
                    .addHero(this.heroForm.getRawValue())
                    .pipe(take(1))
                    .subscribe((hero) => {
                        this.router.navigate([""]);
                        this.showSnackbar(`Se ha creado el heroe ${hero.name} existosamente.`);
                    });
            }
        }
    }

    /**
     * Función que lanza el snackbar de Angular Material con el mensaje que se le especifique.
     * @param message string
     */
    showSnackbar(message: string) {
        this.snackbar.open(message, "Cerrar", {
            duration: 2500,
            verticalPosition: "top",
        });
    }
}
