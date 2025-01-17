import { SortUser, User, Tag, Order } from "@/app/interfaces";

const calculateCommonTags = (
  currentUserTags: Tag[],
  usersToUpdate: SortUser[]
): SortUser[] => {
  usersToUpdate.forEach((user) => {
    let tagsScore = 0;
    if (!user.tags || !Array.isArray(user.tags) || user.tags.length === 0) {
      user.commonTags = 0;
      return;
    }
    currentUserTags.forEach((tag) => {
      if (tag && user.tags?.some((userTag) => userTag && userTag === tag)) {
        tagsScore++;
      }
    });
    user.commonTags = tagsScore;
  });
  return usersToUpdate;
};

export const sortUsersByCommonTags = (
  users: User[],
  commonTagsOrder: Order,
  currentUserTags: Tag[]
): SortUser[] => {
  let sortedUsers: SortUser[] = users;
  if (!currentUserTags || currentUserTags.length === 0) {
    return sortedUsers;
  }

  // Make a score for each user based on common tags
  sortedUsers = calculateCommonTags(currentUserTags, sortedUsers);

  // Sort users by score
  if (commonTagsOrder === Order.asc) {
    sortedUsers.sort((a, b) => (a.commonTags ?? 0) - (b.commonTags ?? 0));
  } else {
    sortedUsers.sort((a, b) => (b.commonTags ?? 0) - (a.commonTags ?? 0));
  }
  return sortedUsers;
};

const criteriaWeights = {
  age: 0.1,
  fameRate: 0.2,
  distance: 0.3,
  tags: 0.4,
};

const calculateUserScore = (user: SortUser, currentUser: User): number => {
  let score = 0;
  if (user.age && currentUser.age) {
    score += criteriaWeights.age * Math.abs(user.age - currentUser.age);
  }
  if (user.fameRate && currentUser.fameRate) {
    score +=
      criteriaWeights.fameRate * Math.abs(user.fameRate - currentUser.fameRate);
  }
  if (user.distance) {
    score += criteriaWeights.distance * user.distance;
  }
  if (user.commonTags) {
    score += criteriaWeights.tags * user.commonTags;
  }
  return score;
};

export const sortWeightedUsers = (
  currentUser: User,
  users: SortUser[]
): SortUser[] => {
  let sortedUsers: SortUser[] = users;
  sortedUsers = calculateCommonTags(currentUser.tags, sortedUsers);
  sortedUsers.forEach((user) => {
    user.totalScore = calculateUserScore(user, currentUser);
  });
  sortedUsers.sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));
  return sortedUsers;
};
