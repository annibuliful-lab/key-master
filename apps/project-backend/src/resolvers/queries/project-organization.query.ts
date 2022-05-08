import { keyBy } from 'lodash';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectOrganizationById: (_parent, { id }, ctx) => {
    return ctx.projectOrganization.findById(id);
  },
  getProjectOrganizations: (_parent, { filter }, ctx) => {
    return ctx.projectOrganization.findManyByFilter(filter);
  },
  _projectOrganizationKeyManagement: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.projectOrganizationId);

    const organizations = await ctx.projectOrganization.findByIds(ids);

    const groupedProjectOrganizations = keyBy(organizations, (org) => org.id);

    return ids.map((id) => {
      const projectOrganization = groupedProjectOrganizations[id];

      return {
        projectOrganizationId: id,
        projectOrganization,
      };
    });
  },
};
