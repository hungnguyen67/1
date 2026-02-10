// import { Component, OnInit } from '@angular/core';
// import { ScheduleService } from '../../../services/schedule.service';
// import { SemesterService, Semester } from '../../../services/semester.service';
// import { SectionService, CourseClassDTO } from '../../../services/section.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MiniCalendarComponent } from '../../../shared/components/mini-calendar/mini-calendar.component';

// @Component({
//     selector: 'app-schedule',
//     templateUrl: './schedule.component.html'
// })
// export class ScheduleComponent implements OnInit {
//     currentDate = new Date();
//     weekDays: any[] = [];
//     viewMode: 'GRID' | 'LIST' = 'GRID';

//     timeSlots = [
//         '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
//     ];

//     semesters: Semester[] = [];
//     selectedSemesterId: number | null = null;
//     classes: CourseClassDTO[] = [];
//     selectedClassId: number | null = null;

//     scheduleItems: any[] = [];
//     allInstances: any[] = []; // Full list for the list tab
//     loading = false;
//     conflicts: any[] = [];

//     // Week control
//     currentWeekNumber: number = 5;

//     constructor(
//         private scheduleService: ScheduleService,
//         private semesterService: SemesterService,
//         private sectionService: SectionService
//     ) { }

//     ngOnInit(): void {
//         this.loadSemesters();
//         this.updateWeekDays();
//     }

//     loadSemesters(): void {
//         this.semesterService.getSemesters({ size: 100 }).subscribe(res => {
//             this.semesters = res.content;
//             if (this.semesters.length > 0) {
//                 // Try to find the ONGOING semester, otherwise take the first one
//                 const ongoing = this.semesters.find(s => s.status === 'ONGOING');
//                 this.selectedSemesterId = ongoing ? ongoing.id : this.semesters[0].id;
//                 this.onSemesterChange();
//             }
//         });
//     }

//     onSemesterChange(): void {
//         console.log('Semester changed:', this.selectedSemesterId);
//         if (this.selectedSemesterId != null) {
//             this.sectionService.getClassesBySemester(this.selectedSemesterId).subscribe({
//                 next: (res) => {
//                     this.classes = res;
//                     console.log('Fetched classes:', res);
//                     if (res && res.length > 0) {
//                         this.selectedClassId = res[0].id;
//                         this.onClassChange();
//                     } else {
//                         this.selectedClassId = null;
//                         this.scheduleItems = [];
//                         this.allInstances = [];
//                         console.warn('No classes found for this semester');
//                     }
//                 },
//                 error: (err) => {
//                     console.error('Failed to fetch classes', err);
//                 }
//             });
//         }
//     }

//     onClassChange(): void {
//         console.log('Class changed:', this.selectedClassId);
//         if (this.selectedClassId != null) {
//             this.loadSchedule();
//         }
//     }

//     loadSchedule(): void {
//         if (!this.selectedClassId) {
//             this.scheduleItems = [];
//             this.allInstances = []; // Clear all instances as well
//             this.loading = false; // Ensure loading is false if no class is selected
//             return;
//         }
//         this.loading = true;
//         this.scheduleService.getScheduleByCourseClass(this.selectedClassId).subscribe({
//             next: (data) => {
//                 console.log('Fetched schedule items for class ' + this.selectedClassId + ':', data);
//                 this.allInstances = data;
//                 this.scheduleItems = this.mapBackendData(data);
//                 this.loading = false;
//             },
//             error: (err) => {
//                 console.error('Failed to load schedule', err);
//                 this.loading = false;
//             }
//         });
//     }

//     onDateSelected(date: Date) {
//         this.currentDate = date;
//         this.updateWeekDays();
//     }

//     updateWeekDays() {
//         const curr = new Date(this.currentDate);
//         // Find Monday of the current week
//         const day = curr.getDay();
//         const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
//         const monday = new Date(curr.setDate(diff));

//         const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
//         const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//         this.weekDays = names.map((name, i) => {
//             const d = new Date(monday);
//             d.setDate(monday.getDate() + i);
//             return {
//                 name: name,
//                 label: labels[i],
//                 date: this.formatDate(d),
//                 isoDate: this.toISODateString(d),
//                 fullDate: d
//             };
//         });
//     }

//     formatDate(date: Date): string {
//         return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
//     }

//     toISODateString(date: Date): string {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }

//     isSelectedDay(dayName: string): boolean {
//         const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//         return days[this.currentDate.getDay()] === dayName;
//     }

//     formatBackendDate(date: any): string {
//         if (!date) return '';
//         if (Array.isArray(date)) {
//             return `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;
//         }
//         return date.toString().split('T')[0];
//     }

//     formatBackendTime(time: any): string {
//         if (!time) return '';
//         if (Array.isArray(time)) {
//             return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`;
//         }
//         return time.length > 5 ? time.substring(0, 5) : time;
//     }

//     mapBackendData(data: any[]): any[] {
//         const typeColors: { [key: string]: string } = {
//             'THEORY': 'bg-green-500',
//             'PRACTICE': 'bg-amber-500',
//             'ONLINE': 'bg-blue-500',
//             'EXAM': 'bg-purple-600',
//             'CANCELLED': 'bg-red-500'
//         };

//         const periodTimes: { [key: number]: string } = {
//             1: '07:00', 2: '07:55', 3: '08:50', 4: '09:45', 5: '10:40',
//             6: '13:00', 7: '13:55', 8: '14:50', 9: '15:45', 10: '16:40'
//         };

