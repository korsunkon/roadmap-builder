let idCounter = Date.now();

export function uid(): string {
  idCounter++;
  return "id_" + idCounter.toString(36);
}
