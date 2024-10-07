import { useQuery } from "@tanstack/react-query";
import { makeApi, makeErrors, Zodios } from "@zodios/core";
import z from "zod";

export const Errors = makeErrors([
  {
    status: "default",
    schema: z.object({
      error: z.object({
        code: z.number(),
        message: z.string(),
      }),
    }),
  },
]);

const Plan = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.enum(["NGN"]),
  monthlyRate: z.number(),
  cpu: z.string(),
  memory: z.string(),
});

const api = makeApi([
  {
    method: "get",
    path: "/",
    alias: "listPlan",
    response: z.array(Plan),
    errors: Errors,
  },
  {
    method: "get",
    path: "/:id",
    alias: "getPlan",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(Plan),
    errors: Errors,
  },
]);

const apiClient = new Zodios("http://localhost:8000/api/v1/plans", api);

export function useListPlan() {
  return useQuery({
    queryKey: ["listPlan"],
    queryFn: async () => apiClient.listPlan(),
  });
}

export function useGetPlan(props: { id: string }) {
  return useQuery({
    queryKey: ["getPlan", props.id],
    queryFn: async () => apiClient.getPlan({ params: { id: props.id } }),
  });
}
