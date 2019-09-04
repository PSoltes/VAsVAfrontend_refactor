import axios from "axios";
import objectToXWWW from "./objectToXWWW-FROM.js";
import AsyncStorage from "@react-native-community/async-storage";
import Config from "react-native-config";

var axiosInstance = axios.create();

/*axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.warn(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});*/

axiosInstance.interceptors.response.use(
  function(response) {
    return response;
  },
  async function(error) {
    const originalRequest = error.config;
    console.warn("Interceptor fired " + error);
    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      let refreshToken;
      try {
        refreshToken = await AsyncStorage.getItem("refresh_token");
      } catch (err) {
        logStuff("WARN", "Interceptor fired" + err.message.toString());
      }
      var details = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
      };
      formBody = objectToXWWW(details);
      return(axios
        .post(Config.BACKEND_URL + "/oauth/token", formBody, {
          auth: {
            username: "myClientPassword",
            password: "secret"
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(async (res) => {
            try {
              await AsyncStorage.setItem("access_token", res.data.access_token);
              await AsyncStorage.setItem("refresh_token", res.data.refresh_token);
            } catch (err) {
              logStuff("WARN","AsyncStorage Interceptor" +  err.message.toString());
            }
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.access_token;
            originalRequest.headers["Authorization"] =
              "Bearer " + res.data.access_token;
            return axios(originalRequest);
          }
        ));
    }
    else{return Promise.reject(error);}
  }
);

export default axiosInstance;
