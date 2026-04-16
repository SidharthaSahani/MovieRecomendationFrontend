// /**
//  * Content-Based Filtering Recommendation Algorithm
//  * Analyzes movie attributes to find similar movies
//  * 
//  * --- SIMPLE EXPLANATION ---
//  * This is like a "Movie Matchmaker"! 
//  * If you tell it you like "Toy Story", it looks at all other movies and asks:
//  * 1. Is it a cartoon too? (Genre)
//  * 2. Was it made by the same people? (Director)
//  * 3. Does it have the same toys? (Cast)
//  * The more "YES" answers it gets, the higher the movie's score!
//  */

// // Weights for different attributes (total = 1.0)
// // Think of these like "Importance Points". 
// // Cast is now the most important factor to ensure movies with shared actors rank higher.
// const WEIGHTS = {
//   genre: 0.25,        // Type of movie
//   language: 0.10,     // Language match
//   rating: 0.05,       // Similar quality
//   director: 0.15,     // Who made it
//   cast: 0.30,         // Cast overlap (Boosted from 0.10 to 0.30)
//   releaseYear: 0.05,  // Year proximity
//   description: 0.10,  // Story similarity
// };

// /**
//  * Calculate Jaccard Similarity for arrays (cast, genres, etc.)
//  * Measures overlap between two sets
//  * 
//  * --- HOW IT WORKS ---
//  * Imagine two boxes of LEGOs. 
//  * We count how many pieces are EXACTLY the same in both boxes.
//  * Then we divide by the total number of pieces in both boxes together.
//  * If 100% of pieces match, the score is 1. If 0% match, the score is 0.
//  */
// function jaccardSimilarity(arr1, arr2) {
//   if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;
  
//   const set1 = new Set(arr1.map(item => item.toLowerCase().trim()));
//   const set2 = new Set(arr2.map(item => item.toLowerCase().trim()));
  
//   // Find things that are in BOTH lists (The "Intersection")
//   const intersection = new Set([...set1].filter(x => set2.has(x)));
//   // Put both lists together into one big list (The "Union")
//   const union = new Set([...set1, ...set2]);
  
//   // Final Score = Shared items / All items
//   return intersection.size / union.size;
// }

// /**
//  * Calculate similarity score for genre
//  * 
//  * --- DATA TALK ---
//  * It looks at the "genre" property of two movies.
//  * If both say "Action", they are a perfect match!
//  */
// function genreSimilarity(movie1, movie2) {
//   // Define strict genre mapping (each genre only matches itself)
//   const relatedGenres = {
//     'Action': 'Action',
//     'Adventure': 'Adventure',
//     'Comedy': 'Comedy',
//     'Drama': 'Drama',
//     'Horror': 'Horror',
//     'Sci-Fi': 'Sci-Fi',
//     'Fantasy': 'Fantasy',
//     'Romance': 'Romance',
//     'Thriller': 'Thriller',
//     'Mystery': 'Mystery',
//     'Crime': 'Crime',
//   };
  
//   // If they are exactly the same type, they get a perfect score (1.0)!
//   if (movie1.genre === movie2.genre && relatedGenres[movie1.genre] === movie2.genre) {
//     return 1.0;
//   }
  
//   return 0;
// }

// /**
//  * Calculate similarity score for description
//  * Uses Jaccard similarity on significant words
//  * 
//  * --- DATA TALK ---
//  * It looks at the "description" text of both movies.
//  * It removes simple words (like "the", "and") and punctuation.
//  * Then it checks how many important words match in both stories!
//  */
// function descriptionSimilarity(movie1, movie2) {
//   if (!movie1.description || !movie2.description) return 0;
  
//   // Clean description and split into words
//   const cleanWords = (text) => 
//     text.toLowerCase()
//       .replace(/[^\w\s]/g, '') // remove punctuation
//       .split(/\s+/)            // split by space
//       .filter(word => word.length > 3); // only keep longer words
  
//   const words1 = cleanWords(movie1.description);
//   const words2 = cleanWords(movie2.description);
  
//   return jaccardSimilarity(words1, words2);
// }

// /**
//  * Calculate similarity score for language
//  * 
//  * --- DATA TALK ---
//  * It compares the "language" property.
//  * If both movies are in the same language, they get a perfect score!
//  */
// function languageSimilarity(movie1, movie2) {
//   if (!movie1.language || !movie2.language) return 0;
  
