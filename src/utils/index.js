import axios from 'axios'
export const getCurrentCity =()=>{
  const localCity = JSON.parse(localStorage.getItem("local_city"));
  if (!localCity) {
    return new Promise((reslove, reject) => {
      try {
        var myCity = new window.BMapGL.LocalCity();
        myCity.get(async (res) => {
          console.log(res);
          const result = await axios.get(
            "http://localhost:8080/area/info?name=" + res.name
          );

          localStorage.setItem("local_city", JSON.stringify(result.data.body));
          reslove(result.data.body)
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  return Promise.resolve(localCity)
};