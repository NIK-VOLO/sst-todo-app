import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../services/functions/trpc";

export const trpc = createTRPCReact<AppRouter>();
