export const tagsSorter = (a: any, b: any) => {
  const order = {
    root: '0',
    auth: '1',
    user: '2',
    company: '3',
    notification: '4',
    invitation: '5',
    ['join-request']: '6',
    quiz: '7',
    ['quiz-result']: '8',
    question: '9',
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
