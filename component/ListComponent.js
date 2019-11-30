import React, { useEffect, useState } from "react";
import { AsyncStorage, ScrollView, Text, RefreshControl,StyleSheet, FlatList, Button, Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { fetchUpdateAsync, clearUpdateCacheExperimentalAsync } from "expo/build/Updates/Updates";

export const API_URL =  "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&facet=overflowactivation&facet=creditcard&facet=kioskstate&facet=station_state";
  

export const getVelibStation = async ( url, networkPriority = false) => {
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

const styles = StyleSheet.create({
    row: {
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
    backgroundColor: '#2E9298',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 10,
    }
  });

getListViewItem = (item) =>{
    console.log(item)
    Alert.alert(
        item.station_name,  
        'My Alert Msg', 
    );
};

const List = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const netInfo = useNetInfo();
  const fetchData = networkPriority => {
    setLoading(true);
    getVelibStation(API_URL, networkPriority).then(data => {
      setData(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    fetchData(true);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => fetchUpdateAsync(true)}
        />
      }
    >
      {!data && <Text>Chargement ...</Text>}
      {data && (
        <>
        <ScrollView >
        <FlatList
          style={{ flex: 0, padding: 5 }}
          data={data.data.records}
          renderItem={({item}) => <Text style={styles.row} onPress={getListViewItem.bind(item.fields)}>{item.fields.station_name}</Text>}
        />
        </ScrollView>
      </>
      )}
    </ScrollView>
  );
};

export default List;