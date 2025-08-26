import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../_services/chat.service';
import { untilDestroyed } from '../../_services/until-destroy.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private destroy$ = untilDestroyed();
  userForm: FormGroup = new FormGroup({});
  submitted = false;
  openChat = false;

  constructor(
    private formBuilder: FormBuilder,
    private chatSerivce: ChatService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.chatSerivce
        .registerUser(this.userForm.value)
        .pipe(this.destroy$())
        .subscribe({
          next: () => {
            this.chatSerivce.myName = this.userForm.get('name')?.value;
            this.openChat = true;
            this.userForm.reset();
            this.submitted = false;
          },
          error: (err) => {
            console.error('Error registering user', err);
          },
        });
    }
  }

  closeChat() {
    this.openChat = false;
  }
}
