import { ref, set, get, update, remove,push } from "firebase/database";
import { Firebase } from "../services/firebaseConfig";
import { IEvent } from "../common/types";

class EventModel {
  private db = Firebase.db;
  private path = "events"

  async createEvent(event: IEvent): Promise<IEvent> {
    try {
      // Generate a new event ID using Firebase push()
      const eventRef = ref(this.db, this.path);
      const newEventRef = push(eventRef);
      if (!newEventRef.key) throw new Error("Problem with item id on DB")
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
}

export default new EventModel();
