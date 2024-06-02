import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, of } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.css']
})
export class AdminsListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource = new MatTableDataSource([] as IUser[]);
  displayedColumns: string[] = ["image", "login", "delete"];
  profile?: IUser;
  errorMessage?: string;
  pages: number[] = [3, 5, 7];
  length: number = 0;
  pageIndex!: number;
  pageSize!:number;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private routeService: RoutesService,
    private adminService: AdminService,
    private userService: UserService
  ){
    this.pageIndex = 0;
    this.pageSize = this.pages[0];
  }

  ngOnInit(){
    this.routeService.route.next(this.router.url);
    this.userService.profile.
    subscribe({
      next: profile=>{
        this.profile=profile;
      },
      error: err=>console.log(err)
    })
    this.updateAdmins(this.pageIndex + 1, this.pageSize);
  }

  addAdmin(user: IUser){
    this.adminService.addAdmin(user.id)
    .subscribe({
      next:(result)=>{
        if(result){
          this.updateAdmins(1, this.pageSize);
        }
      },
      error: (err)=>this.errorMessage = err.error
    })
  }

  updateAdmins(page: number, limit: number){
    this.pageIndex = page - 1;
    this.pageSize = limit;
    this.adminService.getAdminRange(page, limit)
    .subscribe({
      next: result=>{
        this.length = result.total;
        this.dataSource.data = result.data;
      },
      error: err=>console.log(err)
    });
  }

  openDialog(admin: IUser){
    const dialogref = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: `Remove user "${admin.login}" from the list of administrators?`,
        buttonName: 'Remove'
      }
    });

    dialogref.afterClosed()
    .pipe(
      mergeMap(result=>{
        return result && this.adminService.removeAdmin(admin.id);
      })
    )
    .subscribe({
      next:(result)=>{
        if(result){
          this.updateAdmins(1, this.pageSize);
        }
      },
      error: (err)=>console.log(err)
    })
  }

  onPage(event: PageEvent){
    this.updateAdmins(event.pageIndex + 1, event.pageSize);
  }

  ngOnDestroy(){
    this.routeService.route.next(undefined);
  }
}
