// Kyubii Digital Map - Data Constants
// All tourism spots, categories, and bus courses for Nasu Town, Japan

export type SpotStatus = "active" | "suspended";

export type Category = "gourmet" | "activity" | "tourism" | "hotspring";

export interface Spot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: SpotStatus;
  categories: Category[];
  isBusStop: boolean;
}

export interface Course {
  id: string;
  name: string;
  color: string;
  spotIds: number[];
}

export type Interest = Category;
export type TripDuration = "half-day" | "full-day";

// Category mappings from requirements
const categoryMap: Record<Category, number[]> = {
  gourmet: [1, 7, 16, 18, 22, 26, 27, 30, 31],
  activity: [4, 6, 7, 18, 20, 22, 23, 25, 26, 28, 29],
  tourism: [6, 7, 9, 12, 17, 18, 22, 26, 29],
  hotspring: [2, 3, 8, 12, 13, 15, 19, 21],
};

// Helper to get categories for a spot
function getCategoriesForSpot(id: number): Category[] {
  const cats: Category[] = [];
  for (const [cat, ids] of Object.entries(categoryMap)) {
    if (ids.includes(id)) {
      cats.push(cat as Category);
    }
  }
  return cats;
}

// Bus stop IDs
const busStopIds = [5, 11, 14, 24];

