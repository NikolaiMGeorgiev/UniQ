export type FormDataEntry = { [k: string]: FormDataEntryValue }

export const getStringValue = <T>(formDataEntries: FormDataEntry, name: keyof T) => name in formDataEntries ? String(formDataEntries[name]) : undefined
