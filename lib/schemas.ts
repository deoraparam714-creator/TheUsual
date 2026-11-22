import { z } from 'zod';
import { normalizePhone } from './format';

export const ORDER_STATUSES = ['received', 'making', 'ready', 'collected', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const nameOnCupSchema = z
  .string()
  .trim()
  .min(1, 'No name, no cup. What should we write?')
  .max(20, 'Keep it to 20 letters so it fits the sticker.')
  .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u, 'Letters only, please. It’s going on a cup.');

export const phoneSchema = z
  .string()
  .transform((v, ctx) => {
    const n = normalizePhone(v);
    if (!n) {
      ctx.addIssue({ code: 'custom', message: 'That doesn’t look like a 10-digit mobile number.' });
      return z.NEVER;
    }
    return n;
  });

export const lineSchema = z.object({
  itemId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(20),
  options: z.record(z.string().max(32), z.array(z.string().max(32)).max(10)).default({}),
  note: z.string().max(140).optional(),
});

export const createOrderSchema = z.object({
  locationId: z.string().min(1).max(32),
  pickup: z.discriminatedUnion('type', [
    z.object({ type: z.literal('asap') }),
    z.object({ type: z.literal('scheduled'), at: z.iso.datetime() }),
  ]),
  nameOnCup: nameOnCupSchema,
  phone: phoneSchema,
  lines: z.array(lineSchema).min(1, 'Your order is empty.').max(30),
  useReward: z.boolean().default(false),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;

export const statusUpdateSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Something’s off with that order.';
}
