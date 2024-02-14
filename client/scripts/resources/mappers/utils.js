export const getStringValue = (formDataEntries, name) => name in formDataEntries ? String(formDataEntries[name]) : undefined;
