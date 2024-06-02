import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, of } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { IPenalty } from 'src/app/shared/interfaces/penalty.interface';
import { IStatus } from 'src/app/shared/interfaces/status.interface';
import { StatusService } from 'src/app/shared/services/status.service';

@Component({
  selector: 'app-global-ban-list',
  templateUrl: './global-ban-list.component.html',
  styleUrls: ['./global-ban-list.component.css']
})
export class GlobalBanListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource = new MatTableDataSource([] as IPenalty[]);
  displayedColumns: string[] = ["user", "owner", "datetime", "status", "action"];
  errorMessage?: string;
  pages: number[] = [3, 5, 7];
  length: number = 0;
  pageIndex!: number;
  pageSize!:number;
  statuses!: IStatus[];
  status?: string;
  defaultStatus: IStatus = { id: 0, code:"Все статусы"};

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private routeService: RoutesService,
    private adminService: AdminService,
    private statusService: StatusService
  ){
    this.pageIndex = 0;
    this.pageSize = this.pages[0];
    this.statuses = [this.defaultStatus];
    this.status = this.defaultStatus.code;
  }

  ngOnInit(){
    this.routeService.route.next(this.router.url);
    this.statusService.getAllStatuses()
    .subscribe({
      next: result=> this.statuses = [this.defaultStatus, ...result],
      error: err=>console.error(err)
    })
    this.updateBans(this.pageIndex + 1, this.pageSize);
  }

  addBan(user: IUser){
    this.adminService.banUser(user.id)
    .subscribe({
      next:(result)=>{
        if(result){
          this.updateBans(1, this.pageSize);
        }
      },
      error: (err)=>this.errorMessage = err.error
    })
  }

  updateBans(page: number, limit: number){
    this.pageIndex = page - 1;
    this.pageSize = limit;
    const data = this.status === "Все статусы"? undefined: this.status;
    this.adminService.getBanRange(page, limit, data)
    .subscribe({
      next: result=>{
        this.length = result.total;
        this.dataSource.data = result.data;
      },
      error: err=>console.log(err)
    });
  }

  openDialog(ban: IPenalty){
    const dialogref = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: `Unban user "${ban.user.login}"?`,
        buttonName: 'Unban'
      }
    });

    dialogref.afterClosed()
    .pipe(
      mergeMap(result=>{
        return result && this.adminService.unbanUser(ban.user.id);
      })
    )
    .subscribe({
      next:(result)=>{
        if(result){
          this.updateBans(1, this.pageSize);
        }
      },
      error: (err)=>console.log(err)
    })
  }

  onPage(event: PageEvent){
    this.updateBans(event.pageIndex + 1, event.pageSize);
  }
  
  onStatus(){
    this.updateBans(1, this.pageSize);
  }

  showDate(date: Date){
    date = new Date(date);
    return `${this.format(date.getHours())}:${this.format(date.getMinutes())} `
      + `${this.format(date.getDate())}.${this.format(date.getMonth()+1)}.${date.getFullYear()}`;
  }

  format(number:number){
    return ("0" + number).slice(-2)
  }

  ngOnDestroy(){
    this.routeService.route.next(undefined);
  }
}
