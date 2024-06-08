import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IStream } from '../../interfaces/stream.interface';
import { BehaviorSubject, switchMap, of } from 'rxjs';
import { StreamService } from '../../services/stream.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-stream-preview',
  templateUrl: './stream-preview.component.html',
  styleUrls: ['./stream-preview.component.css']
})
export class StreamPreviewComponent {
  @Input() stream!: IStream;
  @Input() live!: Boolean;
  @Input() pref?: Boolean;
  @Input() deleteBut?: Boolean;
  @Output() onDelete = new EventEmitter();
  profile?: IUser;
  streamUrl: String = "";
  errUrl: String = 'assets/Img/stream_image.jpg';
  image: BehaviorSubject<string | undefined>;
  routerLink: string='';
  isDelete: Boolean = false;

  constructor(
    private streamService: StreamService,
    private userService: UserService,
    private dialog: MatDialog
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  error(){
    this.streamUrl = this.errUrl;
  }

  ngOnInit(){
    this.userService.profile.subscribe({
      next: profile => {
        if(profile){
          this.profile = profile;
          this.isDelete = !!this.deleteBut 
          && !!this.stream.end_time 
          && (this.stream.user.id === this.profile.id || this.profile.role.name === "Admin");
        }
      },
      error: err=> console.log(err)
    })
    this.image.next(this.stream.user.image)
    if(this.live) {
      this.streamUrl = `${environment.apiURL}/thumbnail/${this.stream.user.login}.png`;
      this.routerLink = this.stream.user.login + '/live';
    } 
    else {
      const name = this.stream.recording_file.split('.')[0];
      this.streamUrl = `${environment.apiURL}/thumbnail/${name}.png`
      this.routerLink = this.pref? `${this.stream.user.login}/${name}`: name;
    }
  }

  delete(){
    const dialogref = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: "Delete stream record?",
        buttonName: 'Delete'
      }
    });

    dialogref.afterClosed().pipe(
      switchMap(result=>{
        if(result){
          return this.streamService.deleteStream(this.stream.id);
        }
        return of(undefined)
      })
    ).subscribe({
      next:(result)=>{
        if(result){
          this.onDelete.emit();
        }
      },
      error: (err)=>console.log(err)
    })
  }
}
