import { ref, set, get, update, remove, push, query, orderByChild, startAt, endAt, equalTo } from "firebase/database";
import { Firebase } from "../services/firebaseConfig";
import { DateFilter, IEvent, IUserDetails, SportType } from "../common/types";
import moment from "moment";

class EventModel {
  private db = Firebase.db;
  private path = "events";

  async createEvent(event: IEvent): Promise<IEvent> {
    try {
      // Generate a new event ID using Firebase push()
      const eventRef = ref(this.db, this.path);
      const newEventRef = push(eventRef);
      if (!newEventRef.key) throw new Error("Problem with item id on DB");
      event.id = newEventRef.key;
      await set(newEventRef, event);
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async getEventById(id: string): Promise<IEvent> {
    try {
      const eventRef = ref(this.db, `${this.path}/${id}`);
      const snapshot = await get(eventRef);
      if (!snapshot.exists()) throw new Error("Event not found");
      return snapshot.val() as IEvent;
    } catch (error) {
      console.log("Error fetching event:", error);
      throw error;
    }
  }

  async updateEvent(id: string, updatedEvent: Partial<IEvent>): Promise<void> {
    try {
      const eventRef = ref(this.db, `${this.path}/${id}`);

      // Fetch the current event data
      const snapshot = await get(eventRef);
      if (!snapshot.exists()) {
        throw new Error("Event not found");
      }
      const currentEvent = snapshot.val() as IEvent;

      // Determine which fields need to be removed
      const fieldsToRemove = Object.keys(currentEvent).filter((key) => !(key in updatedEvent)) as (keyof IEvent)[];

      // Create an update object including null values for fields to be removed
      const updateData: Partial<IEvent> = { ...updatedEvent };
      for (const field of fieldsToRemove) {
        updateData[field] = null as any;
      }

      // Update the event in the database
      await update(eventRef, updateData);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const eventRef = ref(this.db, `${this.path}/${id}`);
      await remove(eventRef);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  async getAllEvents(): Promise<IEvent[]> {
    try {
      const eventsRef = ref(this.db, this.path);
      const snapshot = await get(eventsRef);
      const events: IEvent[] = [];
      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val() as IEvent;
        events.push(event);
      });
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  async getFilteredEvents(sportTypeFilter: SportType, dateFilter: DateFilter): Promise<IEvent[]> {
    try {
      let startDate = moment().startOf("day");
      let endDate = moment().endOf("day");
      const now = moment();

      if (dateFilter === "Week") {
        endDate = moment().add(7, "days").endOf("day");
      } else if (dateFilter === "Month") {
        endDate = moment().add(30, "days").endOf("day");
      }

      let eventsQuery;
      if (sportTypeFilter === "All") {
        eventsQuery = query(ref(this.db, this.path));
      } else {
        eventsQuery = query(ref(this.db, this.path), orderByChild("sportType"), startAt(sportTypeFilter), endAt(sportTypeFilter));
      }

      const snapshot = await get(eventsQuery);
      const events: IEvent[] = [];

      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val() as IEvent;
        const eventDate = moment(event.dateTime);
        if (eventDate.isBetween(startDate, endDate, undefined, "[]") && eventDate.isAfter(now)) {
          events.push(event);
        }
      });

      return events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } catch (error) {
      console.error("Error fetching filtered events:", error);
      throw error;
    }
  }

  async getEventsByCreatorId(creatorId: string): Promise<IEvent[]> {
    try {
      const eventsQuery = query(ref(this.db, this.path), orderByChild("creator/id"), equalTo(creatorId));
      const snapshot = await get(eventsQuery);
      const events: IEvent[] = [];

      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val() as IEvent;
        events.push(event);
      });

      return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Error fetching events by creator ID:", error);
      throw error;
    }
  }

  async getEventsByParticipantId(participantId: string): Promise<IEvent[]> {
    try {
      const eventsRef = ref(this.db, this.path);
      const snapshot = await get(eventsRef);
      const events: IEvent[] = [];

      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val() as IEvent;
        if (event.participants && event.participants[participantId]) {
          events.push(event);
        }
      });

      return events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } catch (error) {
      console.error("Error fetching events by participant ID:", error);
      throw error;
    }
  }

  async attendEvent(eventId: string, participantDetails: IUserDetails): Promise<void> {
    try {
      const eventRef = ref(this.db, `${this.path}/${eventId}`);
      const snapshot = await get(eventRef);

      if (!snapshot.exists()) {
        throw new Error("Event does not exist");
      }

      const event = snapshot.val() as IEvent;
      const participants = event.participants || {};

      if (participants[participantDetails.id]) {
        throw new Error("Participant already attending this event");
      }

      if (event.participantsLimit && Object.keys(participants).length >= event.participantsLimit) {
        throw new Error("Event is already full");
      }

      participants[participantDetails.id] = { user: participantDetails };
      await update(eventRef, { participants });
    } catch (error) {
      console.error("Error attending event:", error);
      throw error;
    }
  }

  async unAttendEvent(eventId: string, participantId: string): Promise<void> {
    try {
      const eventRef = ref(this.db, `${this.path}/${eventId}`);
      const snapshot = await get(eventRef);

      if (snapshot.exists()) {
        const event = snapshot.val() as IEvent;

        if (event.participants && event.participants[participantId]) {
          delete event.participants[participantId]; // Remove the participant

          await update(eventRef, { participants: event.participants });
        } else {
          throw new Error("Participant not found in the event");
        }
      } else {
        throw new Error("Event not found");
      }
    } catch (error) {
      console.error("Error un-attending event:", error);
      throw error;
    }
  }
}

export default new EventModel();
