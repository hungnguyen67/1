import { Component, OnInit } from '@angular/core';
import { ScheduleService, ConflictInfo } from '../../../services/schedule.service';
import { SemesterService, Semester } from '../../../services/semester.service';
import { CourseClassService, CourseClass } from '../../../services/course-class.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
    currentDate = new Date();
    weekDays: any[] = [];
    viewMode: 'GRID' | 'LIST' = 'GRID';
    timeSlots = [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    semesters: Semester[] = [];
    selectedSemesterId: number | null = null;
    classes: CourseClass[] = [];
    selectedClassId: number | null = null;
    scheduleItems: any[] = [];
    allInstances: any[] = [];
    loading = false;
    conflicts: ConflictInfo[] = [];
    currentWeekNumber: number = 5;
    showPatternModal = false;
    newPattern: any = {
        dayOfWeek: 2,
        startPeriod: 1,
        endPeriod: 3,
        fromWeek: 1,
        toWeek: 15,
        roomName: '',
        sessionType: 'THEORY'
    };

    constructor(
        private scheduleService: ScheduleService,
        private semesterService: SemesterService,
        private courseClassService: CourseClassService
    ) { }

    ngOnInit(): void {
        this.loadSemesters();
        this.updateWeekDays();
    }

    loadSemesters(): void {
        this.semesterService.getAllSemesters().subscribe(res => {
            this.semesters = res;
            if (this.semesters.length > 0) {
                const ongoing = this.semesters.find(s => s.semesterStatus === 'ONGOING');
                this.selectedSemesterId = ongoing ? ongoing.id : this.semesters[0].id;
                this.onSemesterChange();
            }
        });
    }

    onSemesterChange(): void {
        if (this.selectedSemesterId != null) {
            this.courseClassService.getClassesBySemester(this.selectedSemesterId).subscribe({
                next: (res) => {
                    this.classes = res;
                    if (res && res.length > 0) {
                        this.selectedClassId = res[0].id;
                        this.onClassChange();
                    } else {
                        this.selectedClassId = null;
                        this.scheduleItems = [];
                        this.allInstances = [];
                    }
                },
                error: (err) => {
                    console.error('Failed to fetch classes', err);
                }
            });
        }
    }

    onClassChange(): void {
        if (this.selectedClassId != null) {
            this.loadSchedule();
        }
    }

    loadSchedule(): void {
        if (!this.selectedClassId) {
            this.scheduleItems = [];
            this.allInstances = [];
            this.loading = false;
            return;
        }
        this.loading = true;
        this.scheduleService.getScheduleByCourseClass(this.selectedClassId).subscribe({
            next: (data) => {
                this.allInstances = data;
                this.scheduleItems = this.mapBackendData(data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load schedule', err);
                this.loading = false;
            }
        });
    }

    onDateSelected(date: Date) {
        this.currentDate = date;
        this.updateWeekDays();
    }

    updateWeekDays() {
        const curr = new Date(this.currentDate);
        const day = curr.getDay();
        const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(curr.setDate(diff));

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        this.weekDays = names.map((name, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return {
                name: name,
                label: labels[i],
                date: this.formatDate(d),
                isoDate: this.toISODateString(d),
                fullDate: d
            };
        });
    }

    formatDate(date: Date): string {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    toISODateString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isSelectedDay(dayName: string): boolean {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[this.currentDate.getDay()] === dayName;
    }

    formatBackendDate(date: any): string {
        if (!date) return '';
        if (Array.isArray(date)) {
            return `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;
        }
        return date.toString().split('T')[0];
    }

    formatBackendTime(time: any): string {
        if (!time) return '';
        if (Array.isArray(time)) {
            return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`;
        }
        return time.length > 5 ? time.substring(0, 5) : time;
    }

    mapBackendData(data: any[]): any[] {
        const typeColors: { [key: string]: string } = {
            'THEORY': 'bg-green-500',
            'PRACTICE': 'bg-amber-500',
            'ONLINE': 'bg-blue-500',
            'EXAM': 'bg-purple-600',
            'CANCELLED': 'bg-red-500'
        };

        const periodTimes: { [key: number]: string } = {
            1: '07:00', 2: '07:55', 3: '08:50', 4: '09:45', 5: '10:40',
            6: '13:00', 7: '13:55', 8: '14:50', 9: '15:45', 10: '16:40'
        };

        return data.map((item) => {
            const rawStartTime = item.startTime || periodTimes[item.startPeriod] || '07:00';
            const rawEndTime = item.endTime || periodTimes[item.endPeriod] || '17:35';

            const startTime = this.formatBackendTime(rawStartTime);
            const endTime = this.formatBackendTime(rawEndTime);
            const scheduleDate = this.formatBackendDate(item.scheduleDate);

            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);

            return {
                id: item.id,
                title: (item.subjectName || 'N/A'),
                time: `${startTime} - ${endTime}`,
                slot: `Tiết ${item.startPeriod}-${item.endPeriod}`,
                room: item.roomName,
                scheduleDate: scheduleDate,
                startTime: startTime,
                endTime: endTime,
                durationMinutes: endMinutes - startMinutes,
                color: item.status === 'CANCELLED' ? typeColors['CANCELLED'] : (typeColors[item.type] || 'bg-slate-500'),
                textColor: 'text-white',
                status: item.status,
                type: item.type
            };
        });
    }

    timeToMinutes(time: string): number {
        if (!time || typeof time !== 'string') return 0;
        const parts = time.split(':');
        if (parts.length < 2) return 0;
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        return hours * 60 + (minutes || 0);
    }

    calculateHeight(durationMinutes: number): number {
        return (durationMinutes / 60) * 100;
    }

    calculateTopOffset(startTime: string, slotTime: string): number {
        return ((this.timeToMinutes(startTime) - this.timeToMinutes(slotTime)) / 60) * 100;
    }

    getItemsForDayAndTime(dayDateStr: string, time: string): any[] {
        const slotHour = parseInt(time.split(':')[0]);
        return this.scheduleItems.filter(item => {
            if (item.scheduleDate !== dayDateStr) return false;
            const startHour = parseInt(item.startTime.split(':')[0]);
            return startHour === slotHour;
        });
    }

    nextWeek(): void {
        const next = new Date(this.currentDate);
        next.setDate(next.getDate() + 7);
        this.currentDate = next;
        this.updateWeekDays();
    }

    previousWeek(): void {
        const prev = new Date(this.currentDate);
        prev.setDate(prev.getDate() - 7);
        this.currentDate = prev;
        this.updateWeekDays();
    }

    goToToday(): void {
        this.currentDate = new Date();
        this.updateWeekDays();
    }

    openPatternModal(): void {
        if (!this.selectedClassId) {
            alert('Vui lòng chọn lớp học phần trước!');
            return;
        }
        this.showPatternModal = true;
    }

    closePatternModal(): void {
        this.showPatternModal = false;
    }

    savePattern(): void {
        if (!this.selectedClassId) return;

        this.scheduleService.addPattern(this.selectedClassId, this.newPattern).subscribe({
            next: () => {
                alert('Đã tạo lịch mẫu thành công! Hãy nhấn nút "Sinh buổi học" để tạo các buổi học thực tế trên lịch.');
                this.closePatternModal();
                this.loadSchedule();
            },
            error: (err) => {
                console.error('Failed to create pattern', err);
                alert('Lỗi khi tạo lịch mẫu: ' + (err.error?.message || err.message));
            }
        });
    }

    generateSchedule(): void {
        if (!this.selectedClassId) return;
        this.scheduleService.generateInstances(this.selectedClassId).subscribe(() => {
            alert('Đã sinh buổi học thành công!');
            this.loadSchedule();
        });
    }

    checkConflicts(): void {
        if (!this.selectedClassId) return;
        this.scheduleService.getConflicts(this.selectedClassId).subscribe(res => {
            this.conflicts = res;
            if (this.conflicts.length === 0) {
                alert('Không có xung đột nào!');
            }
        });
    }

    getInstancesForSelectedDate(): any[] {
        const selectedStr = this.toISODateString(this.currentDate);
        return this.allInstances.filter(i => {
            const itemDateStr = this.formatBackendDate(i.scheduleDate);
            return itemDateStr === selectedStr;
        });
    }
}