// Real coordinates for Nasu, Japan tourism spots
export const spots: Spot[] = [
  { id: 1, name: "Nasu Kogen Yuai no Mori", lat: 37.040872891296836, lng: 140.01338438747982, status: "active", categories: getCategoriesForSpot(1), isBusStop: false },
  { id: 2, name: "Wellness Forest Nasu", lat: 37.045356856265386, lng: 140.02159076167842, status: "active", categories: getCategoriesForSpot(2), isBusStop: false },
  { id: 3, name: "Hotel Epinard Nasu", lat: 37.049952783791014, lng: 140.02380157116596, status: "active", categories: getCategoriesForSpot(3), isBusStop: false },
  { id: 4, name: "Treasure Stone Park", lat: 37.05000305823371, lng: 140.03100633862647, status: "active", categories: getCategoriesForSpot(4), isBusStop: false },
  { id: 5, name: "Bus Stop", lat: 37.05472961127315, lng: 140.03711137988955, status: "active", categories: [], isBusStop: true },
  { id: 6, name: "Nasu Teddy Bear Museum", lat: 37.049198378882735, lng: 140.03958193005198, status: "active", categories: getCategoriesForSpot(6), isBusStop: false },
  { id: 7, name: "Rindoko Family Ranch", lat: 37.041306554975556, lng: 140.04703218837264, status: "active", categories: getCategoriesForSpot(7), isBusStop: false },
  { id: 8, name: "Grand Mecure Nasu", lat: 37.04001847176965, lng: 140.04095539289787, status: "active", categories: getCategoriesForSpot(8), isBusStop: false },
  { id: 9, name: "Nasu Stained Glass Museum", lat: 37.065525450772306, lng: 140.02490182697397, status: "active", categories: getCategoriesForSpot(9), isBusStop: false },
  { id: 10, name: "Tokyu Harvest Club", lat: 37.069873701661706, lng: 140.0228803643896, status: "suspended", categories: [], isBusStop: false },
  { id: 11, name: "Bus Stop", lat: 37.05707890880237, lng: 140.03628597512008, status: "active", categories: [], isBusStop: true },
  { id: 12, name: "Nasu Yumoto Hot Springs", lat: 37.099302214340526, lng: 140.00039803676512, status: "active", categories: getCategoriesForSpot(12), isBusStop: false },
  { id: 13, name: "Hotel Sun Valley Nasu", lat: 37.087037038095865, lng: 140.00531519298178, status: "active", categories: getCategoriesForSpot(13), isBusStop: false },
  { id: 14, name: "Bus Stop", lat: 37.088369720300875, lng: 140.0073461, status: "active", categories: [], isBusStop: true },
  { id: 15, name: "Sansuikaku Entrance", lat: 37.087809517807685, lng: 140.0111625276528, status: "active", categories: getCategoriesForSpot(15), isBusStop: false },
  { id: 16, name: "Soba: Ikkenjaya", lat: 37.08154247155476, lng: 140.0135610820572, status: "active", categories: getCategoriesForSpot(16), isBusStop: false },
  { id: 17, name: "Seiji Fujishiro Museum of Art", lat: 37.083090382286805, lng: 140.00464402895898, status: "active", categories: getCategoriesForSpot(17), isBusStop: false },
  { id: 18, name: "Minamigaoka Ranch", lat: 37.078458111949004, lng: 140.0008749906835, status: "active", categories: getCategoriesForSpot(18), isBusStop: false },
  { id: 19, name: "Towa Pure Cottage NASU/NOZARU", lat: 37.065382696612204, lng: 139.96674905758303, status: "active", categories: getCategoriesForSpot(19), isBusStop: false },
  { id: 20, name: "Nasu Highland Park", lat: 37.06541848759843, lng: 139.9632845855609, status: "active", categories: getCategoriesForSpot(20), isBusStop: false },
  { id: 21, name: "Nasu Village", lat: 37.05915519359856, lng: 139.9812700990486, status: "active", categories: getCategoriesForSpot(21), isBusStop: false },
  { id: 22, name: "Seiryu no Sato", lat: 37.06123822430164, lng: 139.99260083377428, status: "active", categories: getCategoriesForSpot(22), isBusStop: false },
  { id: 23, name: "Nasu Safari Park", lat: 37.059193483625016, lng: 140.0062517108532, status: "active", categories: getCategoriesForSpot(23), isBusStop: false },
  { id: 24, name: "Bus Stop", lat: 37.05595680718895, lng: 139.99087850230165, status: "active", categories: [], isBusStop: true },
  { id: 25, name: "Candle House Chouchou", lat: 37.042284276658876, lng: 140.00625369535658, status: "active", categories: getCategoriesForSpot(25), isBusStop: false },
  { id: 26, name: "Mountain Stream Park", lat: 37.07792240897927, lng: 139.99883542883583, status: "active", categories: getCategoriesForSpot(26), isBusStop: false },
  { id: 27, name: "Penny Lane Nasu", lat: 37.06888532894915, lng: 139.9999990230372, status: "active", categories: getCategoriesForSpot(27), isBusStop: false },
  { id: 28, name: "World Monkey Park", lat: 37.035218155862, lng: 140.04849957197902, status: "active", categories: getCategoriesForSpot(28), isBusStop: false },
  { id: 29, name: "Nasu Trick Art Pia", lat: 37.03156195862827, lng: 140.0359026918237, status: "active", categories: getCategoriesForSpot(29), isBusStop: false },
  { id: 30, name: "GOOD News Complex", lat: 37.025443781161435, lng: 140.0297962516706, status: "active", categories: getCategoriesForSpot(30), isBusStop: false },
  { id: 31, name: "Candy Castle", lat: 37.01710771506317, lng: 140.03043298610356, status: "active", categories: getCategoriesForSpot(31), isBusStop: false },
  { id: 32, name: "Loisir Nasu Entrance", lat: 37.059791710961036, lng: 140.03119901686813, status: "active", categories: getCategoriesForSpot(32), isBusStop: false },
  { id: 33, name: "Bus Stop", lat: 37.08160624392203, lng: 139.98126882883588, status: "active", categories: [], isBusStop: true },
];

// Bus Courses with colors
export const courses: Course[] = [
  {
    id: "A",
    name: "Course A",
    color: "#EF4444", // Red
    spotIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  },
  {
    id: "C",
    name: "Course C",
    color: "#A855F7", // Purple
    spotIds: [1, 2, 3, 4, 9, 11, 16, 17, 18, 22, 23, 24, 25, 26, 27, 32],
  },
  {
    id: "D",
    name: "Course D",
    color: "#F97316", // Orange
    spotIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25],
  },
  {
    id: "E",
    name: "Course E",
    color: "#22C55E", // Green
    spotIds: [1, 2, 3, 4, 5, 6, 7, 8, 28, 29, 30, 31],
  },
  {
    id: "F",
    name: "Course F",
    color: "#3B82F6", // Blue
    spotIds: [1, 2, 3, 4, 5, 6, 7, 8],
  },
];

