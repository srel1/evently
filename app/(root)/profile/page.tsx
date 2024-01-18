import Collections from '@/components/shared/Collections'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({searchParams}: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1; 
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const organizedEvents = await getEventsByUser({userId, page: eventsPage})
  const orders = await getOrdersByUser({ userId, page: ordersPage})

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];

  
  //console.log(organizedEvents, "organized events")
  //console.log({orderedEvents}, "ordered events")
  //console.log(orders, "raw orders")


  return (
    <>
      {/*MY tickets */}
      <section className="bg-dotted-pattern bg-primary-50 bg-cover bg-center py-5 md:py-10">
        <div className="flex items-center justify-center sm:justify-between wrapper">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore more events</Link>
          </Button>
        </div>
      </section>

      {/*The events i bought tickets for*/}
      <section className="wrapper my-8">
          <Collections
            data={orderedEvents}
            emptyTitle=" No events tickets purchased yet"
            emptyStateSubtext="No worries - plenty of exciting events to choose from"
            collectionType="My_Tickets"
            limit={3}
            page={ordersPage}
            urlParamName='ordersPage'
            totalPages={orders?.totalPages}
          />
          {/* 5:01:06 */}
      </section>

      {/*Events organized */}
      <section className="bg-dotted-pattern bg-primary-50 bg-cover bg-center py-5 md:py-10">
        <div className="flex items-center justify-center sm:justify-between wrapper">
          <h3 className="h3-bold text-center sm:text-left">Events organized</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/events/create">Create event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
          <Collections
            data={organizedEvents?.data}
            emptyTitle=" No events have been created yet"
            emptyStateSubtext="Go create some now!"
            collectionType="Events_Organized"
            limit={6}
            page={eventsPage}
            urlParamName='eventsPage'
            totalPages={organizedEvents?.totalPages}
          />
      </section>
      
    </>
  );
}

export default ProfilePage