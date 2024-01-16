import React, { startTransition, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Category, { ICategory } from '@/lib/database/models/category.model';
import { Input } from '../ui/input';
import { createCategory, getAllCategories } from '@/lib/actions/category.action';

type dropdownProps = {
  value: string;
  onChangeHandler: () => void;
}

const Dropdown = ({value, onChangeHandler}: dropdownProps) => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    createCategory({
      categoryName: newCategory.trim()
    })
    .then((category) => {
      setCategories((prevState) => [...prevState, category])
    })
  }

  //console.log(newCategory)

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[])
    }
    getCategories();
  }, [])
  


  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger
        className="w-full bg-grey-50 h-[54px] placeholder:text-grey-500 
      rounded-full p-regular-16 px-5 py-3 border-none focus-visible:ring-transparent 
      focus:ring-transparent !important;"
      >
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
               <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
          ))}
        
        <AlertDialog>
          <AlertDialogTrigger className='font-medium text-[14px] leading-[20px] 
          flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50
         focus:text-primary-500'>Add new category
         </AlertDialogTrigger>
          <AlertDialogContent className='bg-white'>
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input type='text' placeholder='Category name' 
                onChange={(e) => setNewCategory(e.target.value)} 
                className='bg-grey-50 h-[54px] focus-visible:ring-offset-0 
                placeholder:text-grey-500 rounded-full p-regular-16 px-4 py-3 
                border-none focus-visible:ring-transparent !important; mt-3'/>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </SelectContent>
    </Select>
  );
}

export default Dropdown