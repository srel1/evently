"use server"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";
import { revalidatePath } from "next/cache";

const populateEvent = async (query: any) => {
  return query
  .populate({ path: 'organizer', model: User, select: '_id firstName lastName'})
  .populate({ path: 'category', model: Category, select: '_id name'})
}

const getCategoryByName = async (name: any) => {
  return Category.findOne({name: { $regex: name, $options: 'i'}})
}


export async function createEvent({event, userId, path}: CreateEventParams) {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId)
  
    if(!organizer){
      throw new Error("Organizer not found")
    }

    const newEvent = await Event.create({
      ...event, 
      category: event.categoryId, 
      organizer: userId
    })

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error)
  }
}


export async function getEventById(eventId: string){
  try {
    await connectToDatabase();

    const eventInfo = await populateEvent(Event.findById(eventId));

    if(!eventInfo){
      throw new Error("Event not found")
    }

    return JSON.parse(JSON.stringify(eventInfo));
  } catch (error) {
    handleError(error)
  }
}


export async function getAllEvents({ query, limit = 6, page, category}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query ? {title: { $regex: query, $options: 'i'}} : {}
    const categoryCondition = category ? await getCategoryByName(category) : null;
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id} : {}],
    };

    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc'})
    .skip(skipAmount)
    .limit(limit)

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}


export async function deleteEvent ({eventId, path}: DeleteEventParams){
  try {
    await connectToDatabase();

    const deleteEvent = await Event.findByIdAndDelete(eventId);

    if(deleteEvent){
      revalidatePath(path)
    }

  } catch (error) {
    handleError(error)
  }
}


export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}


export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}


export async function getEventsByUser({userId, limit = 6, page}: GetEventsByUserParams){
  try {
    await connectToDatabase();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1 ) * limit;

    const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc'})
    .skip(skipAmount)
    .limit(limit)

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    };
  } catch (error) {
    handleError(error)
  }
}