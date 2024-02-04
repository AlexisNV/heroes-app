import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Hero } from "../../models/hero.model";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-confirmation",
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: "./confirmation.component.html",
})
export class ConfirmationComponent {
    constructor(public dialogRef: MatDialogRef<ConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: Hero) {}

    /**
     * Función para cancelar el diálogo.
     */
    onCancel() {
        this.dialogRef.close();
    }

    /**
     * Función para eliminar el héroe selecciondo y cerrar el diálogo.
     */
    onDelete() {
        this.dialogRef.close(this.data.id);
    }
}
