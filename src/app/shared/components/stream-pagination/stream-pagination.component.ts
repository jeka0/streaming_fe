import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { PageEvent } from '@angular/material/paginator';
import { ICategory } from '../../interfaces/category.interface';
import { IPagination } from '../../interfaces/pagination.interface';

@Component({
  selector: 'app-stream-pagination',
  templateUrl: './stream-pagination.component.html',
  styleUrls: ['./stream-pagination.component.css']
})
export class StreamPaginationComponent {
  @Input() length!: number;
  @Input() pages: number[] = [3, 6, 9, 12];
  @Input() downMessage: string = "Сортировать по новым";
  @Input() upMessage: string = "Сортировать по старым";
  @Output() getStreams = new EventEmitter<IPagination>();
  defaultCategory!: ICategory;
  categorys!: ICategory[];
  category!: string;
  pageIndex!: number;
  pageSize!:number;
  order: boolean = false;


  constructor(
    private categorySetvice:CategoryService
  ){
    this.defaultCategory = { id: 0, name:"Все категории"};
    this.category = this.defaultCategory.name;
    this.pageSize = this.pages[0];
    this.pageIndex = 0;
    this.categorys = [this.defaultCategory];
  }

  ngOnInit(){
    this.categorySetvice.getAllCategorys().subscribe({
      next:(categorys)=>{
        this.categorys = [this.defaultCategory, ...categorys];
      },
      error:err=>console.log(err)
    })
  }

  onCategory(){
    this.updateData(1, this.pageSize);
  }

  toggleOrder(){
    this.order = !this.order;
    this.updateData(1, this.pageSize);
  }

  onPage(event: PageEvent){
    this.updateData(event.pageIndex + 1, event.pageSize);
  }

  updateData(page: number, limit: number){
    this.pageIndex = page - 1;
    this.pageSize = limit;
    const data: IPagination = { page, limit };
    if(this.order) data.order = "ASC";
    if(this.category !== this.defaultCategory.name) data.category = this.category;
    this.getStreams.emit(data);
  }
}
