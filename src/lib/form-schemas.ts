import { z } from "zod";

export const formLoginSchema = z.object({
  name: z
    .string({ message: "Name required" })
    .min(1, { message: "Name required" }),
  password: z
    .string({ message: "Password required" })
    .min(1, { message: "Password required" }),
});

export const formUpdateEventSchema = z.object({
  event_name: z
    .string({ message: "Event name required" })
    .min(1, { message: "Event name required" }),
  location: z
    .string({ message: "Location required" })
    .min(1, { message: "Location required" }),
  proposed_dates: z
    .array(z.string({ message: "Each date must be a string" }))
    .min(1, { message: "At least one proposed date is required" }),
  vendor_name: z
    .string({ message: "Vendor name required" })
    .min(1, { message: "Vendor name required" }),
});

export const formRejectEventSchema = z.object({
  remark: z
    .string({ message: "Remark required for rejection" })
    .min(1, { message: "Remark required for rejection" }),
});

export const formAcceptEventSchema = z.object({
  confirmed_date: z
    .string({ message: "Confirm date required" })
    .min(1, { message: "Confirm date required" }),
});
