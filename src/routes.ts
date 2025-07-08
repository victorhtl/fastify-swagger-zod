import z from "zod";
import { FastifyTypedInstance } from "./types";
import { randomUUID } from "crypto";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["users"],
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
            })
          ),
        },
      },
    },
    async () => {
      return users;
    }
  );

  app.post(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["users"],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe("User created successfully"),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body; // this must infer type automagically

      users.push({
        id: randomUUID(),
        name,
        email,
      });

      return reply.status(201).send();
    }
  );
}
