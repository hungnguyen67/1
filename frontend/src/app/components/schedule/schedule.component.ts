import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

import { CommonModule } from '@angular/common';
import { MiniCalendarComponent } from '../../shared/components/mini-calendar/mini-calendar.component';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
    currentDate = new Date();
    weekDays: any[] = [];

    timeSlots = [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    scheduleItems: any[] = [];
    loading = true;

    constructor(private scheduleService: ScheduleService) { }

    ngOnInit(): void {
        this.updateWeekDays();
        this.loadSchedule();
    }

    onDateSelected(date: Date) {
        this.currentDate = date;
        this.updateWeekDays();
        // Re-filter schedules based on new date
        this.loadSchedule();
    }

    updateWeekDays() {
        const curr = new Date(this.currentDate);
        const first = curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1); // Get Monday

        const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'Cn'];

        this.weekDays = names.map((name, i) => {
            const d = new Date(curr.setDate(first + i));
            return {
                name: name,
                label: labels[i],
                date: this.formatDate(d)
            };
        });
    }

    formatDate(date: Date): string {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    isSelectedDay(dayName: string): boolean {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[this.currentDate.getDay()] === dayName;
    }

    loadSchedule(): void {
        this.scheduleService.getMySchedule().subscribe({
            next: (data) => {
                this.scheduleItems = this.mapBackendData(data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load schedule', err);
                this.loading = false;
            }
        });
    }

    mapBackendData(data: any[]): any[] {
        const colors = [
            'bg-[#2d3a82]',
            'bg-orange-500',
            'bg-blue-600',
            'bg-orange-600'
        ];

        const periodTimes: { [key: number]: string } = {
            1: '07:00', 2: '07:55', 3: '08:50', 4: '09:45', 5: '10:40',
            6: '13:00', 7: '13:55', 8: '14:50', 9: '15:45', 10: '16:40'
        };

        return data.map((item, index) => {
            const startTime = periodTimes[item.startPeriod] || '07:00';
            const endTime = periodTimes[item.endPeriod + 1] || (item.endPeriod === 5 ? '11:35' : '17:35');

            // Calculate duration in minutes
            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);
            const durationMinutes = endMinutes - startMinutes;

            return {
                title: item.courseClass.subject.name,
                time: `${startTime} - ${endTime}`,
                slot: `Tiết ${item.startPeriod}-${item.endPeriod}`,
                room: item.roomName,
                scheduleDate: item.scheduleDate,
                startTime: startTime,
                endTime: endTime,
                durationMinutes: durationMinutes,
                color: colors[index % colors.length],
                textColor: 'text-white'
            };
        });
    }

    timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    calculateHeight(durationMinutes: number): number {
        // Each hour slot is 100px, so calculate proportional height
        return (durationMinutes / 60) * 100;
    }

    calculateTopOffset(startTime: string, slotTime: string): number {
        const slotMinutes = this.timeToMinutes(slotTime);
        const startMinutes = this.timeToMinutes(startTime);
        const offsetMinutes = startMinutes - slotMinutes;
        // Convert minutes to pixels (100px per hour)
        return (offsetMinutes / 60) * 100;
    }

    getItemsForDayAndTime(dayDate: string, time: string): any[] {
        const slotHour = parseInt(time.split(':')[0]);

        return this.scheduleItems.filter(item => {
            // Match by exact date
            const itemDate = new Date(item.scheduleDate);
            const checkDate = this.getDateForDay(dayDate);

            if (!checkDate || itemDate.toDateString() !== checkDate.toDateString()) {
                return false;
            }

            // Check if this item starts in or spans this time slot
            const startHour = parseInt(item.startTime.split(':')[0]);
            const endHour = parseInt(item.endTime.split(':')[0]);
            const endMin = parseInt(item.endTime.split(':')[1]);

            // Item starts in this slot
            if (startHour === slotHour) return true;

            // Item spans this slot (started earlier, ends later)
            if (startHour < slotHour && (endHour > slotHour || (endHour === slotHour && endMin > 0))) {
                return true;
            }

            return false;
        });
    }

    getDateForDay(dayDate: string): Date | null {
        // dayDate is in format "dd/MM/yyyy"
        const parts = dayDate.split('/');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
}
