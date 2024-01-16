import Collections from '@/components/shared/Collections'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organizedEvent = await getEventsByUser({userId, page: 1})

  //const myEventTickets = await

  console.log(organizedEvent, 'my profile')

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
      {/* <section className="wrapper my-8">
          <Collections
            data={''}
            emptyTitle=" No events tickets purchased yet"
            emptyStateSubtext="No worries - plenty of exciting events to choose from"
            collectionType="My_Tickets"
            limit={3}
            page={1}
            urlParamName='ordersPage'
            totalPages={2}
          />
      </section> */}

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
            data={organizedEvent?.data}
            emptyTitle=" No events have been created yet"
            emptyStateSubtext="Go create some now!"
            collectionType="Events_Organized"
            limit={6}
            page={1}
            urlParamName='eventsPage'
            totalPages={2}
          />
      </section>
      
    </>
  );
}

export default ProfilePage