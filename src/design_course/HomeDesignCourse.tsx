import React, { useState, useEffect   } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryListView from './CategoryListView';
import PopulerCourseListView from './PopulerCourseListView';
import MyPressable from '../components/MyPressable';
import { CATEGORY_LIST, POPULAR_COURSE_LIST } from './model/category';
import { AppImages } from '../assets';
import Config from '../Config';
import { assets } from '../../react-native.config';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CategoryBtn {
  text: string;
  selectedCat: string;
  onPress: () => void;
}

const CATEGORIES = ['디자인', '코딩', '기본 UI'];

const CategoryButton = ({ text, selectedCat, onPress }: CategoryBtn) => (
  <>
    <View style={styleCatrgory(selectedCat === text).categoryBtnContainer}>
      <MyPressable touchOpacity={0.6} onPress={onPress}>
        <Text style={styleCatrgory(selectedCat === text).categoryBtnText}>
          {text}
        </Text>
      </MyPressable>
    </View>
    {text !== CATEGORIES[2] && <View style={{ width: 16 }} />}
  </>
);

const HomeDesignCourse: React.FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('Ui/Ux');

  const paddingTop = Config.isIos
    ? Math.max(insets.top, 20)
    : StatusBar.currentHeight;

  const renderScrollableHeader = (
    <>
      <View style={[styles.searchInputMainContainer, { width: width * 0.75 }]}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[
              styles.searchInput,
              !Config.isAndroid && { paddingVertical: 16 },
            ]}
            autoCapitalize="none"
            selectionColor="dodgerblue"
            placeholderTextColor="#B9BABC"
            placeholder="Search for course"
          />
          <Icon name="search" size={25} color="#B9BABC" />
        </View>
      </View>
      <Text style={styles.sectionHeaderText}>과목</Text>
      <View style={styles.categoryRowContainer}>
        {CATEGORIES.map(text => (
          <CategoryButton
            {...{ text, key: text }}
            selectedCat={selectedCategory}
            onPress={() => setSelectedCategory(text)}
          />
        ))}
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORY_LIST}
        renderItem={data => (
          <CategoryListView
            {...{ data }}
            onScreenClicked={() => navigation.navigate('CourseInfo')}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Text style={styles.sectionHeaderText}>과선택</Text>
    </>
  );


  const [events, setEvents] = useState([]);
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://34.64.153.159/get_event.php');
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date.toISOString().split('T')[0]);

      await axios.post('http://34.64.153.159/add_event.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setDate(new Date());
      fetchEvents();
      setIsAddEventVisible(false);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteEvent = async (id) => {
    if (!id) {
      console.warn('idToDelete is null.');
      return;
    }
    const formData = new FormData();
    formData.append('id', id);
    try {
      await axios.post('http://34.64.153.159/delete_event.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIdToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = (id) => {
    
    Alert.alert(
      '삭제 확인',
      '이 일정을 삭제하시겠습니까?',
      [
        {
          text: '예',
          onPress: () => {
            deleteEvent(id);
          },
        },
        {
          text: '아니오',
          onPress: () => setIdToDelete(null),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const getSelectedItemImage = (item) => {
    if (item == null) {
      return AppImages.design_header_image2;
    } else if (item != 2) {
      return AppImages.design_header_image1;
    } else if (item == 3) {
      return AppImages.design_header_image1;
    }
    // Add more conditions for different IDs and corresponding images
    return AppImages.design_header_image1;
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.headerTextNormal}>예약앱</Text>
          <Text style={styles.headerTextBold}>사용자 화면</Text>
        </View>
        <Image
          style={{ width: 60, height: 60 }}
          source={AppImages.design_header_image}
        />

      </View>
      <View style = {{alignItems:"center"}}>

        </View>

        {!isAddEventVisible ? (
        <>
          <TouchableOpacity
            style={{alignItems: "center"}}
            onPress={() => setIsAddEventVisible(true)}>
            <Text style = {{fontSize: 23,}}>예약하기</Text>
          </TouchableOpacity>

      <FlatList
             data={events}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({item}) => (
              <TouchableOpacity onPress={() => setSelectedItemIndex(item.id)}>

                <View style={{
                 alignItems: "center",
                 justifyContent: "space-between",
                 flexDirection: 'row',
                 backgroundColor: '#FFFFFF',
                 borderRadius: 10,
                 padding: 20,
                 marginBottom: 10,
                 }}>
                 <View>
                 <Text style={styles.headerTextNormal}>가게 이름 : {item.title}</Text></View>
                 <View>
                 <Text style={styles.headerTextNormal}>인원 : {item.description}</Text></View>
                 <View>
                 <Text style={styles.headerTextNormal}>날자 : {item.date}</Text></View>

              <View >

              <TouchableOpacity
               onPress={() => handleDelete(item.id)}
               style={styles.typeBtn}>
               {/* <Image
                 style={{
                   width: 30,
                   height: 30,
                 }}
                 source={require('./delete.png')} // 수정된 부분
                 /> */
                 
                 <Text>취소</Text>
                 }
              </TouchableOpacity> 
              </View>
              </View>
              </TouchableOpacity>

               )}
             />
             
        </>
      ) : (
        <>
          <Text style={{fontSize : 20, marginLeft : 180}}>OO식당</Text>
          <TextInput
            style={styles.input}
            placeholder="인원수"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <TextInput
            style={styles.input}
            placeholder="좌석번호 "
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
         <View style={{
                      alignItems: "center",
                      justifyContent: "space-around",
                      flexDirection: 'row',
                      margin: 10,
                      }}>
                      
          <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.saveButtonText}>날자 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsAddEventVisible(false)}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
         </View> 
        </>
      )}
      <View style={{ marginBottom: 250, flex: 1 }}>
        {selectedItemIndex === null ? (
          <Image source={AppImages.design_header_image1} />
        ) : (
          <Image source={getSelectedItemImage()} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputMainContainer: {
    marginTop: 8,
    marginLeft: 18,
    height: 64,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFB',
    marginVertical: 8,
    borderRadius: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: 'dodgerblue',
  },
  sectionHeaderText: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'WorkSans-SemiBold',
    letterSpacing: 0.27,
    paddingTop: 8,
    paddingLeft: 18,
    paddingRight: 16,
    marginBottom: 16,
  },
  categoryRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 18,
  },
  headerTextNormal: {
    color: 'grey',
    fontFamily: 'WorkSans-Regular',
    letterSpacing: 0.2,
  },
  headerTextBold: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'WorkSans-Bold',
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#0076f3',
    alignItems: 'center',
    padding: 30,
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 8,
    borderRadius:25,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#999999',
    alignItems: 'center',
    padding: 40,
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 8,
    borderRadius:25,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#999999',
    alignItems: 'center',
    padding: 40,
    marginBottom: 0,
    paddingVertical: 8,
    borderRadius:25,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 25,
  },
});

const styleCatrgory = (selected: boolean) =>
  StyleSheet.create({
    categoryBtnContainer: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: 24,
      borderColor: 'rgb(0, 182, 240)',
      borderWidth: 1,
      backgroundColor: selected ? 'rgb(0, 182, 240)' : 'transparent',
    },
    categoryBtnText: {
      padding: 18,
      paddingVertical: 12,
      fontSize: 12,
      fontFamily: 'WorkSans-SemiBold',
      letterSpacing: 0.27,
      alignSelf: 'center',
      color: selected ? 'white' : 'rgb(0, 182, 240)',
    },
  });

export default HomeDesignCourse;
