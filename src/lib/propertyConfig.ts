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

export interface PropertyConfig {
  id: string;
  name: string;
  tagline: string;
  location: string;
  googleMapsUrl: string;
  demoPaymentUrl: string;
  checkInTime: string;
  checkOutTime: string;
  breakfastHours: string;
  rooms: RoomConfig[];
  dayoutPackage: {
    price: string;
    priceAmount: number;
    hours: string;
    includes: string[];
  };
  allowedChips: string[];
}

export const PROPERTY_CONFIG: PropertyConfig = {
  id: "aura-boutique-hotel",
  name: "Aura Boutique Hotel & Villa",
  tagline: "Boutique Hospitality & Oceanfront Luxury",
  location: "Around 15 minutes from 5 Junction",
  googleMapsUrl: "https://maps.google.com/?q=Aura+Boutique+Hotel+Villa",
  demoPaymentUrl: "https://wesvion.ai/demo-payment",
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  breakfastHours: "7:00 AM to 10:30 AM",
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
  allowedChips: [
    "View Photos",
    "View Menu",
    "Check Demo Availability",
    "Start Booking",
    "Book This Room",
    "View Directions",
    "Airport Transfer",
    "Spa Packages",
    "Candlelight Dinner",
    "Speak to Staff",
  ],
};
