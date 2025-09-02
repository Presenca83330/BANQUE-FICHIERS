// Helpers génériques utilisables par useSupabaseOperations et autres hooks

export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === "";
}
