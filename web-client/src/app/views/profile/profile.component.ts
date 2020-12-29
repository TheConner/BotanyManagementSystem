import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ProfileForm;
  user: any;
  constructor(private api: BMSService, private formbuilder: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.api.getUser()
    .subscribe((user) => {
      this.user = user;
      this.ProfileForm = this.formbuilder.group({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username
      })
    })
  }

  onSubmit(userData) {
    this.api.updateUser(userData).subscribe(
      result => {
        this.toastr.success("User Updated!");
      },
      error => {
        this.toastr.error(error.error);
      }
    )
  }

}
