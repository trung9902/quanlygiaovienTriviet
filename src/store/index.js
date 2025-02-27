// store/index.js
import { createStore } from "vuex";
import auth from "./modules/auth";
import users from "./modules/users";
import general from "./modules/general";
import News from "./modules/News";
import topic from "./modules/topic";
import createPersistedState from "vuex-persistedstate";
import comment from "./modules/comment";

export default createStore({
  modules: {
    auth,
    users,
    general,
    News,
    topic,
    comment,
  },
  plugins: [createPersistedState()],
});
