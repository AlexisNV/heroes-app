import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "separateData",
    standalone: true,
})
export class SeparateDataPipe implements PipeTransform {
    /**
     * Función que devuelve una cadena de texto, a partir de un array, separada por comas.
     * @param arr string[]
     * @returns string
     */
    transform(arr: string[]): string {
        return arr.join(", ");
    }
}
