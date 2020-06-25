export function fromDateToString(date: Date | null): string | null {
    if (date === null) { return null }
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
}
