import type { Person } from "./types";

const cache: Record<string, Person> = {};

export function hydratePeople(people: Person[]) {
  for (const key of Object.keys(cache)) delete cache[key];
  for (const person of people) cache[person.id] = person;
}

export function getPerson(id: string): Person {
  return (
    cache[id] ?? {
      id,
      name: "Unknown",
      role: "",
      color: "#8b97a8",
    }
  );
}
