export function pagination(number: any, take: number) {
  let skip: number;
  if (!number || isNaN(Number(number)) || number < 0) {
    return (skip = 0);
  } else {
    return (skip = Number(number) * take);
  }
}

export function isNextPage(page: number, count: number, take: number) {
  let isNextPage = true;
  if ((Number(page) + 1) * take >= count) {
    isNextPage = false;
  } else {
    isNextPage = true;
  }
  return isNextPage;
}
