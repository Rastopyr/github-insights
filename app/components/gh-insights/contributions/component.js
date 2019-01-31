import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, observer } from "@ember/object";
import { task } from "ember-concurrency";

import moment from 'moment';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';

export default Component.extend({
  store: service(),
  session: service(),

  repos: computed(() => []),

  performGetActivity: observer('currentUser', function() {
    this.getActivity.perform();
  }),

  getRepos: task(function*() {
    const { store, session } = this;
    const { currentUser: user } = session;

    if (!user) {
      return;
    }

    const repos = yield store.query("github-repository", {
      user: user.login,
      type: 'all',
      sort: 'created',
      // TODO: add pagination or custom API call
      per_page: 100
    });

    this.set('repos', repos);
  })
    .on("didInsertElement")
    .drop(),

  getStats: task(function*() {
    const { store, session, selectedRepo } = this;
    const { currentUser: user } = session;

    if (!selectedRepo) {
      return;
    }

    const stats = yield store.query("github-repo-stat-contributor", {
      user: user.login,
      repo: selectedRepo.name,
    });

    this.set('repoStats', stats.toArray());
  })
    .drop(),

  selectRepo(repo) {
    this.setProperties({
      selectedRepo: repo,
      repoStats: null
    });

    this.getStats.perform();
  },

  chartData: computed('repoStats.[]', function() {
    const { repoStats } = this;

    const data = repoStats.map(({ author, weeks }) => ({
      name: author.login,
      data: flow(
        map(({ w, c }) => [moment(w * 1000), c]),
        groupBy(
          ([mdate]) => mdate.format('W')
        ),
        groups =>
          Object.keys(groups).reduce(
            (acc, week) => [...acc, { week, weeks: groups[week] }],
            []
          ),
        reduce((acc, group) => {
          return [...acc, [
            moment(group.week, 'W').toDate(),
            group.weeks.reduce((acc, [, value]) => value + acc, 0)
          ]];
        }, []),
      )(weeks)
    }));

    return data;
  }),

  chartOptions: computed('selectedRepo', function() {
    return {
      title: {
        text: `Contributors of ${this.selectedRepo.fullName}`
      },

      chart: {
        type: 'column'
      },

      yAxis: {
        allowDecimals: false,
        title: {
          text: 'Contributions'
        }
      },

      xAxis: {
        labels: {
          type: 'datetime',
          y: 30,
          formatter() {
            return moment(this.value + 1, 'W').format('Do MMM');
          }
        }
      },

      tooltip: {
        shared: true,
        formatter() {
          const s = '<b>' + moment(this.x, 'W').format('Do MMM') + '</b><br />';
          const data = this.points
            .filter((p) => p.y > 0)
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(p => `<span style="color: ${p.color}">${
              p.series.name
            }</span>: ${p.y}`)
            .join('<br />');

          return `${s} ${data}`;
        }
      }
    };
  })
});
