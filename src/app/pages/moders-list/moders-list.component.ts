import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, of } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-moders-list',
  templateUrl: './moders-list.component.html',
  styleUrls: ['./moders-list.component.css'],
})
export class ModersListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  profile?: IUser;
  moders?: IUser[];
  dataSource = new MatTableDataSource([] as IUser[]);
  displayedColumns: string[] = ["image", "login", "delete"];

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private routeService: RoutesService,
    private chatService: ChatService
  ){}

  ngOnInit(){
    this.routeService.route.next(this.router.url);
    this.userService.profile.
    subscribe({
      next: profile=>{
        this.profile=profile;
        this.updateModers();
      },
      error: err=>console.log(err)
    })
    /*.pipe(
      mergeMap(profile=>{
        this.profile=profile;
        return this.profile? this.chatService.getChatModers(this.profile?.chat.id):of(undefined);
      })
    )
    .subscribe({
      next: moders=>{
        this.moders=moders;
        if(moders) this.dataSource.data = moders;

        console.log(this.moders)
      },
      error: err=>console.log(err)
    })*/
  }

  updateModers(){
    if(this.profile?.chat){
      this.chatService.getChatModers(this.profile.chat.id)
      .subscribe({
        next: moders=>{
          this.moders=moders;
          if(moders) this.dataSource.data = moders;

          console.log(this.moders)
        },
        error: err=>console.log(err)
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(moder: IUser){
    const dialogref = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: `Remove user "${moder.login}" from the list of moderators?`,
        buttonName: 'Remove'
      }
    });

    dialogref.afterClosed()
    .pipe(
      mergeMap(result=>{
        return result && this.profile?.chat? this.chatService.removeModerator(this.profile.chat.id, moder.id) : of(undefined);
      })
    )
    .subscribe({
      next:(result)=>{
        if(result){
          this.updateModers();
        }
      },
      error: (err)=>console.log(err)
    })
  }

}
