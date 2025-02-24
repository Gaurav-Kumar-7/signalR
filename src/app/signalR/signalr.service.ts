import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new BehaviorSubject<string>("");
  public message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startConnection();
  }

  public async startConnection(): Promise<void> {
    try {
      const negotiateUrl = 'https://func-trigger-queue-management.azurewebsites.net/api/Negotiate';

      // Use firstValueFrom instead of toPromise
      const response = await firstValueFrom(this.http.get<any>(negotiateUrl));

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(response.url, {
          accessTokenFactory: () => response.accessToken
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      // Start the connection
      await this.hubConnection.start();
      console.log('SignalR connection established.');
      this.hubConnection.on('receiveMessage', (message: string) => {
        console.log('Message received from server:', message);
        this.messageSubject.next(message);
      });
    } catch (err) {
      console.error('Error establishing SignalR connection: ', err);
    }
  }

  public sendMessageToServer(msg: string): Promise<void> {
    const broadcastUrl = 'https://func-trigger-queue-management.azurewebsites.net/api/Broadcast';
    return this.http.post<void>(broadcastUrl, { Message: msg }).toPromise();
  }
}
