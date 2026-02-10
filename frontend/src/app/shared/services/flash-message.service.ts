import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FlashMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp?: number;
}

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private messagesSubject = new BehaviorSubject<FlashMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private labels = {
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin'
  };

  /**
   * Hiển thị thông báo
   * @param duration thời gian hiển thị (mặc định 1000ms = 1 giây)
   */
  showMessage(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number = 1000): void {
    const newMessage: FlashMessage = {
      type,
      title: this.labels[type],
      message,
      duration,
      timestamp: Date.now()
    };

    const currentMessages = this.messagesSubject.value;

    // Thêm thông báo mới vào danh sách
    this.messagesSubject.next([...currentMessages, newMessage]);

    // Tự động xóa thông báo sau khoảng thời gian duration (1 giây)
    setTimeout(() => {
      this.removeMessage(newMessage);
    }, duration);
  }

  removeMessage(message: FlashMessage): void {
    const currentMessages = this.messagesSubject.value;
    // Lọc bỏ thông báo cụ thể dựa trên đối tượng hoặc timestamp
    this.messagesSubject.next(currentMessages.filter(m => m !== message));
  }

  // Xóa toàn bộ thông báo ngay lập tức
  clearAll(): void {
    this.messagesSubject.next([]);
  }

  // Các hàm tiện ích với thời gian mặc định 1 giây
  success(msg: string) { this.showMessage('success', msg, 2000); }
  error(msg: string) { this.showMessage('error', msg, 2000); }
  warning(msg: string) { this.showMessage('warning', msg, 2000); }
  info(msg: string) { this.showMessage('info', msg, 2000); }

  // Xử lý phản hồi từ API
  handleSuccess(res: any) {
    this.success(res?.message || 'Thao tác thành công!');
  }

  handleError(err: any) {
    this.error(err?.error?.message || err?.message || 'Có lỗi xảy ra!');
  }
}