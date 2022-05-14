import { Grid } from '@geist-ui/react';
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

  return (
    <Grid.Container gap={2} justify="center" height="100px">
      <Grid>Test</Grid>
      <Grid>Test</Grid>
    </Grid.Container>
  );
}

export default Index;
