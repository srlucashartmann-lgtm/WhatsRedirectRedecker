import citiesData from "@/data/cities.json";
import { GROUPS, type GroupId, type WhatsGroup } from "@/data/groups";

export type City = {
  id: number;
  name: string;
  slug: string;
  groupId: GroupId;
  mesoregion: string;
};

export const CITIES = citiesData as City[];

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getGroup(groupId: GroupId): WhatsGroup {
  return GROUPS[groupId];
}

export function findCityByName(name: string): City | undefined {
  const target = normalizeText(name);
  return (
    CITIES.find((city) => normalizeText(city.name) === target) ??
    CITIES.find(
      (city) =>
        target.includes(normalizeText(city.name)) ||
        normalizeText(city.name).includes(target),
    )
  );
}

export function searchCities(query: string, limit = 12): City[] {
  const q = normalizeText(query);
  if (!q) return [];

  const starts: City[] = [];
  const contains: City[] = [];

  for (const city of CITIES) {
    const name = normalizeText(city.name);
    if (name.startsWith(q)) starts.push(city);
    else if (name.includes(q)) contains.push(city);
    if (starts.length + contains.length >= limit * 2) break;
  }

  return [...starts, ...contains].slice(0, limit);
}

export function resolveGroupForCity(city: City): WhatsGroup {
  return getGroup(city.groupId);
}