//   const lang1 = movie1.language.toLowerCase().trim();
//   const lang2 = movie2.language.toLowerCase().trim();
  
//   if (lang1 === lang2) return 1.0;
  
//   return 0;
// }

// /**
//  * Calculate similarity score for director
//  * 
//  * --- DATA TALK ---
//  * It compares the "director" names.
//  * If the names are identical, it's a 1.0. 
//  * If only the last names match (like family members), it's a small 0.3.
//  */
// function directorSimilarity(movie1, movie2) {
//   if (!movie1.director || !movie2.director) return 0;
  
//   const director1 = movie1.director.toLowerCase().trim();
//   const director2 = movie2.director.toLowerCase().trim();
  
//   // Exact match: Same person!
//   if (director1 === director2) return 1.0;
  
//   // Partial match: Maybe they have the same last name?
//   const lastName1 = director1.split(' ').pop();
//   const lastName2 = director2.split(' ').pop();
//   if (lastName1 === lastName2) return 0.3;
  
//   return 0;
// }

// /**
//  * Calculate similarity score for release year
//  * 
//  * --- DATA TALK ---
//  * It subtracts one year from the other. 
//  * If the difference is 0, they are from the same time!
//  */
// function yearSimilarity(movie1, movie2) {
//   if (!movie1.releaseYear || !movie2.releaseYear) return 0;
  
//   const yearDiff = Math.abs(movie1.releaseYear - movie2.releaseYear);
  
//   // Same year = 1.0 (Perfect)
//   // Within 2 years = 0.8 (Very Close)
//   // Within 5 years = 0.6 (Close)
//   // Within 10 years = 0.4 (Same decade)
//   // Within 20 years = 0.2 (Same era)
//   // More than 20 years = 0 (Different times)
  
//   if (yearDiff === 0) return 1.0;
//   if (yearDiff <= 2) return 0.8;
//   if (yearDiff <= 5) return 0.6;
//   if (yearDiff <= 10) return 0.4;
//   if (yearDiff <= 20) return 0.2;
//   return 0;
// }

// /**
//  * Calculate similarity score for rating
//  * 
//  * --- DATA TALK ---
//  * It looks at the "rating" number (like 8.5 vs 8.2).
//  * If the numbers are close, the movies are likely of the same "quality".
//  */
// function ratingSimilarity(movie1, movie2) {
//   if (!movie1.rating || !movie2.rating) return 0;
  
//   const ratingDiff = Math.abs(movie1.rating - movie2.rating);
  
//   // Same rating = 1.0
//   // Within 0.5 = 0.9
//   // Within 1.0 = 0.7
//   // Within 2.0 = 0.5
//   // Within 3.0 = 0.3
//   // More than 3.0 = 0
  
//   if (ratingDiff === 0) return 1.0;
//   if (ratingDiff <= 0.5) return 0.9;
//   if (ratingDiff <= 1.0) return 0.7;
//   if (ratingDiff <= 2.0) return 0.5;
//   if (ratingDiff <= 3.0) return 0.3;
//   return 0;
// }

// /**
//  * Calculate similarity score for cast
//  * Uses Jaccard similarity to measure actor overlap
//  * 
//  * --- DATA TALK ---
//  * It takes a list of actors (separated by commas) and turns them into arrays.
//  * Then it uses the "LEGO box rule" (Jaccard) to see how many actors are in both.
//  */
// function castSimilarity(movie1, movie2) {
//   if (!movie1.cast || !movie2.cast) return 0;
  
//   const cast1 = movie1.cast.split(',').map(s => s.trim().toLowerCase());
//   const cast2 = movie2.cast.split(',').map(s => s.trim().toLowerCase());
  
//   const set1 = new Set(cast1);
//   const set2 = new Set(cast2);
  
//   const intersection = new Set([...set1].filter(x => set2.has(x)));
  
//   // Use overlap coefficient instead of Jaccard for cast
//   // This is more generous for shared actors
//   return intersection.size / Math.min(set1.size, set2.size);
// }

// /**
//  * Calculate overall similarity score between two movies
//  * Returns a score between 0 and 1
//  * 
//  * --- THE MATH ENGINE ---
//  * This function takes ALL the small scores (genre, director, year, etc.)
//  * and multiplies them by our "Importance Points" (Weights).
//  * It adds them all up to get one FINAL similarity score.
//  */
// export function calculateSimilarity(targetMovie, candidateMovie) {
//   // Don't compare a movie with itself!
//   if (targetMovie._id === candidateMovie._id) return 0;
  
