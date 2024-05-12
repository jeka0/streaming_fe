import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ITag } from '../../interfaces/tag.interface';

@Component({
  selector: 'app-tag-preview',
  templateUrl: './tag-preview.component.html',
  styleUrls: ['./tag-preview.component.css']
})
export class TagPreviewComponent {
  @Input() tag!: ITag;
  @Input() removeBut: boolean = false;
  @Output() onRemove = new EventEmitter();

  constructor(
    private userService: UserService
  ){}

  remove(){
    this.userService.removeTag(this.tag.id).subscribe({
      next:result=>this.onRemove.emit(result),
      error:err=>console.log(err)
    })
  }

}
