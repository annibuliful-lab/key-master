import concurrently from 'concurrently';
const { result } = concurrently(['yarn:*-backend:dev'], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});

result.then(
  (success) => {
    console.log('success', success);
  },
  (failure) => {
    console.log('failure', failure);
  }
);
