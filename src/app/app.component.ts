import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignalrService } from './signalR/signalr.service';
import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'demo_project';
  receivedMessage = '';
  userInputMessage = '';
  selectedTheme: 'light' | 'dark' | 'system' = 'system';

  constructor(private themeService: ThemeService, private signalrService: SignalrService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.selectedTheme = theme;
    });
    // Subscribe to SignalR messages
    this.signalrService.message$.subscribe((message: string) => {
      this.receivedMessage = message;
    });
  }

  sendMessage() {
    if (this.userInputMessage.trim()) {
      this.signalrService.sendMessageToServer(this.userInputMessage);
      this.userInputMessage = ''; // Clear input after sending
    }
  }

  changeTheme(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
  }
}
