import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTasks} from '../../contexts/TaskContext';
import TaskCard from '../../components/TaskCard';
import {COLORS} from '../../utils/colors';
import moment from 'moment';
import 'moment/locale/tr';

// Türkçe yerelleştirmeyi güncelle
moment.updateLocale('tr', {
  months:
    'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split(
      '_',
    ),
  monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
  weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
  weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
  weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
});

// Varsayılan dili Türkçe yap
moment.locale('tr');

const TasksScreen = ({navigation}) => {
  const {tasks, deleteTask, toggleTaskComplete} = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scaleValue = new Animated.Value(1);

  // Görevleri tarihe göre filtrele
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    const selected = new Date(selectedDate);
    return (
      taskDate.getDate() === selected.getDate() &&
      taskDate.getMonth() === selected.getMonth() &&
      taskDate.getFullYear() === selected.getFullYear()
    );
  });

  // Takvimde işaretlenecek tarihleri hazırla
  const markedDates = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      date: new Date(task.dueDate),
      dots: [{color: '#000000FF'}],
    }));

  const handleCreateTask = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() =>
      navigation.navigate('CreateTask', {
        selectedDate: selectedDate.toISOString(),
      }),
    );
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendar}
        calendarHeaderStyle={styles.calendarHeader}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        highlightDateNumberStyle={styles.highlightDateNumber}
        highlightDateNameStyle={styles.highlightDateName}
        markedDates={markedDates}
        selectedDate={selectedDate}
        onDateSelected={date => setSelectedDate(date.toDate())}
        scrollable
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{
          type: 'background',
          duration: 200,
          highlightColor: COLORS.primary,
        }}
        useIsoWeekday={false}
        locale={{
          name: 'tr',
          config: {
            months:
              'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split(
                '_',
              ),
            weekdays:
              'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split(
                '_',
              ),
            weekdaysShort: 'Paz_Pzt_Sal_Çar_Per_Cum_Cmt'.split('_'),
          },
        }}
        startingDate={new Date()}
        minDate={null}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
        iconContainer={{flex: 0.1}}
        calendarHeaderContainerStyle={{
          padding: 10,
        }}
      />
      <FlatList
        data={filteredTasks}
        renderItem={({item}) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('EditTask', {task: item})}
            onDelete={deleteTask}
            onToggleComplete={toggleTaskComplete}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bu tarihte planlanmış görev bulunmuyor
            </Text>
          </View>
        )}
      />
      <Animated.View style={{transform: [{scale: scaleValue}]}}>
        <TouchableOpacity style={styles.fab} onPress={handleCreateTask}>
          <Icon name="plus" size={24} color={COLORS.text.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  calendar: {
    height: 100,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#EBEBEBFF',
  },
  calendarHeader: {
    color: COLORS.text.primary,
    fontSize: 14,
  },
  dateNumber: {
    color: COLORS.text.primary,
    fontSize: 14,
  },
  dateName: {
    color: COLORS.text.secondary,
    fontSize: 12,
  },
  highlightDateNumber: {
    color: COLORS.text.white,
    fontSize: 14,
  },
  highlightDateName: {
    color: COLORS.text.white,
    fontSize: 12,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TasksScreen;
