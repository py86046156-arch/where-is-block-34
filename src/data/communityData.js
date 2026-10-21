/**
 * Campus Connect — Community Data & Local Storage Service
 * 
 * BACKEND INTEGRATION BOUNDARY NOTICE:
 * This module provides prototype client-side storage via localStorage
 * to demonstrate community feeds, location-aware posts, comments, and upvotes.
 * A production backend will replace this with a REST/GraphQL service
 * (e.g., PostgreSQL + Express or Firebase Cloud Firestore).
 */

export const INITIAL_POSTS = [
  {
    id: "post-1",
    title: "Blue Water Bottle left in Block 34 Room 205 (Seminar Hall)",
    body: "Found a navy blue Milton insulated water bottle on the second row during today's CSE guest lecture. I deposited it with the ground-floor security reception desk in Block 34.",
    category: "Lost & Found",
    author: "Prince Yadav",
    authorRole: "Student • B.Tech CSE '27",
    authorAvatar: "AS",
    locationId: "block-34",
    locationName: "Block 34 (School of CSE)",
    upvotes: 14,
    hasUpvoted: false,
    timestamp: "2 hours ago",
    createdAt: Date.now() - 2 * 3600 * 1000,
    comments: [
      {
        id: "c-1",
        author: "Security Desk B34",
        authorRole: "Staff • Campus Security",
        content: "Confirmed, safely logged in the lost item register at Reception.",
        timestamp: "1 hour ago",
      }
    ]
  },
  {
    id: "post-2",
    title: "Best shaded route from Gate 1 to Block 34 during afternoon heat",
    body: "Pro tip for summer semester: Don't walk along the direct open highway boulevard! Instead, turn left towards Block 13, cut through the shaded colonnade behind the Central Library (Block 28), and enter Block 34 via the covered air-bridge. You stay 80% shaded!",
    category: "Campus Tip",
    author: "Priya Patel",
    authorRole: "Student • M.Tech AI",
    authorAvatar: "PP",
    locationId: "block-34",
    locationName: "Block 34 (School of CSE)",
    upvotes: 38,
    hasUpvoted: false,
    timestamp: "5 hours ago",
    createdAt: Date.now() - 5 * 3600 * 1000,
    comments: [
      {
        id: "c-2",
        author: "Karan Johal",
        authorRole: "Student • CSE",
        content: "Tested this route today, can confirm it saves you from direct sunlight!",
        timestamp: "3 hours ago",
      }
    ]
  },
  {
    id: "post-3",
    title: "Where do we submit the Mid-Term hardcopy assignment for CSE-316?",
    body: "Does anyone know if Dr. Verma's cabin is on the 3rd floor or 4th floor in Block 34? The departmental notice board mentions Room 34-301.",
    category: "Question",
    author: "Rohan Gupta",
    authorRole: "Student • Section K21",
    authorAvatar: "RG",
    locationId: "block-34",
    locationName: "Block 34 (School of CSE)",
    upvotes: 9,
    hasUpvoted: false,
    timestamp: "Yesterday",
    createdAt: Date.now() - 24 * 3600 * 1000,
    comments: [
      {
        id: "c-3",
        author: "Sneha Roy",
        authorRole: "Teaching Assistant",
        content: "It's Room 34-301, right next to the Dean's corridor on Floor 3. Office hours are 2 PM to 4 PM.",
        timestamp: "Yesterday",
      }
    ]
  },
  {
    id: "post-4",
    title: "Central Library Silent Study Pods open 24/7 for Exam Week",
    body: "Heads up everyone: Ground floor digital carrels in Block 28 are open 24 hours this week for mid-terms. Remember your university RFID card for turnstile access.",
    category: "Campus Tip",
    author: "Ananya Sen",
    authorRole: "Student Council Academic Rep",
    authorAvatar: "AS",
    locationId: "block-28",
    locationName: "Block 28 (Central Library)",
    upvotes: 27,
    hasUpvoted: false,
    timestamp: "1 day ago",
    createdAt: Date.now() - 28 * 3600 * 1000,
    comments: []
  },
  {
    id: "post-5",
    title: "Found motorcycle keys with red Honda lanyard near Gate 1",
    body: "Found near the e-rickshaw stand outside Gate 1. Handed over to the Gate 1 Main Security post. Please claim with proof of vehicle registration.",
    category: "Lost & Found",
    author: "Vikramaditya",
    authorRole: "Staff • Gate 1 Security",
    authorAvatar: "VK",
    locationId: "gate-1",
    locationName: "Gate 1 (Main GT Road)",
    upvotes: 19,
    hasUpvoted: false,
    timestamp: "2 days ago",
    createdAt: Date.now() - 48 * 3600 * 1000,
    comments: []
  },
  {
    id: "post-6",
    title: "Robotics Showcase & Hackathon registration now open at Unipolis",
    body: "Inter-college hardware prototypes will be demonstrated this Friday at Baldev Raj Mittal Unipolis. Live registration counters are open outside UniMall.",
    category: "Event",
    author: "Robotics Club Lead",
    authorRole: "Student Organizer",
    authorAvatar: "RC",
    locationId: "landmark-unipolis",
    locationName: "Unipolis Amphitheater",
    upvotes: 42,
    hasUpvoted: false,
    timestamp: "3 days ago",
    createdAt: Date.now() - 72 * 3600 * 1000,
    comments: []
  }
];

const STORAGE_KEY = 'campus_navigator_community_posts';

export function loadCommunityPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load community posts from localStorage:", e);
  }
  return INITIAL_POSTS;
}

export function saveCommunityPosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Failed to save community posts to localStorage:", e);
  }
}
