import { TestBed } from "@angular/core/testing";
import { HeroesService } from "./heroes.service";
import { Constants } from "../../assets/constants";
import { Hero } from "../models/hero.model";

describe("HeroesService", () => {
    let service: HeroesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HeroesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("getHeroes", () => {
        it("should get all heroes", (done: DoneFn) => {
            service.getHeroes().subscribe((heroes: Hero[]) => {
                expect(heroes).toEqual(Constants.HEROES);
                done();
            });
        });
    });

    describe("getHero", () => {
        it("should get a hero by id", (done: DoneFn) => {
            const id = 1;
            service.getHero(id).subscribe((hero: Hero) => {
                expect(hero).toEqual(Constants.HEROES.find((hero) => hero.id === id) as Hero);
                done();
            });
        });

        it("should throw error when getting hero by non-existing id", (done: DoneFn) => {
            const id = -1;
            service.getHero(id).subscribe({
                error: (error) => {
                    expect(error).toBeTruthy();
                    done();
                },
            });
        });
    });

    describe("getHeroByName", () => {
        it("should get heroes by name", (done: DoneFn) => {
            const name = "Super";
            service.getHeroByName(name).subscribe((heroes: Hero[]) => {
                const filteredHeroes = Constants.HEROES.filter((hero) =>
                    hero.name.toLowerCase().includes(name.toLowerCase())
                );
                expect(heroes).toEqual(filteredHeroes);
                done();
            });
        });
    });

    describe("addHero", () => {
        it("should add a hero", (done: DoneFn) => {
            const newHero: Hero = { id: 6, name: "Nuevo héroe", age: 30, powers: ["Poder 1", "Poder 2"] };
            service.addHero(newHero).subscribe((hero: Hero) => {
                expect(hero).toEqual(newHero);
                done();
            });
        });
    });

    describe("editHero", () => {
        it("should edit a hero", (done: DoneFn) => {
            const id = 1;
            const editedHero: Hero = {
                id: 1,
                name: "Héroe editado",
                age: 40,
                powers: ["Poder nuevo 1", "Poder nuevo 2"],
            };
            service.editHero(id, editedHero).subscribe((hero: Hero) => {
                expect(hero).toEqual(editedHero);
                done();
            });
        });
    });

    describe("deleteHero", () => {
        it("should delete a hero", (done: DoneFn) => {
            const id = 2;
            const _hero = Constants.HEROES.find((hero) => hero.id === id) as Hero;
            service.deleteHero(id).subscribe((hero: Hero) => {
                expect(hero).toEqual(_hero);
                done();
            });
        });

        it("should throw error when deleting hero by non-existing id", (done: DoneFn) => {
            const id = -1;
            service.deleteHero(id).subscribe({
                error: (error) => {
                    expect(error).toBeTruthy();
                    done();
                },
            });
        });
    });
});
