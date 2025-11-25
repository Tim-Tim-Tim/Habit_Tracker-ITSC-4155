import { api } from "./client";

export const habitApi = {
  getAll: () => api.get("/habits"),
  create: (name) => api.post("/habits", { name }),
  completeToday: (name) =>
    api.post(`/habits/${encodeURIComponent(name)}/complete`),
  delete: (name) =>
    api.delete(`/habits/${encodeURIComponent(name)}`),
};
