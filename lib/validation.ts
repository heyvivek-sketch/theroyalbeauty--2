import {z} from 'zod';
export const bookingSchema=z.object({phone:z.string().regex(/^[6-9]\d{9}$/),name:z.string().min(2).max(80),email:z.string().email().optional().or(z.literal('')),password:z.string().min(6).max(100),serviceIds:z.array(z.number().int().positive()).min(1),date:z.string(),slotId:z.number().int().positive(),address:z.string().min(8),city:z.string().min(2),pincode:z.string().regex(/^\d{6}$/),notes:z.string().max(500).optional(),coupon:z.string().max(30).optional()});
export const couponSchema=z.object({code:z.string().min(2).max(30)});
