import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-builder-875ef.firebaseio.com/",
});

export default instance;
