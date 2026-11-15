import type { Animal } from "../flock";
import { butterflies } from "./butterflies";
import { crabs } from "./crabs";
import { cranes } from "./cranes";
import { dragonflies } from "./dragonflies";
import { ducks } from "./ducks";
import { frogs } from "./frogs";
import { jellyfish } from "./jellyfish";
import { koi } from "./koi";

/** Every animal, in the order the choices show them. */
export const ANIMALS = {
  butterflies,
  koi,
  jellyfish,
  dragonflies,
  frogs,
  ducks,
  cranes,
  crabs,
} satisfies Record<string, Animal<any>>;

export type AnimalKey = keyof typeof ANIMALS;

export const ANIMAL_KEYS = Object.keys(ANIMALS) as AnimalKey[];
