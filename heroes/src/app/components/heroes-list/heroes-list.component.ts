import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { HeroesService } from "../../services/heroes.service";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Hero } from "../../models/hero.model";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { HeroesDetailComponent } from "../heroes-detail/heroes-detail.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SeparateDataPipe } from "../../pipes/separate-data.pipe";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { RouterModule } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";

@Component({
    selector: "app-heroes-list",
    standalone: true,
    templateUrl: "./heroes-list.component.html",
    styleUrl: "./heroes-list.component.css",
    imports: [
        MatTableModule,
        MatPaginatorModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        HeroesDetailComponent,
        SeparateDataPipe,
        MatDividerModule,
        RouterModule,
    ],
})
export class HeroesListComponent implements AfterViewInit {
    // Paginador de Angular Material.
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    // Drawer de Angular Material donde enseñamos el detalle del héroe seleccionado.
    @ViewChild("drawer") drawer!: MatDrawer;

    // Array de héroes que se usa para la tabla paginada de Angular Material.
    heroesSource!: MatTableDataSource<Hero>;
    // Columnas que se van a enseñar en la tabla de Angular Material.
    columns: string[] = ["id", "name", "age", "powers", "actions"];

    // Héroe seleccionado para el detalle.
    selectedHero!: Hero;

    constructor(public heroesService: HeroesService, public dialog: MatDialog, private snackbar: MatSnackBar) {
        this.heroesService
            .getHeroes()
            .pipe(takeUntilDestroyed())
            .subscribe((heroes) => {
                this.heroesSource = new MatTableDataSource(heroes);
            });
    }

    ngAfterViewInit(): void {
        this.heroesSource.paginator = this.paginator;
    }

    /**
     * Función para filtrar los datos de la tabla, filtra por id, nombre, edad e incluso por poderes.
     * @param event KeyboardEvent
     */
    applyFilter(event: KeyboardEvent) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.heroesService.getHeroByName(filterValue).subscribe((heroes) => {
            this.heroesSource.data = heroes;
        });
    }

    /**
     * Muestra el detalle del héroe seleccionado.
     * @param id number
     */
    showDetails(id: number) {
        this.heroesService.getHero(id).subscribe({
            next: (hero) => {
                this.selectedHero = hero;
            },
            error: (error) => this.showSnackbar(error),
        });
        this.drawer.toggle();
    }

    /**
     * Abre el diálogo para eliminar el héroe seleccionado.
     * @param hero Hero
     * @param event MouseEvent
     */
    openDeleteDialog(hero: Hero, event?: MouseEvent) {
        // Para que no se abra el detalle cuando elimine un héroe
        if (event) {
            event.stopPropagation();
        }
        this.drawer.close();
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            data: hero,
        });

        dialogRef.afterClosed().subscribe((id) => {
            if (id) {
                this.deleteHero(id);
            }
        });
    }

    /**
     * Borra el héroe, previamente seleccionado, del array de los héroes.
     * @param id number
     */
    deleteHero(id: number) {
        this.heroesService.deleteHero(id).subscribe({
            next: (hero) => {
                this.updateDataTable();
                this.showSnackbar(`Se ha eliminado el heroe ${hero.name}`);
            },
            error: (error) => this.showSnackbar(error),
        });
    }

    /**
     * Actualiza la tabla mediante la llamada para traer todos los héroes.
     */
    updateDataTable() {
        this.heroesService.getHeroes().subscribe((heroes) => {
            this.heroesSource.data = heroes;
        });
    }

    /**
     * Lanza el snackbar de Angular Material con el mensaje que se le especifique.
     * @param message string
     */
    showSnackbar(message: string) {
        this.snackbar.open(message, "Cerrar", {
            duration: 2500,
            verticalPosition: "top",
        });
    }
}
