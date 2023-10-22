import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const stationBranchSchema = z.object({
  start: z.string(),
  end: z.string(),
});
export type StationBranch = z.infer<typeof stationBranchSchema>;

const branchState = stationBranchSchema.extend({
  occupied: z.boolean(),
});

const CheckConflictsRequestSchema = z.object({
  station_graph: z.array(stationBranchSchema),
  routes: z.array(branchState),
  check_route: stationBranchSchema,
});

// class is required for using DTO as a type
export class CheckConflictsRequest extends createZodDto(
  CheckConflictsRequestSchema
) {}
