export const tagsSorter = (a: any, b: any) => {
  const order = {
    root: '0',
    auth: '1',
    user: '2',
    company: '3',
    invitation: '4',
    ['join-request']: '5',
    quiz: '6',
    question: '7',
  };

  return order[a]?.localeCompare(order[b]);
};

export const operationsSorter = (a: any, b: any) => {
  const order = {
    get: '0',
    post: '1',
    patch: '2',
    put: '3',
    delete: '4',
  };

  return order[a.get('method')]?.localeCompare(order[b.get('method')]);
};
