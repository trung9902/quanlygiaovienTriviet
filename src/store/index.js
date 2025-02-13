// store/index.js
import { createStore } from "vuex";
import auth from "./modules/auth";
import users from "./modules/users";
import general from "./modules/general";
import News from "./modules/News";
import topic from "./modules/topic";

export default createStore({
  modules: {
    auth,
    users,
    general,
    News,
    topic,
  },
});
