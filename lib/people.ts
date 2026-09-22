import type { Person } from "./types";

export const people: Person[] = [
  { id: "alex", name: "Alex Chen", role: "Head of Product", color: "#5B8CFF", you: true },
  { id: "priya", name: "Priya Shah", role: "CEO", color: "#F5C16C" },
  { id: "marcus", name: "Marcus Webb", role: "Eng Manager", color: "#6EE7B7" },
  { id: "elena", name: "Elena Voss", role: "Design Lead", color: "#F0A6CA" },
  { id: "jordan", name: "Jordan Hale", role: "Account Executive", color: "#F59E6C" },
  { id: "sam", name: "Sam Okonkwo", role: "Customer Success", color: "#8B9CFF" },
  { id: "riley", name: "Riley Cho", role: "Marketing", color: "#67E8F9" },
  { id: "dana", name: "Dana Park", role: "Finance", color: "#C4B5FD" },
  { id: "maya", name: "Maya Singh", role: "Product Designer", color: "#F9A8D4" },
  { id: "noah", name: "Noah Grant", role: "VP Sales, Northwind", company: "Northwind Logistics", color: "#FBBF24" },
  { id: "claire", name: "Claire Duvall", role: "Ops Director", company: "Northwind Logistics", color: "#34D399" },
  { id: "theo", name: "Theo Marsh", role: "Solutions Engineer", color: "#93C5FD" },
  { id: "lea", name: "Lea Ortiz", role: "CSM", color: "#FCA5A5" },
  { id: "ben", name: "Ben Adler", role: "CTO, Helio", company: "Helio Health", color: "#A5B4FC" },
  { id: "iris", name: "Iris Kim", role: "Candidate — PM", company: "Interview", color: "#FDE68A" },
];

export const personById = Object.fromEntries(people.map((person) => [person.id, person]));

export function getPerson(id: string) {
  return personById[id] ?? people[0];
}
