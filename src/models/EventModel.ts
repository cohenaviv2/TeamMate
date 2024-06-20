import { ref, set, get, update, remove, push, query, orderByChild, startAt, endAt } from "firebase/database";
import { Firebase } from "../services/firebaseConfig";
import { IEvent, SportType } from "../common/types";
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

  async getEventById(id: string): Promise<IEvent | null> {
    try {
      const eventRef = ref(this.db, `${this.path}/${id}`);
      const snapshot = await get(eventRef);
      if (snapshot.exists()) {
        return snapshot.val() as IEvent;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  async updateEvent(id: string, updatedEvent: Partial<IEvent>): Promise<void> {
    try {
      const eventRef = ref(this.db, `${this.path}/${id}`);
      await update(eventRef, updatedEvent);
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

  async getFilteredEvents(sportTypeFilter: SportType, dateFilter: "Month" | "Week" | "Today"): Promise<IEvent[]> {
    try {
      let startDate = moment().startOf("day");
      let endDate = moment().endOf("day");

      if (dateFilter === "Week") {
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");
      } else if (dateFilter === "Month") {
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
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
        if (eventDate.isBetween(startDate, endDate, undefined, "[]")) {
          events.push(event);
        }
      });

      return events;
    } catch (error) {
      console.error("Error fetching filtered events:", error);
      throw error;
    }
  }
}

export default new EventModel();
