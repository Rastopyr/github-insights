import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { computed, observer } from "@ember/object";
import { alias } from "@ember/object/computed";
import { task } from "ember-concurrency";

import assign from "lodash/assign";
import flow from "lodash/fp/flow";
import reduce from "lodash/fp/reduce";
import map from "lodash/fp/map";
import groupBy from "lodash/fp/groupBy";

import ActivityMapping from './activityMapping';


export default Component.extend({
  store: service(),
  session: service(),

  currentUser: alias('session.currentUser'),

  activities: computed(() => []),

  performGetActivity: observer('currentUser', function() {
    this.getActivity.perform();
  }),

  getActivity: task(function*() {
    const { store, currentUser: user } = this;

    if (!user) {
      return;
    }

    const activities = yield store.query("github-activity", {
      user: user.login
    });

    this.set("activities", activities.toArray());
  })
    .on("didInsertElement")
    .drop(),

  /*
    WARN: Not optimal mechanism. We can't query by dates and types from backend
   */
  groupedActivites: computed("activities.[]", function() {
    const { activities = [] } = this;

    const groups = flow(
      map(event =>
        assign(event, {
          flatType: event.type.replace("Event", "").toLowerCase()
        })
      ),
      groupBy(({ flatType }) => flatType),
      groups =>
        Object.keys(groups).reduce(
          (acc, name) => [...acc, { type: name, events: groups[name] }],
          []
        ),
      map(flow(...Object.values(ActivityMapping))),
      reduce((acc, group) => assign(acc, { [group.type]: group }),{})
    )(activities);

    return groups;
  })
});
