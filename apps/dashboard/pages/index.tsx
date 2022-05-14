import { useEffect } from 'react';
import { useCreateDashboardUserMutation } from '../graphql/generated';

export function Index() {
  const [createUser, { data, error, loading }] =
    useCreateDashboardUserMutation();
  console.log('data', { data, error, loading });

  useEffect(() => {
    createUser({
      variables: {
        input: {
          username: 'testUserA',
          password: '1234',
        },
      },
    });
  }, []);

  return <div>asdasdasd</div>;
}

export default Index;
