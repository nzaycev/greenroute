import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import MapView, {Heatmap, Marker, Polyline} from 'react-native-maps';
import axios from 'axios';
import { TouchableHighlight } from 'react-native-gesture-handler';
import BottomSheet from 'reanimated-bottom-sheet';
import * as Location from 'expo-location';
// import { FontAwesomeIcon } from 'expo-fontawesome';

const SERVER_URI = 'https://greenway2.herokuapp.com'

// axios.get(SERVER_URI + '/api/points/').then(r => alert(JSON.stringify(r.data))).catch(_=>alert('failed'))

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const RenderContent = ({results, onSelectEndPoint}) => {
    console.log({results})
    return (
        <View
            style={{
                backgroundColor: 'white',
                paddingVertical: 16,
                minHeight: Dimensions.get('screen').height,
                zIndex: 1
                // height: 450
            }}
        >
            {results&&results.hits.map((i, ind) => (
                <TouchableHighlight
                    style={{
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        borderBottomColor: 'gray',
                        borderBottomWidth: 0.5
                    }}
                    key={ind}
                    underlayColor={'gray'}
                    title={i.city&&i.city + ', ' + i.name}
                    onPress={()=>{
                        onSelectEndPoint({name: i.city&&i.city + ', ' + i.name, latitude: i.point.lat, longitude: i.point.lng})
                    }}
                >
                    <Text>{i.city&&i.city + ', '}{i.name}</Text>
                </TouchableHighlight>
            ))}
        </View>
    );
};

const SearchPanel = ({onResponse, center}) => {
    const [searchString, setSearchString] = useState('')

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                {['Красная площадь', 'пр. Мира', 'пр. Ленина'].map((x) => (
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(255,255,255,80)',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderWidth: 0.5,
                            borderColor: 'gray',
                            shadowColor: '#000',
                            elevation: 2,
                            borderRadius: 6,
                            marginHorizontal: 6,
                            marginVertical: 4
                        }}
                        onPress={_=>{
                            setSearchString(x)
                        }}
                    >
                        <Text style={{
                            color: 'gray'
                        }}>{x}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View
                style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    borderColor: 'gray',
                    borderTopWidth: 0.5,
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    marginHorizontal: -0.5,
                    // shadowColor: 'black',
                    // elevation: 4,
                    zIndex: -1,
                    paddingVertical: 4
                }}
            >
                    <View
                        style={{
                            backgroundColor: '#C4C4C4',
                            width: 46,
                            height: 4,
                            borderRadius: 4,
                            margin: 4
                        }}
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TextInput
                            placeholder={'Адрес или место'}
                            value={searchString}
                            onChangeText={setSearchString}
                            style={{
                                flex: 1,
                                margin: 6,
                                backgroundColor: 'hsl(0, 0%, 90%)',
                                borderRadius: 16,
                                borderColor: 'gray',
                                paddingVertical: Platform.OS == 'ios' ? 10 : 4,
                                paddingHorizontal: 16
                            }}
                        />
                        <TouchableOpacity style={{
                            // backgroundColor: 'hsl(200, 70%, 50%)', 
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            borderRadius: 8, 
                        }} onPress={_=>{
                            axios.get('https://graphhopper.com/api/1/geocode?q=+my_query+&type=json&point=+lat+,+lon+&locale=ru&debug=true&key=45a22cf4-a8ac-406f-8086-710e80b2085b'
                                .replace('+my_query+', searchString)
                                .replace('+lon+', center.longitude)
                                .replace('+lat+', center.latitude)
                            , {
                            }).then(response => console.log({response: onResponse(response.data)})).catch(alert)
                        }}>
                            <Text style={{fontSize: 18, color: 'hsl(200, 70%, 50%)'}}>Найти</Text>
                        </TouchableOpacity>
                        {/* <FontAwesomeIcon style={{
                            position: 'absolute',
                            right: 18
                        }} icon={faSearch} color={'gray'} /> */}
                    </View>
            </View>
        </View>
    );
};


