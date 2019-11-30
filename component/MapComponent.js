import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  AsyncStorage,
  StyleSheet,
  StatusBar, 
  Dimensions,
  View,
} from "react-native";
import MapView from "react-native-maps";

export const DISTANCE = 5000;
export const API_URL =  "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&facet=overflowactivation&facet=creditcard&facet=kioskstate&facet=station_state";
  

const styles = StyleSheet.create({
  map: {
    height: 800,
    width: Dimensions.get("window").width,
  },
  mapMarker: {
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
    backgroundColor: '#2E9298',
    borderRadius: 10,
    padding: 10,
  }
});

const Map = () => {

   const [data, setData] = useState(null);
   const fetchData = () => {
     getVelibLocationMe().then(data => {
       setData(data);
     });
   };
 
   useEffect(() => {
     fetchData();
     fetchData(true);
   }, []);
   
   console.log(data && data.data);
     return (  
       <ScrollView contentContainerStyle={styles.container}>
        {data && (
 
        <>
       <StatusBar hidden={true} />
       <MapView
         style={styles.map}
         showsUserLocation={true}
         region={{
           latitude: data && data.data.records[0].geometry.coordinates[1],
           longitude: data && data.data.records[0].geometry.coordinates[0],
           latitudeDelta: 0.005,
           longitudeDelta: 0.005,
         }}
       >
 
         {data.data.records.map((prop, key) => {
          return (
           <MapView.Marker
           coordinate={{
             latitude: prop.fields.geo[0],
             longitude: prop.fields.geo[1],
           }}
           title={prop.fields.station_name}
         >
           <View style={styles.mapMarker}>
             <Text style={{ fontSize: 20, textAlign: "center", color:'white' }}>Station</Text>
             <Text
               style={[
                 styles.rowAvailability,
                 {
                   color: prop.fields.nbbike > 0 ? "white" : "red",
                 },
               ]}
             >
             {prop.fields.nbbike}/{prop.fields.nbedock}
             </Text>
           </View>
         </MapView.Marker>
          );
       })}
         
 
       </MapView>
       </>
       )}
     </ScrollView>
    
   );
 }
 
 
 
 const getPosition = async() => {
   return new Promise(function(resolve, reject) {
     navigator.geolocation.getCurrentPosition(
       position => {
         resolve(position)
       },
       error => {
         reject(error)
       },
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
     )
   })
 }
 
 const get = async ( url, networkPriority = false) => {
    const key = encodeURIComponent(url);
    const value = await AsyncStorage.getItem(key);
  
    try{
      if (value !== null && !networkPriority) {
        return { data: JSON.parse(value), from: "Cache"};
      } else {
        const response = await fetch (url);
        const json = await response.json();
        await AsyncStorage.setItem(key, JSON.stringify(json));
  
        return {data: json, from: "API"};
      }
    }catch (error) {
      return {
        data: JSON.parse(value),
        from: "Cache",
        error: error.message,
      };
    }
  }
 
 const getVelibLocationMe = async() => {
   const position = await getPosition();
   const requestUrl = API_URL + `&geofilter.distance=${position.coords.latitude},${position.coords.longitude},${DISTANCE}`
   return get(requestUrl)
 }
 
 export default Map;