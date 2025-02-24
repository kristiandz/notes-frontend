import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CategoryService } from './category.service';
import { Category } from '../notes/note/note.model';

@Component({
  selector: 'app-categories',
  imports: [HeaderComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  removeCategory(id: number) {
    this.categoryService.removeCategory(id).subscribe(() => {
      this.categories.set(
        this.categories().filter((category) => category.id !== id)
      );
    });
  }
}
