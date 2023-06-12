import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  ListRenderItemInfo,
  View,
  Text,
  FlatList,
  Easing,
  useWindowDimensions,
  GestureResponderEvent,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyPressable from './components/MyPressable';
import { AppImages } from './assets';
import { showToast } from './util/action';

const DEMOS = [
  {
    name: 'onBoarding',
    background: AppImages.introduction_animation,
    screenName: 'onBoarding',
  },
  {
    name: 'hotel',
    background: AppImages.hotel_booking,
    screenName: 'Hotel',
  },
  {
    name: 'fitness_app',
    background: AppImages.fitness_app,
    screenName: '',
  },
  {
    name: 'design_course',
    background: AppImages.design_course,
    screenName: 'DesignCourse',
  },
];

interface ListItemProps {
  data: ListRenderItemInfo<(typeof DEMOS)[0]>;
  isGrid: boolean;
  onScreenClicked: ((event: GestureResponderEvent) => void) | null | undefined;
}

const ListItem: React.FC<ListItemProps> = ({
  data,
  isGrid,
  onScreenClicked,
}) => {
  const { index, item } = data;

  const { width } = useWindowDimensions();

  const translateY = useRef<Animated.Value>(new Animated.Value(50)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        delay: index * (1000 / 3),
        easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        delay: index * (1000 / 3),
        useNativeDriver: true,
      }),
    ]).start();
  });

  const itemWidth = isGrid ? (width - 36) / 2 : width - 24;

  return (
    <Animated.View
      style={{
        width: itemWidth,
        height: itemWidth / 1.5,
        margin: 6,
        // height: isGrid ? 120 : 250,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Image
        style={[
          styles.demoImg,
          { opacity: item.screenName === '' ? 0.4 : 1.0 }, // Faded if Template is not available
        ]}
        source={item.background}
        resizeMode="cover"
      />

      <MyPressable
        style={styles.demoPressable}
        android_ripple={{ color: 'rgba(128,128,128,0.3)' }}
        touchOpacity={0.6}
        onPress={onScreenClicked}
      />
    </Animated.View>
  );
};

const HomeScene: React.FC = () => {
  const navigation = useNavigation<any>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('password', password);
      let url = '';
      if (selectedOption === 'admin') {
        url = 'http://34.64.153.159/adminlogin.php';
      } else if (selectedOption === 'user') {
        url = 'http://34.64.153.159/login.php';
      }
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;

      if (data === 'Login successful!') {
        navigation.navigate('DesignCourse');
      }
      else if(data === 'adminLogin successful!') {
        navigation.navigate('Hotel');
      }
       else {
        showToast('로그인을 실패했습니다 아이디나 비밀번호를 확인해주십시오.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('password', password);
      formData.append('email', email);
      let url = '';
      if (selectedOption === 'admin') {
        url = 'http://34.64.153.159/admininsertlogin.php';
      } else if (selectedOption === 'user') {
        url = 'http://34.64.153.159/insertlogin.php';
      }
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      
      if (data === 'Registration successful') {
        Alert.alert('회원가입에 성공하였습니다.');

        setId('');
        setPassword('');
        setEmail('');

      }
      else if(data === 'adminRegistration successful'){
        Alert.alert('관리자 회원가입에 성공하였습니다.');

        setId('');
        setPassword('');
        setEmail('');
      }
      else {
        showToast('중복된 아이디가 있습니다.');
      }

    } catch (error) {
      console.error(error);
    }
  };
  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setEmail('');

    // Clear input fields
    setId('');
    setPassword('');
  };
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 50 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>태이블 예약앱</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <TouchableOpacity
              style={[styles.button, selectedOption === 'admin' && styles.selectedButton]}
              onPress={() => setSelectedOption('admin')} >
              <Text style={styles.infoLabel1}>관리자</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, selectedOption === 'user' && styles.selectedButton]} 
                onPress={() => setSelectedOption('user')} >
              <Text style={styles.infoLabel1}>사용자</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.avatarContainer1}>
            <View style={styles.avatarContainer2}>
              <Text style={styles.name2}>Id</Text>
              <TextInput
                style={styles.input}
                placeholder="Id"
                textAlign="left"
                onChangeText={(text) => setId(text)}
                value={id}
              />
              <Text style={styles.name2}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
  
              {isRegistering ? (
                <View>
                  <Text style={styles.name2}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                  />
  
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <TouchableOpacity style={styles.button} onPress={toggleRegistration}>
                      <Text style={styles.infoLabel1}>뒤로가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                      <Text style={styles.infoLabel1}>회원가입</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.infoLabel1}>로그인</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={toggleRegistration}>
                    <Text style={styles.infoLabel1}>회원가입</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 0,
  },
  headerText: {
    flex: 1,
    color: 'black',
    fontSize: 22,
    fontFamily: 'WorkSans-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  demoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  demoPressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  name2: {
    fontSize: 15,
    fontWeight: '600',
    color:'gray',
    marginTop: 20,
  },
  button: {
    margin:10,
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
    paddingVertical: 8,
    borderRadius:5,
  },  
  selectedButton: {
    margin:10,
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
    paddingVertical: 8,
    borderRadius:5,
  },
  infoLabel1: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }, 
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    
    shadowRadius: 6,
    shadowOpacity: 0.16,
  },
  avatarContainer1: {
    width: 300,
    height: 260,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
        
    shadowRadius: 6,
    shadowOpacity: 0.16,
  },  
  avatarContainer2: {
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  nameContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,

  },
  body: {
    marginTop:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 33,
    fontWeight: '600',
    color:'black',
    marginBottom: 20,
  },
});


export default HomeScene;
