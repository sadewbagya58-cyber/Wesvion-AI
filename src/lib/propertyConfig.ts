export interface RoomConfig {
  id: string;
  title: string;
  price: string;
  priceAmount: number;
  badge?: string;
  image: string;
  description: string;
  maxGuests: string;
  aliases: string[];
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
  earlyCheckInPolicy: string;
  lateCheckOutPolicy: string;
  lateCheckInPolicy: string;
  roomServiceHours: string;
  diningHours: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
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
    minGuests: number;
    hours: string;
    includes: string[];
    childrenRates: {
      under5: string;
      ages5to10: string;
    };
  };
  corkageFee: {
    food: string;
    liquor: string;
  };
  airportTransfer: {
    distance: string;
    travelTime: string;
    carPrice: string;
    vanPrice: string;
    tollsIncluded: boolean;
  };
  discountPolicy: string;
  celebrationExtras: {
    flowerDecoration: string;
    chocolateCake: string;
    candlelightDinner: string;
  };
  driverFacilities: string[];
  allowedTools: string[];
  allowedChips: string[];
}

export const PROPERTY_CONFIG: PropertyConfig = {
  id: "aura-boutique-hotel",
  name: "Aura Boutique Hotel & Villa",
  tagline: "Boutique Hospitality & Oceanfront Luxury",
  location: "Beach Road, Bentota",
  timezone: "Asia/Colombo",
  googleMapsUrl: "https://maps.google.com/?q=Aura+Boutique+Hotel+Bentota",
  demoPaymentUrl: "https://wesvion.ai/demo-payment",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  receptionHours: "24/7 Front Desk Reception",
  earlyCheckInPolicy: "Early check-in (from 10:00 AM) is subject to room availability upon arrival.",
  lateCheckOutPolicy: "Late check-out (until 2:00 PM) is subject to room availability upon arrival.",
  lateCheckInPolicy: "24/7 Late check-in available. Kindly inform us of your estimated arrival time in advance.",
  roomServiceHours: "6:30 AM to 11:00 PM daily",
  diningHours: {
    breakfast: "7:30 AM – 10:00 AM",
    lunch: "12:30 PM – 2:30 PM",
    dinner: "7:30 PM – 10:00 PM",
  },
  dietarySupport: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Allergen-conscious"],
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
      id: "standard-deluxe",
      title: "Standard Deluxe Double Room",
      price: "LKR 15,000 / night",
      priceAmount: 15000,
      image: "/images/garden-room.jpg",
      description: "Comfortable air-conditioned double room with modern amenities.",
      maxGuests: "2 Adults",
      aliases: ["standard deluxe", "deluxe double", "deluxe room"],
    },
    {
      id: "garden-room",
      title: "Deluxe Garden Room",
      price: "LKR 32,000 / night",
      priceAmount: 32000,
      image: "/images/garden-room.jpg",
      description: "Queen bed surrounded by lush tropical gardens, outdoor rain shower, breakfast included.",
      maxGuests: "2 Adults",
      aliases: ["deluxe garden", "garden room"],
    },
    {
      id: "ocean-suite",
      title: "Premium Ocean View Suite",
      price: "LKR 48,000 / night",
      priceAmount: 48000,
      badge: "Most Popular",
      image: "/images/ocean-view-suite.jpg",
      description: "King bed, private balcony with panoramic ocean views, gourmet breakfast included.",
      maxGuests: "2 Adults + 1 Child",
      aliases: ["ocean view suite", "premium ocean view suite", "deluxe ocean view", "ocean view room"],
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
      aliases: ["private villa", "pool villa", "villa"],
    },
  ],
  dayoutPackage: {
    price: "LKR 3,500 net per person",
    priceAmount: 3500,
    minGuests: 5,
    hours: "9:00 AM – 5:00 PM",
    includes: [
      "Welcome Drink",
      "Buffet Lunch",
      "Evening Tea & Snacks",
      "Swimming Pool Access",
      "Changing Room Facilities",
    ],
    childrenRates: {
      under5: "Free of charge",
      ages5to10: "50% charge (LKR 1,750 per child)",
    },
  },
  corkageFee: {
    food: "Outside food is not permitted.",
    liquor: "Outside liquor is permitted with a corkage fee of LKR 2,000 per bottle.",
  },
  airportTransfer: {
    distance: "90 km from Katunayake International Airport (CMB)",
    travelTime: "1.5 – 2 hours via Southern Expressway",
    carPrice: "LKR 16,000 net per way (up to 3 guests)",
    vanPrice: "LKR 22,000 net per way (up to 7 guests)",
    tollsIncluded: true,
  },
  discountPolicy: "10% to 15% discount for stays longer than 3 nights or bookings of more than 3 rooms.",
  celebrationExtras: {
    flowerDecoration: "LKR 4,000 (Bed & Room Flower Setup)",
    chocolateCake: "LKR 3,500 (1kg Chocolate Cake)",
    candlelightDinner: "LKR 12,000 per couple (Romantic 4-course beachside setup)",
  },
  driverFacilities: [
    "Complimentary driver quarters",
    "Complimentary driver meals",
    "24/7 CCTV-monitored secure parking",
  ],
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
