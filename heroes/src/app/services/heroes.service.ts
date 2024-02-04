import { Injectable } from "@angular/core";
import { Hero } from "../models/hero.model";
import { BehaviorSubject, Observable, map, tap, throwError } from "rxjs";
import { Constants } from "../../assets/constants";

@Injectable({
    providedIn: "root",
})
export class HeroesService {
    // Array de héroes.
    private heroes = new BehaviorSubject<Hero[]>(Constants.HEROES);

    /**
     * Función que devuelve la lista de héroes entera.
     * @returns Observable<Hero[]>
     */
    getHeroes(): Observable<Hero[]> {
        return this.heroes.asObservable();
    }

    /**
     * Función que devuelve un héroe en concreto del array de héroes, por su id.
     * @param id number
     * @returns Observable<Hero>
     */
    getHero(id: number): Observable<Hero> {
        return this.heroes.pipe(
            map((heroes) => {
                const foundHero = heroes.find((hero) => hero.id === id);
                if (!foundHero) {
                    throw throwError(() => `No se ha encontrado el heroe por el id: ${id}`);
                }
                return foundHero;
            })
        );
    }

    /**
     * Función que devuelve un array de héroes filtrada por el nombre.
     * @param name string
     * @returns Observable<Hero[]>
     */
    getHeroByName(name: string): Observable<Hero[]> {
        return this.heroes.pipe(
            map((heroes) => heroes.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase())))
        );
    }

    /**
     * Función que añade un héroe al array de héroes y devuelve el nuevo héroe que se ha ingresado.
     * @param hero Hero
     * @returns Observable<Hero>
     */
    addHero(hero: Hero): Observable<Hero> {
        return this.heroes.pipe(
            tap((heroes) => {
                heroes.push(hero);
            }),
            map(() => hero)
        );
    }

    /**
     * Función que edita el héroe que se ha seleccionado y devuelve el nuevo héroe.
     * @param id number
     * @param newHero Hero
     * @returns Observable<Hero>
     */
    editHero(id: number, newHero: Hero): Observable<Hero> {
        return this.heroes.pipe(
            map((heroes) => {
                const foundHeroIndex = heroes.findIndex((hero) => hero.id === id);
                heroes[foundHeroIndex] = {
                    ...newHero,
                };
                return newHero;
            })
        );
    }

    /**
     * Función que elimina un héroe del array de héroes y devuelve el héroe que se ha eliminado.
     * @param id number
     * @returns Observable<Hero>
     */
    deleteHero(id: number): Observable<Hero> {
        return this.heroes.pipe(
            map((heroes) => {
                const foundHeroIndex = heroes.findIndex((hero) => hero.id === id);
                if (foundHeroIndex === -1) {
                    throw throwError(() => `No se ha encontrado el heroe por el id: ${id}`);
                }
                const deletedHero = heroes.splice(foundHeroIndex, 1)[0];
                return deletedHero;
            })
        );
    }
}