//   const genreScore = genreSimilarity(targetMovie, candidateMovie);
//   const languageScore = languageSimilarity(targetMovie, candidateMovie);
//   const directorScore = directorSimilarity(targetMovie, candidateMovie);
//   const yearScore = yearSimilarity(targetMovie, candidateMovie);
//   const ratingScore = ratingSimilarity(targetMovie, candidateMovie);
//   const castScore = castSimilarity(targetMovie, candidateMovie);
//   const descriptionScore = descriptionSimilarity(targetMovie, candidateMovie);
  
//   // Total Score = (Score * Weight) + (Score * Weight) ...
//   const totalScore = 
//     (genreScore * WEIGHTS.genre) +
//     (languageScore * WEIGHTS.language) +
//     (directorScore * WEIGHTS.director) +
//     (yearScore * WEIGHTS.releaseYear) +
//     (ratingScore * WEIGHTS.rating) +
//     (castScore * WEIGHTS.cast) +
//     (descriptionScore * WEIGHTS.description);
  
//   return totalScore;
// }

// /**
//  * Get movie recommendations based on content similarity
//  * 
//  * --- THE FILTERING MACHINE ---
//  * 1. It looks at ALL movies in your database.
//  * 2. It throws away the movie you just clicked.
//  * 3. It only keeps movies of the SAME genre (like your sir said!).
//  * 4. It calculates a "Match Score" for every movie left.
//  * 5. It sorts them from highest score to lowest.
//  * 6. It gives you the top 6 best matches!
//  */
// export function getRecommendations(targetMovie, allMovies, limit = 6) {
//   // Calculate similarity scores for all movies
//   const moviesWithScores = allMovies
//     // Step 1: Filter - Remove the movie you just clicked (No hard genre filter!)
//     .filter(movie => movie._id !== targetMovie._id) 
//     .map(movie => ({
//       ...movie,
//       // Step 2: Calculate Similarity Score
//       similarityScore: calculateSimilarity(targetMovie, movie),
//       // Step 3: Keep individual scores for the "Reason" explanation
//       scores: {
//         genre: genreSimilarity(targetMovie, movie),
//         language: languageSimilarity(targetMovie, movie),
//         director: directorSimilarity(targetMovie, movie),
//         year: yearSimilarity(targetMovie, movie),
//         rating: ratingSimilarity(targetMovie, movie),
//         cast: castSimilarity(targetMovie, movie),
//         description: descriptionSimilarity(targetMovie, movie),
//       }
//     }))
//     // Step 4: Only keep movies that have some similarity
//     .filter(movie => movie.similarityScore > 0) 
//     // Step 5: Sort by score (Best matches first)
//     .sort((a, b) => b.similarityScore - a.similarityScore); 
  
//   // Step 6: Return the top results
//   return moviesWithScores.slice(0, limit);
// }

// /**
//  * Get explanation for why a movie was recommended
//  * 
//  * --- THE TRANSLATOR ---
//  * This takes the computer's numbers and turns them into human words.
//  * Instead of "GenreScore 1.0", it says "because it's the same genre!".
//  */
// export function getRecommendationReason(scores) {
//   const reasons = [];
  
//   if (scores.genre > 0.9) reasons.push('same genre');
//   else if (scores.genre > 0.4) reasons.push('similar genre');
  
//   if (scores.language > 0.9) reasons.push('same language');
  
//   if (scores.director > 0.9) reasons.push('same director');
//   else if (scores.director > 0.1) reasons.push('similar director');
  
//   if (scores.year > 0.7) reasons.push('from the same era');
  
//   if (scores.rating > 0.7) reasons.push('similar rating');
  
//   if (scores.cast > 0.1) reasons.push('shared cast members');
  
//   if (scores.description > 0.3) reasons.push('similar story elements');
  
//   // Combine all reasons into a nice sentence
//   if (reasons.length === 0) return 'similar characteristics';
//   if (reasons.length === 1) return reasons[0];
//   if (reasons.length === 2) return `${reasons[0]} and ${reasons[1]}`;
  
//   return `${reasons.slice(0, -1).join(', ')}, and ${reasons[reasons.length - 1]}`;
// }

// export default {
//   calculateSimilarity,
//   getRecommendations,
//   getRecommendationReason,
//   WEIGHTS
// };