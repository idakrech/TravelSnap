## TravelSnap App

TravelSnap is a mobile application developed using React Native with Expo, integrated with Firebase for backend services. The app provides users with a platform to explore and share travel experiences through photos and comments.

### Key Features:

- **Gallery of Travel Photos:** Users can view a collection of traveller photos retrieved from Firebase, presented in a gallery format, showcasing various travel experiences.
  
- **Photo Details:** Each travel photo is clickable, allowing users to access detailed information, including descriptions, locations, and dates.

- **Secure Photo Uploads:** Users can upload their travel photos securely from their camera or existing gallery. They can add captions before storing the photos in Firebase.

- **Interactive Comments:** Users can leave comments on individual photo detail pages.

- **Seamless Navigation:** The app offers smooth navigation between different sections, such as photo overview, detailed view, and photo upload. In the Explore screen, users can navigate between tabs showcasing all uploaded photos, most recent photos or photos from user's current location.

- **Map View Integration:** The app incorporates a map view that displays the geographical locations where the photos were taken.

- **Cross-Platform Compatibility:** TravelSnap is accessible on both Android and iOS platforms as well as on web.

### Technologies Used:

- **React Native with Expo:** Frontend development framework for building native mobile apps using JavaScript and React.

- **Firebase Auth and Firestore:** Backend services for user authentication, data storage, and real-time synchronization.

- **Expo Location and React Native Maps:** Utilized for integrating location-based features and map functionalities within the app.

- **Tailwind CSS:** Employed for styling and UI design.
  
### Implementation Details:
You must register in Firebase and pass your own Firebase key in the Firebase.tsx file.
