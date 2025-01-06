export interface UserSearchQuery {
  minAge?: number;
  maxAge?: number;
  distance?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  minFameRating?: number;
  maxFameRating?: number;
  sortBy?: "distance" | "age" | "fameRating";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
