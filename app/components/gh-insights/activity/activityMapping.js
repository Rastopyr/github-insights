
import assign from "lodash/assign";
import flow from "lodash/fp/flow";
import reduce from "lodash/fp/reduce";

export default {
  push(group) {
    if (group.type !== "push") {
      return group;
    }

    return flow(
      reduce(
        (acc, event) => {
          if (acc.repos[event.repo.id]) {
            const repo = acc.repos[event.repo.id];

            repo.commit_count++;
          } else {
            acc.repos[event.repo.id] = assign(event.repo, {
              commit_count: 1
            });

            acc.repo_count++;
          }

          acc.commit_count++;

          return acc;
        },
        assign(group, {
          commit_count: 0,
          repo_count: 0,
          repos: {}
        })
      )
    )(group.events);
  },

  pullrequest(group) {
    if (group.type !== "pullrequest") {
      return group;
    }

    return flow(
      reduce(
        (acc, event) => {
          if (acc.repos[event.repo.id]) {
            const repo = acc.repos[event.repo.id];

            repo.pr_count++;
          } else {
            acc.repos[event.repo.id] = assign(event.repo, {
              commit_count: 1
            });

            acc.repo_count++;
          }

          acc.pr_count++;

          return acc;
        },
        assign(group, {
          pr_count: 0,
          repo_count: 0,
          repos: {}
        })
      )
    )(group.events);
  }
};
