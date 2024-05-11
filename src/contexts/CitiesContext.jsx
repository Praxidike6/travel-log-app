import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  getCities,
  createCity as createNewCity,
  getCityById,
  deleteCity as deleteCityById,
} from "../services/apiCities";


const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      console.log("cityLoaded data=", action.payload);
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );



  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const data = await getCities();
        console.log("after getCities =", data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      console.log("getCity id=", id);
      console.log("getCity currentCityId",currentCity.id);
      if (Number(id) === currentCity.id) { return};
      dispatch({ type: "loading" });
      try {
        const data = await getCityById(id);
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error getting the city.",
        });
      }
    },
    [currentCity.id]
  );

  

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      console.log("createCity before data=", newCity);
      const data = await createNewCity(newCity);
     
      console.log("after createCity =", data);
      // add the new city to the city state to get rendered
      dispatch({ type: "city/created", payload: data});
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await deleteCityById(id);

      // add the new city to the city state to get rendered
      dispatch({ type: "city/deleted", payload: id });
      //setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting  city",
      });
    }
  }


  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };

/*const BASE_URL = "http://localhost:8000";*/
  /* useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities",
        });
      }
    }
    fetchCities();
  }, []); */
    /* async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // add the new city to the city state to get rendered
      dispatch({ type: "city/deleted", payload: id });
      //setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting  city",
      });
    }
  } */
  /*  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error getting the city.",
        });
      }
    },
    [currentCity.id]
  ); */

  /* async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // add the new city to the city state to get rendered
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      });
    }
  } */
