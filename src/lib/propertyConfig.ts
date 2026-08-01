export interface RoomConfig {
  id: string;
  title: string;
  price: string;
  priceAmount: number;
  badge?: string;
  image: string;
  description: string;
  maxGuests: string;
}

export interface DemoEvent {
  title: string;
  time: string;
  location: string;
  description: string;
}

export interface PropertyConfig {
  id: string;
  name: string;
  tagline: string;
  location: string;
  timezone: string;
  googleMapsUrl: string;
  demoPaymentUrl: string;
  checkInTime: string;
  checkOutTime: string;
  receptionHours: string;
  lateCheckInPolicy: string;
  roomServiceHours: string;
  breakfastHours: string;
  dietarySupport: string[];
  demoWeather: {
    condition: string;
    temperature: string;
    suggestion: string;
  };
  localEvents: DemoEvent[];
  rooms: RoomConfig[];
  dayoutPackage: {
    price: string;
    priceAmount: number;
    hours: string;
    includes: string[];
  };
  allowedTools: string[];
  allowedChips: string[];
}

export const PROPERTY_CONFIG: PropertyConfig = {
  id: "aura-boutique-hotel",
  name: "Aura Boutique Hotel & Villa",
  tagline: "Boutique Hospitality & Oceanfront Luxury",
  location: "Around 15 minutes from 5 Junction",
  timezone: "Asia/Colombo",
  googleMapsUrl: "https://maps.google.com/?q=Aura+Boutique+Hotel+Villa",
  demoPaymentUrl: "https://wesvion.ai/demo-payment",
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  receptionHours: "24/7 Front Desk Reception",
  lateCheckInPolicy: "24/7 Late Check-in available upon request. Prior notification appreciated.",
  roomServiceHours: "24/7 Late-Night Dining Menu available",
  breakfastHours: "7:00 AM to 10:30 AM (Ocean Terrace Restaurant)",
  dietarySupport: ["Gluten-free", "Vegan", "Halal", "Jain", "Allergen-conscious"],
  demoWeather: {
    condition: "Light afternoon rain",
    temperature: "27°C",
    suggestion: "Carry a light umbrella for evening ocean walks.",
  },
  localEvents: [
    {
      title: "Sunset Calypso Band",
      time: "6:00 PM – 8:30 PM",
      location: "Ocean Terrace Lounge",
      description: "Live acoustic tropical rhythms with complimentary sunset mocktails.",
    },
    {
      title: "Sunrise Beach Yoga",
      time: "6:30 AM – 7:30 AM",
      location: "Ocean Pavilion",
      description: "Guided morning mindfulness & oceanfront yoga session for guests.",
    },
    {
      title: "Chef's Seafood Barbecue",
      time: "7:00 PM – 10:00 PM",
      location: "Garden Terrace Grill",
      description: "Fresh catch ocean barbecue with custom Sri Lankan spice marinades.",
    },
  ],
  rooms: [
    {
      id: "ocean-suite",
      title: "Premium Ocean View Suite",
      price: "LKR 48,000 / night",
      priceAmount: 48000,
      badge: "Most Popular",
      image: "/images/ocean-view-suite.jpg",
      description: "King bed, private balcony with panoramic ocean views, gourmet breakfast included.",
      maxGuests: "2 Adults + 1 Child",
    },
    {
      id: "garden-room",
      title: "Deluxe Garden Room",
      price: "LKR 32,000 / night",
      priceAmount: 32000,
      image: "/images/garden-room.jpg",
      description: "Queen bed surrounded by lush tropical gardens, outdoor rain shower, breakfast included.",
      maxGuests: "2 Adults",
    },
    {
      id: "private-villa",
      title: "Private Villa with Pool",
      price: "LKR 85,000 / night",
      priceAmount: 85000,
      badge: "Luxury Villa",
      image: "/images/private-villa.jpg",
      description: "Spacious private villa with dedicated plunge pool, butler service & full kitchen.",
      maxGuests: "Up to 6 Guests",
    },
  ],
  dayoutPackage: {
    price: "LKR 3,500 per guest",
    priceAmount: 3500,
    hours: "9:00 AM – 5:00 PM",
    includes: ["Welcome Drink", "Lunch Buffet", "Pool Access", "Changing Room Facilities"],
  },
  allowedTools: [
    "pms_availability",
    "dynamic_rate",
    "weather",
    "local_events",
    "maps",
    "itinerary",
    "transport_reschedule",
    "service_request",
    "staff_handoff",
    "payment_preview",
    "media_gallery",
    "restaurant_menu",
  ],
  allowedChips: [
    "View Photos",
    "View Menu",
    "Check Demo Availability",
    "Start Booking",
    "View Directions",
    "Airport Transfer",
    "Spa Packages",
    "Candlelight Dinner",
    "Plan My Stay",
    "Speak to Staff",
    "Room Service",
    "Late Checkout",
  ],
};
