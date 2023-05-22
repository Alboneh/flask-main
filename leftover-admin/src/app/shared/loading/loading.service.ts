import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  setLoadingState(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }
}