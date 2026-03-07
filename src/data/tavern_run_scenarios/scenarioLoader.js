const modules = import.meta.glob("./*.json", { eager: true });

export const scenarios = Object.values(modules).map((m) => m.default || m);