//         return data.map((item) => {
//             const rawStartTime = item.startTime || periodTimes[item.startPeriod] || '07:00';
//             const rawEndTime = item.endTime || periodTimes[item.endPeriod] || '17:35';

//             const startTime = this.formatBackendTime(rawStartTime);
//             const endTime = this.formatBackendTime(rawEndTime);
//             const scheduleDate = this.formatBackendDate(item.scheduleDate);

//             const startMinutes = this.timeToMinutes(startTime);
//             const endMinutes = this.timeToMinutes(endTime);

//             return {
//                 id: item.id,
//                 title: (item.courseClass?.classCode || 'N/A') + ' - ' + (item.courseClass?.subject?.name || 'Unknown'),
//                 time: `${startTime} - ${endTime}`,
//                 slot: `Tiết ${item.startPeriod}-${item.endPeriod}`,
//                 room: item.roomName,
//                 scheduleDate: scheduleDate,
//                 startTime: startTime,
//                 endTime: endTime,
//                 durationMinutes: endMinutes - startMinutes,
//                 color: item.status === 'CANCELLED' ? typeColors['CANCELLED'] : (typeColors[item.type] || 'bg-slate-500'),
//                 textColor: 'text-white',
//                 status: item.status,
//                 type: item.type
//             };
//         });
//     }

//     timeToMinutes(time: string): number {
//         if (!time || typeof time !== 'string') return 0;
//         const parts = time.split(':');
//         if (parts.length < 2) return 0;
//         const hours = parseInt(parts[0]);
//         const minutes = parseInt(parts[1]);
//         return hours * 60 + (minutes || 0);
//     }

//     calculateHeight(durationMinutes: number): number {
//         return (durationMinutes / 60) * 100;
//     }

//     calculateTopOffset(startTime: string, slotTime: string): number {
//         return ((this.timeToMinutes(startTime) - this.timeToMinutes(slotTime)) / 60) * 100;
//     }

//     getItemsForDayAndTime(dayDateStr: string, time: string): any[] {
//         const slotHour = parseInt(time.split(':')[0]);
//         return this.scheduleItems.filter(item => {
//             // Compare items that belong to this date
//             if (item.scheduleDate !== dayDateStr) return false;

//             // Only return items that START in this hour slot to avoid duplication
//             const startHour = parseInt(item.startTime.split(':')[0]);
//             return startHour === slotHour;
//         });
//     }

//     // Week control methods
//     nextWeek(): void {
//         const next = new Date(this.currentDate);
//         next.setDate(next.getDate() + 7);
//         this.currentDate = next;
//         this.updateWeekDays();
//     }

//     previousWeek(): void {
//         const prev = new Date(this.currentDate);
//         prev.setDate(prev.getDate() - 7);
//         this.currentDate = prev;
//         this.updateWeekDays();
//     }

//     goToToday(): void {
//         this.currentDate = new Date();
//         this.updateWeekDays();
//     }

//     // Management Actions
//     showPatternModal = false;
//     newPattern: any = {
//         dayOfWeek: 1,
//         startPeriod: 1,
//         endPeriod: 3,
//         fromWeek: 1,
//         toWeek: 15,
//         roomName: '',
//         type: 'THEORY'
//     };

//     openPatternModal(): void {
//         if (!this.selectedClassId) {
//             alert('Vui lòng chọn lớp học phần trước!');
//             return;
//         }
//         this.showPatternModal = true;
//     }

//     closePatternModal(): void {
//         this.showPatternModal = false;
//     }

//     savePattern(): void {
//         if (!this.selectedClassId) return;

//         const patternData = {
//             ...this.newPattern,
//             courseClass: { id: this.selectedClassId }
//         };

//         this.scheduleService.createPattern(patternData).subscribe({
//             next: () => {
//                 alert('Đã tạo lịch mẫu thành công! Hãy nhấn nút "Sinh buổi học" để tạo các buổi học thực tế trên lịch.');
//                 this.closePatternModal();
//                 this.loadSchedule();
//             },
//             error: (err) => {
//                 console.error('Failed to create pattern', err);
//                 alert('Lỗi khi tạo lịch mẫu: ' + (err.error?.message || err.message));
//             }
//         });
//     }

//     generateSchedule(): void {
//         if (!this.selectedClassId) return;
//         this.scheduleService.generateInstances(this.selectedClassId).subscribe(() => {
//             alert('Đã sinh buổi học thành công!');
//             this.loadSchedule();
//         });
//     }

//     checkConflicts(): void {
//         if (!this.selectedClassId) return;
//         this.scheduleService.getConflicts(this.selectedClassId).subscribe(res => {
//             this.conflicts = res;
//             if (this.conflicts.length === 0) {
//                 alert('Không có xung đột nào!');
//             }
//         });
//     }

//     getInstancesForSelectedDate(): any[] {
//         const selectedStr = this.toISODateString(this.currentDate);
//         return this.allInstances.filter(i => {
//             const itemDateStr = Array.isArray(i.scheduleDate)
//                 ? `${i.scheduleDate[0]}-${String(i.scheduleDate[1]).padStart(2, '0')}-${String(i.scheduleDate[2]).padStart(2, '0')}`
//                 : i.scheduleDate;
//             return itemDateStr === selectedStr;
//         });
//     }
// }
