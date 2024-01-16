"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

export const CheckoutButton = ({event}: { event: IEvent}) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  //const isEventCreator = user?.id === event.organizer._id.toString();
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry the event has finished.</p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className='button rounded-full' size="lg">
              <Link href='/sign-in'>Get ticket</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Checkout event={event} userId={userId}/>
          </SignedIn>
        </>
      )}
    </div>
  );
}