export default class App extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            searchString: '',
            myLocation: {
              latitude:0,
              longitude: 0,
              latitudeDelta: 0.09,
              longitudeDelta: 0.02,
            },
            myCustomLocation: null,
            searchResults: null,
            endPoint: null,
            region: null,
            loading: true,
            heatMapPoints: null,
            profile: 'bike'
        }
    }

    // const sheetRef = useRef(null)
    // const mapRef = useRef(null)

    async componentDidMount(){
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
        let promise = new Promise(async resolve => {
            let timeout = setTimeout(_=>{
              resolve({latitude:55.558741, longitude: 37.378847, latitudeDelta: 0.0922, longitudeDelta: 0.0421})
              alert('Это временная защита. Вероятнее всего, вы используете эмулятор. Местоположение будет фиктивно')
                
            }, 4500)
            let res            
            try{
              res = await Location.getCurrentPositionAsync({})
              if (!res.longitude || Math.abs(res.longitude - 37) > 20){
                alert('Это временная защита. Вероятнее всего, вы не находитесь в Москве или используете эмулятор')
                res = {latitude:55.558741, longitude: 37.378847, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
              }
                
            } catch(e){
              res = {latitude:55.558741, longitude: 37.378847, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
              alert('Это временная защита. Вероятнее всего, вы используете эмулятор. Местоположение будет фиктивно')
            }
            resolve({...res, latitudeDelta: 0.0922, longitudeDelta: 0.0421})
            clearTimeout(timeout)
        }).then(location => this.setState({
          myLocation: location,
          region: location
        }))
        let axiosPromise = new Promise(async resolve => {
            let timeout = setTimeout(_=>{
                resolve([])
                alert('Это временная защита. Нет соединения с сервером')
                
            }, 4500)
            let res 
            try{
                res = await axios.get(
                    SERVER_URI + '/api/points'
                )
             }
            catch(e){
              res = {data: []}
                alert('Это временная защита. Нет соединения с сервером')
            }

            resolve(res)
            clearTimeout(timeout)
        }).then(res => this.setState({
          heatMapPoints: res.data.features
        }))
        await Promise.all([ 
            promise,
            axiosPromise
        ]).then(_ => {
          this.setState({ 
              // myLocation: {latitude:55.558741, longitude: 37.378847, latitudeDelta: 0.0922, longitudeDelta: 0.0421},
              // region: {latitude:55.558741, longitude: 37.378847, latitudeDelta: 0.0922, longitudeDelta: 0.0421},
              // myLocation: location,
              // region: location,
              loading: false,
              // heatMapPoints: points.features
          });
        })
    }

    onRegionChange = (region) => {
        this.setState({region})
    }

    flyTo = (region) => {
        this.setState({region})
    }

    setSeatrchResults = (searchResults) => {
        this.setState({searchResults})
    }

    setEndPoint = (endPoint) => {
        this.setState({endPoint, region: {...this.state.region, ...endPoint}})
    }

    getRoute = async () => {
        this.setState({loading: true})
        let response
        try {
            response = await axios.post(SERVER_URI + '/api/get_route/', {
                point_from: [this.state.myLocation.longitude, this.state.myLocation.latitude],
                point_to: [this.state.endPoint.longitude, this.state.endPoint.latitude],
                profile: this.state.profile //'foot' | 'bike'
            })   
        } catch (error) {
            alert(error)
        }

        this.setState({
          loading: false, 
          route: response.data
        })
    }


    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    {/* <Text>{JSON.stringify(this.state.route)}</Text> */} 
                    <MapView style={styles.map} 
                        ref={c => this.mapRef = c}
                        region={this.state.region} 
                        onRegionChangeComplete={this.onRegionChange}
                    >
                        {this.state.heatMapPoints && <Heatmap points={this.state.heatMapPoints.map(x => ({
                            longitude: x.geometry.coordinates[0],
                            latitude: x.geometry.coordinates[1],
                            weight: x.properties.value
                        }))}/>}
                        {this.state.myLocation && <Marker
                            draggable={true}
                            coordinate={this.state.myLocation}
                            onDragEnd={(e) => this.setState({ myLocation: {...this.state.myLocation, ...e.nativeEvent.coordinate} })}
                            key={'me'}
                            // onTouchMove={console.log}
                            title={'me'}
                            description={'here'}
                        />}
                        {this.state.endPoint && <Marker
                            key={'to'}
                            coordinate={this.state.endPoint}
                            pinColor='blue'
                            
                            title={'destination'}
                            description={'where i`m going to'}
                        />}
                        {this.state.route && <Polyline
                            //coordinates={this.state.route.paths.points.coordinates.map(x => ({longitude: x[0], latitude: x[1]}))}
                            coordinates={this.state.route.paths.points.coordinates.map(x => ({longitude: x[0], latitude: x[1]}))}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={6}
                        />}
                    </MapView>
                    {/* <KeyboardAvoidingView> */}
                    {!this.state.endPoint && 
                        <BottomSheet
                            ref={this.sheetRef}
                            snapPoints={['100%', 450, 160]}
                            borderRadius={0}
                            initialSnap={2}
                            
                            renderHeader={_=><SearchPanel onResponse={this.setSeatrchResults} center={this.state.region}/>}
                            renderContent={_=><RenderContent results={this.state.searchResults} onSelectEndPoint={this.setEndPoint} />}
                        />
                    } 
                    {this.state.endPoint &&
                        <>
                            <View style={{
                                position: 'absolute',
                                bottom: 24,
                            }}>
                                <View style={{
                                    width: Dimensions.get('screen').width - 48,
                                    padding: 12,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    marginVertical: 12,
                                }}>
                                    <Text>{this.state.endPoint.name}</Text>
                                    <Text>{this.state.endPoint.latitude}</Text>
                                    <Text style={{fontSize: 11}}>{this.state.route ? (this.state.route.paths.distance / 1000).toFixed(1): '-'} км</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableOpacity onPress={_ => this.setState({endPoint: null, region: this.state.myLocation, route: null})} style={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 8,
                                        padding: 12,
                                        flex: 0,
                                    }}>
                                        <Text>к результатам</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 8,
                                        padding: 12,
                                        flex: 0,
                                    }} onPress={this.getRoute}>
                                        <Text>Проложить маршрут</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>                    
                        </>
                    }
                    {/* </KeyboardAvoidingView> */}
                    
                </View>
                <TouchableOpacity style={{
                    position: 'absolute',
                    top: 40,
                    right: 12,
                    flex: 1,
                    backgroundColor: 'white',
                    padding: 12,
                    borderRadius: 8
                }} onPress={_ => this.setState({profile: this.state.profile == 'bike' ? 'foot' : 'bike'})}>
                    <Text style={{fontSize: 16}}>{this.state.profile}</Text>
                    {/* <FontAwesomeIcon icon={faBicycle}/> */} 
                </TouchableOpacity>
                {this.state.loading && <View style={styles.overlay}>
                    <ActivityIndicator color='gray'/>
                    <Text style={{color: 'gray'}}>loading...</Text>
                </View>}
            </SafeAreaView>
        );
    }

}