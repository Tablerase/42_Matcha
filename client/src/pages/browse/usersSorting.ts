import { SortUser, User, Tag, Order } from "@/app/interfaces";

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
  sortedUsers.forEach((user) => {
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

  // Sort users by score
  if (commonTagsOrder === Order.asc) {
    sortedUsers.sort((a, b) => (a.commonTags ?? 0) - (b.commonTags ?? 0));
  } else {
    sortedUsers.sort((a, b) => (b.commonTags ?? 0) - (a.commonTags ?? 0));
  }
  return sortedUsers;
};
