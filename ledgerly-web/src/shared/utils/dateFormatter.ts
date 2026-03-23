export class DateFormatter {
    private formatter: Intl.DateTimeFormat
    private readonly useRelative: boolean

    constructor(
        options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        },
        useRelative: boolean = false
    ) {
        this.formatter = new Intl.DateTimeFormat('en-PH', options)
        this.useRelative = useRelative
    }

    private isSameDay(a: Date, b: Date): boolean {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        )
    }

    private getRelativeLabel(date: Date): string | null {
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        if (this.isSameDay(date, today)) return 'Today'
        if (this.isSameDay(date, yesterday)) return 'Yesterday'
        return null
    }

    formatDate(iso: string): string {
        const date = new Date(iso)
        if (this.useRelative) {
            const label = this.getRelativeLabel(date)
            if (label) return label
        }
        return this.formatter.format(date)
    }
}
