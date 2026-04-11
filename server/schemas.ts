import { z } from 'zod';

export const CongestionPayloadSchema = z.object({
  gateBStatus: z.enum(['clear', 'congested']),
  congestionLevel: z.enum(['low', 'medium', 'high']),
  alert: z.object({
    type: z.string().max(20),
    message: z.string().max(100),
    time: z.string().max(30),
    autoAction: z.boolean()
  }).optional()
});

export const ResolveCongestionPayloadSchema = z.object({
  alert: z.object({
    type: z.string().max(20),
    message: z.string().max(100),
    time: z.string().max(30),
    autoAction: z.boolean()
  }).optional()
});

export const QueueStatusPayloadSchema = z.object({
  status: z.enum(['idle', 'joined', 'ready'])
});

export const EWastePayloadSchema = z.object({
  amount: z.number().min(0.1).max(500)
});

export const InfractionPayloadSchema = z.object({
  infraction: z.object({
    type: z.string().max(50),
    location: z.string().max(50),
    status: z.string().max(20),
    time: z.string().max(30),
    evidence: z.string().max(200)
  })
});

export const SettingsPayloadSchema = z.object({
  setting: z.enum(['aiReroutingActive', 'dynamicPricingActive', 'arBetaActive']),
  value: z.boolean()
});