// Category display info
export const categoryInfo: Record<Category, { label: string; icon: string }> = {
  gourmet: { label: "Gourmet", icon: "utensils" },
  activity: { label: "Activity", icon: "mountain" },
  tourism: { label: "Tourism", icon: "camera" },
  hotspring: { label: "Hot Spring", icon: "droplets" },
};

// Helper: Get spot by ID
export function getSpotById(id: number): Spot | undefined {
  return spots.find((s) => s.id === id);
}

// Helper: Get visible spots (excluding suspended)
export function getVisibleSpots(): Spot[] {
  return spots.filter((s) => s.status === "active");
}

// Helper: Filter spots by categories
export function filterSpotsByCategories(categories: Category[]): Spot[] {
  if (categories.length === 0) return getVisibleSpots();
  return getVisibleSpots().filter((spot) =>
    spot.categories.some((cat) => categories.includes(cat))
  );
}

// Helper: Get course polyline coordinates
export function getCourseCoordinates(course: Course): [number, number][] {
  return course.spotIds
    .map((id) => getSpotById(id))
    .filter((spot): spot is Spot => spot !== undefined && spot.status === "active")
    .map((spot) => [spot.lat, spot.lng] as [number, number]);
}

// Route Planner Logic
export interface TripPlan {
  spots: Spot[];
  recommendedCourse: Course | null;
  estimatedDuration?: number; // Total time in minutes (travel + activity)
  totalTravelTime?: number; // Travel time only in minutes
  totalActivityTime?: number; // Activity time only in minutes
  totalDistance?: number; // in km
}

// Advanced trip preferences interface
export interface CategoryTimePrefs {
  gourmet: number;
  activity: number;
  tourism: number;
  hotspring: number;
}

export interface TripPreferences {
  totalTimeHours: number;
  categoryTimes: CategoryTimePrefs;
  maxDistanceKm: number;
  selectedCategories: Category[];
}

// Center point of Nasu tourism area (for distance calculations)
const NASU_CENTER: [number, number] = [37.058, 140.005];

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate travel time between two points (in minutes)
// Uses road distance multiplier and average speed for Nasu mountain roads
function estimateTravelTime(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const straightLineDistance = calculateDistance(lat1, lng1, lat2, lng2);
  
  // Road distance is typically 1.3-1.5x straight line in mountainous areas
  const roadDistanceMultiplier = 1.4;
  const estimatedRoadDistance = straightLineDistance * roadDistanceMultiplier;
  
  // Average speed in Nasu (mountainous roads, traffic): 30 km/h
  const averageSpeedKmh = 30;
  
  // Convert to minutes, minimum 5 min for any trip
  return Math.max(5, Math.round((estimatedRoadDistance / averageSpeedKmh) * 60));
}

// Get average time for a spot based on its categories
function getSpotDuration(spot: Spot, categoryTimes: CategoryTimePrefs): number {
  if (spot.categories.length === 0) return 30; // Default for bus stops
  
  const totalTime = spot.categories.reduce(
    (sum, cat) => sum + categoryTimes[cat], 0
  );
  return totalTime / spot.categories.length;
}

