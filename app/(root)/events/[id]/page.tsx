// import { CheckoutButton } from '@/components/shared/CheckoutButton'
import CheckoutButton from '@/components/shared/CheckoutButton'
import Collections from '@/components/shared/Collections'
import { getAllEvents, getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const EventDetails = async ({params: { id }, searchParams}: SearchParamProps) => {
  const event = await getEventById(id);

  const formatedStartDate = formatDateTime(event.startDateTime)
  const formatedEndDate = formatDateTime(event.endDateTime)
  //console.log(formatedStartDate, formatedEndDate)

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  })
  

  console.log(event, "from the event Details")

  return (
    <>
    <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
      <div className='grid grid-cols-1 md:grid-cols-2 2xl:maw-w-7xl'>
        <Image src={event.imageUrl} 
        alt='event image'
        width={1000}
        height={1000}
        className='h-full min-h-[300px] object-cover object-center'
        />

        <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
          <div className='flex flex-col gap-6'>
            <h2 className='h2-bold'>{event.title}</h2>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <div className='flex gap-3'>
                <p className='p-bold-20 bg-green-500/10 rounded-full px-5 py-2 text-green-700'>
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </p>
                <p className='p-medium-16 bg-grey-500/10 rounded-full px-4 py-2.5 text-grey-500'>
                  {event.category.name}
                </p>
              </div>

              <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                by{' '}
                <span className='text-primary-500'>{event.organizer.firstName} | {event.organizer.lastName}</span>
              </p>
            </div>
          </div>

          {/*ticket button goes here*/}
          <CheckoutButton event={event}/>

          <div className='flex flex-col gap-5'>
            <div className='flex gap-2 md:gap-3'>
              <Image 
                src='/assets/icons/calendar.svg' 
                alt='calendar'
                width={32}
                height={32}
                />
                <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center justify-center'>
                  <p>{formatedStartDate.dateOnly} / {formatedStartDate.timeOnly} - {formatedEndDate.timeOnly} </p>
                </div>
            </div>

            <div className='p-regular-20 items-center flex gap-3'>
              <Image 
                src='/assets/icons/location.svg' 
                alt='calendar'
                width={32}
                height={32}
                />
                <div className='flex items-center justify-center'>
                  <p className='p-medium-16 lg:p-regular-20'>{event.location}</p>
                </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='p-bold-20 text-grey-600'>What you'll do:</p>
            <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
            <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500'>{event.url}</p>
          </div>

        </div>     
      </div>
    </section>

    <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
      <h2 className='h2-bold '>Related Events</h2>

      <Collections
        data={relatedEvents?.data}
        emptyTitle=' No events found'
        emptyStateSubtext='Come back later'
        collectionType='All_Events'
        limit={6}
        page={1}
        totalPages={2}
      />

    </section>
    </>
  )
}

export default EventDetails
