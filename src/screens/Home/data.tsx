export interface IEvent {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  imageUrl?: string;
}

const fakeEvents: IEvent[] = [
  {
    id: "1",
    title: "Music Festival",
    description: "A great music festival with popular bands.",
    latitude: 37.7749,
    longitude: -122.4194,
    date: "2024-06-20",
    imageUrl: "https://example.com/event1.jpg",
  },
  {
    id: "2",
    title: "Art Expo",
    description: "An exhibition of modern art.",
    latitude: 34.0522,
    longitude: -118.2437,
    date: "2024-07-15",
    imageUrl: "https://example.com/event2.jpg",
  },
  {
    id: "3",
    title: "Food Fair",
    description: "A fair with a variety of food stalls.",
    latitude: 40.7128,
    longitude: -74.006,
    date: "2024-08-10",
    imageUrl: "https://example.com/event3.jpg",
  },
];

export default fakeEvents;