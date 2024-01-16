"use client"

import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { convertFileToUrl } from '@/lib/utils';
 
type FileUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
 }

 // Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { FileWithPath } from '@uploadthing/react';
import { Button } from '../ui/button';
 
const FileUploader = ({onFieldChange, setFiles, imageUrl}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, []);
 
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(['image/*']) : undefined,
  });
 
  return (
    <div {...getRootProps()} className='flex items-center justify-center bg-dark-3 h-72 flex-col cursor-pointer overflow-hidden rounded-xl bg-gray-50'>
      <input {...getInputProps()} className='cursor-pointer'/>

       {imageUrl ? (
        <div className='flex h-full w-full flex-1 justify-center'>
          <img
            src={imageUrl}
            alt='image'
            width={250}
            height={250}
            className='q-full object-cover object-center'
          />
        </div>
       ) : (
        <div className='flex items-center justify-center flex-col py-5 text-gray-500'>
          <img src='/assets/icons/upload.svg' alt='file upload' width={77} height={77}/>
          <h3 className='mb-2 mt-2'>Drag photo</h3>
          <p className='p-medium-12 mb-4'>SVG, PNG, JPG</p>
          <Button type='button' className='rounded-full'>
            Select file from computer
          </Button>
        </div>
       )}
    </div>
  );
}

export default FileUploader

//2:13:54



/*
 const { startUpload, permittedFileInfo } = useUploadThing(
    "myUploadEndpoint",
    {
      onClientUploadComplete: () => {
        alert("uploaded successfully!");
      },
      onUploadError: () => {
        alert("error occurred while uploading");
      },
      onUploadBegin: () => {
        alert("upload has begun");
      },
    },
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];


*/ 