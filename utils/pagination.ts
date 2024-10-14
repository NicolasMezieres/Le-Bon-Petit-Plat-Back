export function pagination(number: any, take: number) {
  let skip: number;
  if (!number || isNaN(Number(number))) {
    return (skip = 0);
  } else {
    return (skip = Number(number) * take);
  }
}
