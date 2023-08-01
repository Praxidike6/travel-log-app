import supabase from "./superbase";

export async function getCities() {
  const { data: cities, error } = await supabase.from("cities").select("*");

  if (error) {
    console.error(error);
    throw new Error("error retrieving data from cabins table");
  }
  console.log("apiCities call=", cities);
  return cities;
}

export async function createCity(newCity) {
  const { data, error } = await supabase
    .from("cities")
    .insert([newCity])
    .select();
  if (error) {
    console.error(error);
    throw new Error("City could not be created");
  }
  return data[0];
}

export async function getCityById(id) {
  console.log("getCity id=", id);
  const { data: cities, error } = await supabase
    .from("cities")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("City could not be found");
  }
  console.log("getCity city data=", cities);
  return cities[0];
}

export async function deleteCity(id) {
  const { error } = await supabase.from("cities").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("City could not be deleted");
  }
}
