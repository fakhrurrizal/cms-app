import { z } from "zod"

export const menuSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nama menu wajib diisi'),
    icon: z.string().min(1, 'Icon wajib diisi'),
    path: z.string().min(1, 'Path wajib diisi'),
})

export const groupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nama grup wajib diisi'),
    description: z.string().optional(),
    menus: z.array(menuSchema),
})

export const menuSettingsSchema = z.object({
    groups: z.array(groupSchema),
})

export type MenuSettingsFormData = z.infer<typeof menuSettingsSchema>
export type GroupData = z.infer<typeof groupSchema>
export type MenuData = z.infer<typeof menuSchema>