// Advanced trip planning with user preferences
export function planTripAdvanced(prefs: TripPreferences): TripPlan {
  const { totalTimeHours, categoryTimes, maxDistanceKm, selectedCategories } = prefs;
  const totalMinutes = totalTimeHours * 60;
  
  // Filter spots by selected categories and distance from center
  let eligibleSpots = spots.filter((spot) => {
    // Skip bus stops
    if (spot.isBusStop) return false;
    // Skip suspended spots
    if (spot.status !== "active") return false;
    
    // Must have at least one selected category
    const hasCategory = spot.categories.some(cat => 
      selectedCategories.includes(cat)
    );
    if (!hasCategory) return false;
    
    // Must be within distance limit
    const distance = calculateDistance(
      NASU_CENTER[0], NASU_CENTER[1],
      spot.lat, spot.lng
    );
    if (distance > maxDistanceKm) return false;
    
    return true;
  });

  // Score spots based on category match strength
  const scoredSpots = eligibleSpots.map(spot => {
    const matchingCategories = spot.categories.filter(cat => 
      selectedCategories.includes(cat)
    ).length;
    const categoryScore = matchingCategories / selectedCategories.length;
    
    // Bonus for spots that match multiple selected interests
    const multiMatchBonus = matchingCategories > 1 ? 0.2 : 0;
    
    return {
      spot,
      score: categoryScore + multiMatchBonus,
      duration: getSpotDuration(spot, categoryTimes),
    };
  });

  // Sort by score (highest first)
  scoredSpots.sort((a, b) => b.score - a.score);

  // Select spots that fit within time budget using actual travel time estimates
  const selectedSpots: Spot[] = [];
  let totalTravelTime = 0;
  let totalActivityTime = 0;
  let totalDistanceCovered = 0;
  let lastSpot: Spot | null = null;

  for (const { spot, duration } of scoredSpots) {
    // Calculate travel time from last spot (or first spot gets 0 travel time)
    let travelTime = 0;
    if (lastSpot) {
      travelTime = estimateTravelTime(
        lastSpot.lat, lastSpot.lng,
        spot.lat, spot.lng
      );
    }
    
    const totalTimeForSpot = duration + travelTime;
    const currentTotalTime = totalTravelTime + totalActivityTime;
    
    // Check if we have time for this spot
    if (currentTotalTime + totalTimeForSpot <= totalMinutes) {
      selectedSpots.push(spot);
      totalTravelTime += travelTime;
      totalActivityTime += duration;
      
      // Calculate distance from last spot
      if (lastSpot) {
        totalDistanceCovered += calculateDistance(
          lastSpot.lat, lastSpot.lng,
          spot.lat, spot.lng
        );
      }
      lastSpot = spot;
    }
    
    // Stop if we've hit a reasonable maximum
    if (selectedSpots.length >= 10) break;
  }

  // Find the best course based on coverage efficiency
  // We want: course that covers most of our selected spots, 
  // AND where our spots make up a good portion of that course
  let bestCourse: Course | null = null;
  let bestScore = 0;

  for (const course of courses) {
    const overlap = selectedSpots.filter((spot) =>
      course.spotIds.includes(spot.id)
    ).length;
    
    if (overlap === 0) continue;
    
    // Calculate two metrics:
    // 1. What % of our selected spots are on this course?
    const coverageRatio = overlap / selectedSpots.length;
    // 2. What % of this course's spots are in our selection? (efficiency - prefer smaller, focused courses)
    const efficiencyRatio = overlap / course.spotIds.length;
    
    // Combined score: prioritize coverage but also value efficiency
    // This prevents always picking the longest course (Course A)
    const score = (coverageRatio * 0.6) + (efficiencyRatio * 0.4);
    
    if (score > bestScore) {
      bestScore = score;
      bestCourse = course;
    }
  }

  return {
    spots: selectedSpots,
    recommendedCourse: bestCourse,
    estimatedDuration: totalTravelTime + totalActivityTime,
    totalTravelTime: Math.round(totalTravelTime),
    totalActivityTime: Math.round(totalActivityTime),
    totalDistance: Math.round(totalDistanceCovered * 10) / 10,
  };
}

// Legacy trip planning function (kept for backward compatibility)
export function planTrip(interests: Interest[], duration: TripDuration): TripPlan {
  // Convert to advanced preferences
  const prefs: TripPreferences = {
    totalTimeHours: duration === "half-day" ? 4 : 8,
    categoryTimes: {
      gourmet: 60,
      activity: 90,
      tourism: 45,
      hotspring: 120,
    },
    maxDistanceKm: 15,
    selectedCategories: interests,
  };
  
  return planTripAdvanced(prefs);
}
