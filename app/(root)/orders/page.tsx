import Search from '@/components/shared/Search'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrdersByEvent } from '@/lib/actions/order.actions'
import { SearchParamProps } from '@/types'
import { IOrderItem } from '@/lib/database/models/order.model'
import { formatDateTime, formatPrice } from '@/lib/utils'

const ordersPage = async ({searchParams}: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || '';
  const searchString = (searchParams?.query as string) || '';

  const orders = await getOrdersByEvent({searchString, eventId})
  //console.log(orders, "from the orders page")
  
  return (
    <>
      <section className="bg-dotted-pattern bg-center bg-cover py-5 md:py-10 bg-primary-50">
        <div className="wrapper flex items-center justify-center md:justify-start">
          <h3 className="h3-bold text-center md:text-left">Orders</h3>
        </div>
      </section>

      <section className="wrapper">
        <div className='py-7'>
          <Search placeholder='Search buyer name...'/>
        </div>
        {/*table*/}
        <div className='wrapper overflow-x-auto'>
          <Table className='w-full border-collapse border-t'>
            <TableHeader>
              <TableRow className='p-medium-14 border-b text-grey-500'>
                <TableHead className="min-w-[250px] py-3 text-left">Order ID</TableHead>
                <TableHead className="min-w-[200px] flex-1 py-3 pr-4 text-left">Event Title</TableHead>
                <TableHead className="min-w-[150px] py-3 text-left">Buyer</TableHead>
                <TableHead className="min-w-[100px] py-3 text-left">Created</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                { orders && orders.length === 0 ? (<>
                  <TableRow className='border-b'>
                    <TableCell colSpan={5} className='py-4 text-center text-gray-500'>No orders found.</TableCell>
                  </TableRow>
                </>) : (<>
                  { orders && orders.map((row: IOrderItem) => (
                  <TableRow key={row._id} className='p-regular-14 lg:p-regular-16 border-b'>
                    <TableCell className="min-w-[250px] py-4 text-primary-500" >{row._id}</TableCell>
                    <TableCell className="min-w-[250px] flex-1 py-4 pr-4">{row.eventTitle}</TableCell>
                    <TableCell className="min-w-[150px] py-4">{row.buyer}</TableCell>
                    <TableCell className="min-w-[100px] py-4">{formatDateTime(row.createdAt).dateTime}</TableCell>
                    <TableCell className="min-w-[100px] py-4 text-right">{formatPrice(row.totalAmount)}</TableCell>
                  </TableRow>
                  ))}
                </>
                )}
                
                
                
              
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default ordersPage