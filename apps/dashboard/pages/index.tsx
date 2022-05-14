import { Grid, Tabs } from '@geist-ui/react';
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
    <Grid.Container mt={4} gap={2} justify="center" width="80vw">
      <Tabs initialValue="1" hideDivider>
        <Tabs.Item label="http" value="1">
          HTTP is stateless, but not sessionless.
        </Tabs.Item>
        <Tabs.Item label="proxies" value="2">
          Between the Web browser and the server, numerous computers and
          machines relay the HTTP messages.
        </Tabs.Item>
      </Tabs>
    </Grid.Container>
  );
}

export default Index;
